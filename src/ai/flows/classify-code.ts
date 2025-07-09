
// This is an auto-generated file from Firebase Studio.
'use server';

/**
 * @fileOverview A code classification AI agent.
 *
 * - classifyCode - A function that handles the code classification process.
 * - ClassifyCodeInput - The input type for the classifyCode function.
 * - ClassifyCodeOutput - The return type for the classifyCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyCodeInputSchema = z.object({
  code: z.string().describe('The code to classify.'),
});
export type ClassifyCodeInput = z.infer<typeof ClassifyCodeInputSchema>;

const ClassifyCodeOutputSchema = z.object({
  category: z
    .enum(['HTML', 'CSS', 'JavaScript', 'Python', 'SQL', 'React', 'TypeScript', 'C#', 'Other'])
    .describe('The category of the code snippet.'),
});
export type ClassifyCodeOutput = z.infer<typeof ClassifyCodeOutputSchema>;

export async function classifyCode(input: ClassifyCodeInput): Promise<ClassifyCodeOutput> {
  return classifyCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyCodePrompt',
  input: {schema: ClassifyCodeInputSchema},
  output: {schema: ClassifyCodeOutputSchema},
  prompt: `You are an expert code classifier. Given a code snippet, you will classify it into one of the following categories: HTML, CSS, JavaScript, Python, SQL, React, TypeScript, C#, or Other.

Consider React and TypeScript as primary categories if the code is clearly identifiable as such. For generic C-family syntax that isn't clearly C#, or for other languages not listed, use 'Other'.

Code: {{{code}}}`,
});

const classifyCodeFlow = ai.defineFlow(
  {
    name: 'classifyCodeFlow',
    inputSchema: ClassifyCodeInputSchema,
    outputSchema: ClassifyCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

