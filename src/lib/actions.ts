'use server';

import { summarizeActivities as summarizeActivitiesFlow, type SummarizeActivitiesInput, type SummarizeActivitiesOutput } from '@/ai/flows/summarize-activities';

export async function summarizeActivities(
  input: SummarizeActivitiesInput
): Promise<SummarizeActivitiesOutput> {
  try {
    const result = await summarizeActivitiesFlow(input);
    return result;
  } catch (error) {
    console.error('Error summarizing activities:', error);
    return { summary: 'An error occurred while generating the summary.' };
  }
}
