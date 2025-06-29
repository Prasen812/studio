'use client';
import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { summarizeActivities } from '@/lib/actions';

export default function AiSummarizerPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [activities, setActivities] = useState(
    '- Designed the new landing page hero section.\n- Fixed authentication flow bug on mobile.\n- Researched performance bottlenecks.'
  );
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');

    if (!date?.from || !activities) {
      // Basic validation
      setIsLoading(false);
      return;
    }

    const dateRange = date.to ? `${format(date.from, 'yyyy-MM-dd')}..${format(date.to, 'yyyy-MM-dd')}` : format(date.from, 'yyyy-MM-dd');

    const result = await summarizeActivities({
      dateRange,
      userActivities: activities,
    });

    setSummary(result.summary);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="AI Summarizer" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-teal-500" />
                  Generate Activity Summary
                </CardTitle>
                <CardDescription>
                  Provide a date range and your activities to generate a concise summary for your status reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <DateRangePicker date={date} onDateChange={setDate} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activities">User Activities</Label>
                  <Textarea
                    id="activities"
                    placeholder="List your completed tasks and activities here, one per line."
                    className="min-h-[150px]"
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="ml-auto bg-teal-500 hover:bg-teal-600 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {summary && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Generated Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{summary}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
