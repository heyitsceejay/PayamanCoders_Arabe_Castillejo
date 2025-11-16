import { NextRequest, NextResponse } from 'next/server';
import Bytez from 'bytez.js';

export async function POST(request: NextRequest) {
  try {
    const { jobRole, experience, industry } = await request.json();

    if (!jobRole) {
      return NextResponse.json(
        { error: 'Job role is required' },
        { status: 400 }
      );
    }

    const experienceText = experience
      ? ` for a ${experience} level position`
      : '';
    const industryText = industry ? ` in the ${industry} industry` : '';

    const prompt = `Generate comprehensive interview preparation tips for a ${jobRole}${experienceText}${industryText}.

Please provide:
1. Specific tips organized by categories (Technical Skills, Behavioral Questions, Communication, etc.)
2. 5-7 common interview questions specific to this role
3. A preparation checklist with 5-7 actionable steps

Format your response as JSON with this structure:
{
  "tips": [
    {
      "category": "Category Name",
      "tips": ["tip 1", "tip 2", "tip 3"]
    }
  ],
  "commonQuestions": ["question 1", "question 2"],
  "preparationSteps": ["step 1", "step 2"]
}

Make the tips specific, actionable, and relevant to the role.`;

    try {
      const apiKey = process.env.BYTEZ_API_KEY;
      if (!apiKey) {
        throw new Error('BYTEZ_API_KEY not configured');
      }

      const bytez = new Bytez(apiKey);
      const model = bytez.model('openai/gpt-4.1');
      
      const { error, output } = await model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        console.error('AI generation error:', error);
        return NextResponse.json(createFallbackResponse(jobRole, experience, industry));
      }

      // Try to parse JSON from AI response
      let parsedResponse;
      try {
        // Handle both string and object responses
        if (typeof output === 'string') {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : output;
          parsedResponse = JSON.parse(jsonString);
        } else if (typeof output === 'object') {
          parsedResponse = output;
        } else {
          throw new Error('Unexpected output type');
        }
      } catch (parseError) {
        // If AI response isn't valid JSON, create a structured fallback
        console.error('Failed to parse AI response as JSON:', parseError);
        parsedResponse = createFallbackResponse(jobRole, experience, industry);
      }

      return NextResponse.json(parsedResponse);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // Return fallback response if AI fails
      return NextResponse.json(createFallbackResponse(jobRole, experience, industry));
    }
  } catch (error) {
    console.error('Interview tips error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createFallbackResponse(jobRole: string, experience: string, industry: string) {
  return {
    tips: [
      {
        category: 'Technical Preparation',
        tips: [
          `Review core concepts and technologies relevant to ${jobRole}`,
          'Practice coding problems or case studies related to the role',
          'Prepare examples of projects that demonstrate your technical skills',
          'Be ready to explain your technical decisions and trade-offs'
        ]
      },
      {
        category: 'Behavioral Questions',
        tips: [
          'Use the STAR method (Situation, Task, Action, Result) for answers',
          'Prepare stories that showcase leadership, teamwork, and problem-solving',
          'Be honest about challenges and what you learned from them',
          'Show how your experiences align with the company values'
        ]
      },
      {
        category: 'Communication Skills',
        tips: [
          'Practice explaining complex concepts in simple terms',
          'Listen carefully to questions before answering',
          'Ask clarifying questions when needed',
          'Maintain good eye contact and positive body language'
        ]
      },
      {
        category: 'Company Research',
        tips: [
          'Study the company\'s products, services, and recent news',
          'Understand their mission, values, and culture',
          'Research the team and interviewers on LinkedIn',
          'Prepare thoughtful questions about the role and company'
        ]
      }
    ],
    commonQuestions: [
      `Tell me about your experience with ${jobRole} responsibilities`,
      'Describe a challenging project you worked on and how you overcame obstacles',
      'How do you stay updated with industry trends and new technologies?',
      'Tell me about a time you had to work with a difficult team member',
      'Where do you see yourself in 3-5 years?',
      'Why are you interested in this role and our company?',
      'What are your greatest strengths and areas for improvement?'
    ],
    preparationSteps: [
      'Research the company thoroughly (website, news, social media)',
      'Review the job description and match your experience to requirements',
      'Prepare 3-5 strong examples using the STAR method',
      'Practice common interview questions out loud',
      'Prepare 5-7 thoughtful questions to ask the interviewer',
      'Test your technology setup for virtual interviews',
      'Plan your outfit and logistics the day before'
    ]
  };
}
