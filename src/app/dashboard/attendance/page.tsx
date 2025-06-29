'use client';
import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { DateRange } from 'react-day-picker';
import { attendanceRecords } from '@/lib/data';
import { isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { AttendanceStatus } from '@/lib/types';

const statusStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-green-500 text-white',
  Absent: 'bg-red-500 text-white',
  'Half-day': 'bg-yellow-500 text-black',
  Holiday: 'bg-blue-500 text-white',
};

export default function AttendancePage() {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });

  const presentDays = attendanceRecords.filter((r) => r.status === 'Present').map((r) => r.date);
  const absentDays = attendanceRecords.filter((r) => r.status === 'Absent').map((r) => r.date);
  const halfDays = attendanceRecords.filter((r) => r.status === 'Half-day').map((r) => r.date);
  const holidays = attendanceRecords.filter((r) => r.status === 'Holiday').map((r) => r.date);

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Attendance" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">My Attendance</h2>
            <DateRangePicker date={date} onDateChange={setDate} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                    <span className="text-green-500">✔</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{presentDays.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
                    <span className="text-red-500">✖</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{absentDays.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Half Days</CardTitle>
                    <span className="text-yellow-500">½</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{halfDays.length}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Holidays</CardTitle>
                    <span className="text-blue-500">🎉</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{holidays.length}</div>
                </CardContent>
            </Card>
        </div>
        <Card className="flex-1">
          <CardContent className="p-4 flex justify-center items-start">
            <Calendar
              mode="multiple"
              selected={[...presentDays, ...absentDays, ...halfDays, ...holidays]}
              defaultMonth={date?.from}
              className="p-0"
              modifiers={{
                present: presentDays,
                absent: absentDays,
                halfDay: halfDays,
                holiday: holidays,
              }}
              modifiersClassNames={{
                present: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full',
                absent: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded-full',
                halfDay: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 rounded-full',
                holiday: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full',
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
