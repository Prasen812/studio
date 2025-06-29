// Summarize user activity flow.

'use server';

/**
 * @fileOverview A user activity summarization AI agent.
 *
 * - summarizeActivities - A function that handles the summarization process.
 * - SummarizeActivitiesInput - The input type for the summarizeActivities function.
 * - SummarizeActivitiesOutput - The return type for the summarizeActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeActivitiesInputSchema = z.object({
  dateRange: z
    .string()
    .describe('The date range to summarize activities for, e.g., YYYY-MM-DD..YYYY-MM-DD.'),
  userActivities: z.string().describe('The user activities to summarize.'),
});
export type SummarizeActivitiesInput = z.infer<typeof SummarizeActivitiesInputSchema>;

const SummarizeActivitiesOutputSchema = z.object({
  summary: z.string().describe('The summary of the user activities.'),
});
export type SummarizeActivitiesOutput = z.infer<typeof SummarizeActivitiesOutputSchema>;

export async function summarizeActivities(input: SummarizeActivitiesInput): Promise<SummarizeActivitiesOutput> {
  return summarizeActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeActivitiesPrompt',
  input: {schema: SummarizeActivitiesInputSchema},
  output: {schema: SummarizeActivitiesOutputSchema},
  prompt: `You are an AI that summarizes user activities for a given date range.

  Date Range: {{{dateRange}}}
  Activities: {{{userActivities}}}

  Please provide a concise summary of the user's activities within the specified date range.`,
});

const summarizeActivitiesFlow = ai.defineFlow(
  {
    name: 'summarizeActivitiesFlow',
    inputSchema: SummarizeActivitiesInputSchema,
    outputSchema: SummarizeActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
