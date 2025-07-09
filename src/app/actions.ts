'use server';

import { classifyCode as classifyCodeFlow, type ClassifyCodeInput, type ClassifyCodeOutput } from '@/ai/flows/classify-code';

interface ClassificationResult extends ClassifyCodeOutput {
  error?: string;
}

export async function performCodeClassification(input: ClassifyCodeInput): Promise<ClassificationResult> {
  try {
    const result = await classifyCodeFlow(input);
    return result;
  } catch (error) {
    console.error("Error during code classification:", error);
    // Return 'Other' category and the error message if classification fails
    return { category: 'Other' as const, error: (error instanceof Error ? error.message : String(error)) };
  }
}
