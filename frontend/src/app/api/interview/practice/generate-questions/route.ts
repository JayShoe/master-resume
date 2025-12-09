import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { InterviewQuestion } from '@/lib/interview/types';

// For static export, we need to mark this as dynamic
// This route requires runtime server access (Anthropic API)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      return new Response(JSON.stringify({ error: 'Job description is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Generate questions using Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Based on the following job description, generate 8-10 interview questions that a candidate might be asked during an interview for this position. Include a mix of:
- Behavioral questions (about past experiences)
- Technical questions (about skills and knowledge required)
- Situational questions (hypothetical scenarios)
- General questions (about career goals and fit)

For each question, provide:
1. The question itself
2. The category (behavioral, technical, situational, or general)
3. Difficulty level (easy, medium, or hard)
4. 2-3 tips for answering the question well

Job Description:
${jobDescription}

Respond with ONLY a valid JSON array of questions in this exact format (no additional text):
[
  {
    "id": "jd-1",
    "question": "Tell me about a time when...",
    "category": "behavioral",
    "difficulty": "medium",
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  }
]

Make the questions specific to the job requirements mentioned in the description. Use sequential IDs like "jd-1", "jd-2", etc.`,
        },
      ],
    });

    // Extract the text content
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    let questions: InterviewQuestion[];
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      questions = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('Failed to parse questions JSON:', textContent.text);
      throw new Error('Failed to parse generated questions');
    }

    // Validate and clean the questions
    const validQuestions = questions
      .filter((q) => q.question && q.category && q.difficulty)
      .map((q, index) => ({
        id: q.id || `jd-${index + 1}`,
        question: q.question,
        category: (['behavioral', 'technical', 'situational', 'general'].includes(q.category)
          ? q.category
          : 'general') as InterviewQuestion['category'],
        difficulty: (['easy', 'medium', 'hard'].includes(q.difficulty)
          ? q.difficulty
          : 'medium') as InterviewQuestion['difficulty'],
        tips: Array.isArray(q.tips) ? q.tips : [],
      }));

    return new Response(JSON.stringify({ questions: validQuestions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
