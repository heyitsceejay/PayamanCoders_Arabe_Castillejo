import Bytez from 'bytez.js';

// Initialize Bytez SDK
const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY;
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured');
  }
  return new Bytez(apiKey);
};

const model = getBytezClient().model('openai/gpt-4.1');

export interface LearningResource {
  title: string;
  description: string;
  url: string;
  type: 'Course' | 'Tutorial' | 'Documentation' | 'Video' | 'Article' | 'Book';
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  isFree: boolean;
  rating?: string;
}

export async function getLearningResources(
  careerTitle: string,
  skills: string[]
): Promise<LearningResource[]> {
  try {
    console.log('🤖 AI Learning Resources - Starting search');
    console.log('📊 Career:', careerTitle);
    console.log('📊 Skills:', skills);

    const prompt = `You are an expert career advisor and learning resource curator. Based on the career path and required skills, recommend the best learning resources available on the internet.

Career Path: ${careerTitle}
Required Skills: ${skills.join(', ')}

CRITICAL INSTRUCTIONS:
1. ONLY provide resources that you are CERTAIN exist with REAL, WORKING URLs
2. Use ONLY well-known, established platforms
3. For YouTube, use actual channel names or search URLs
4. For courses, use platform homepages or category pages if you're not sure of specific course URLs
5. DO NOT make up or guess URLs - if unsure, use the platform's main page or search page

Provide 8-10 high-quality learning resources. For each resource:
1. Title of the course/resource
2. Brief description (1-2 sentences)
3. REAL, WORKING URL (use platform homepage if specific URL unknown)
4. Type (Course, Tutorial, Documentation, Video, Article, or Book)
5. Platform name
6. Difficulty level (Beginner, Intermediate, or Advanced)
7. Estimated time to complete
8. Whether it's free or paid
9. Rating or popularity indicator if available

VERIFIED PLATFORMS TO USE:
- Coursera: https://www.coursera.org/
- Udemy: https://www.udemy.com/
- YouTube: https://www.youtube.com/
- freeCodeCamp: https://www.freecodecamp.org/
- MDN Web Docs: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/
- LinkedIn Learning: https://www.linkedin.com/learning/
- Pluralsight: https://www.pluralsight.com/
- Khan Academy: https://www.khanacademy.org/
- edX: https://www.edx.org/

EXAMPLE OF SAFE URLs:
- https://www.coursera.org/search?query=web+development
- https://www.youtube.com/results?search_query=javascript+tutorial
- https://www.udemy.com/courses/search/?q=python

Respond in JSON format:
{
  "resources": [
    {
      "title": "Resource Title",
      "description": "Brief description of what you'll learn",
      "url": "https://actual-url.com",
      "type": "Course",
      "platform": "Platform Name",
      "difficulty": "Beginner",
      "estimatedTime": "4 weeks",
      "isFree": true,
      "rating": "4.8/5"
    }
  ]
}`;

    console.log('📤 Sending prompt to AI...');
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    console.log('📥 AI Response - Error:', error);
    console.log('📥 AI Response - Output type:', typeof output);

    if (error) {
      console.error('❌ AI learning resources error:', error);
      throw new Error(`AI Error: ${JSON.stringify(error)}`);
    }

    // Handle both string and object responses
    let parsed;
    if (typeof output === 'string') {
      console.log('🔍 Parsing string output...');
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : output;
      parsed = JSON.parse(jsonStr);
    } else if (typeof output === 'object') {
      console.log('🔍 Handling Bytez object response...');
      // Bytez returns {role: 'assistant', content: 'json_string'}
      if (output.content && typeof output.content === 'string') {
        console.log('📝 Extracting and parsing content from Bytez response...');
        const jsonMatch = output.content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        let jsonStr = jsonMatch ? jsonMatch[1] : output.content;
        
        console.log('📝 Raw JSON string (first 500 chars):', jsonStr.substring(0, 500));
        
        try {
          // Clean up common JSON issues
          jsonStr = jsonStr
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/:\s*true\s*\([^)]+\)/g, ': true') // Fix: true (with text) -> true
            .replace(/:\s*false\s*\([^)]+\)/g, ': false') // Fix: false (with text) -> false
            .replace(/"\s*\([^)]+\)\s*"/g, '""') // Remove parenthetical notes in strings
            .replace(/,\s*}/g, '}') // Remove trailing commas before }
            .replace(/,\s*]/g, ']') // Remove trailing commas before ]
            .replace(/\n/g, ' ') // Remove newlines
            .replace(/\r/g, '') // Remove carriage returns
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          parsed = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          console.error('❌ Failed JSON string (first 2000 chars):', jsonStr.substring(0, 2000));
          throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } else {
        console.log('🔍 Using object output directly');
        parsed = output;
      }
    } else {
      console.error('❌ Unexpected output type:', typeof output);
      throw new Error('Unexpected output type from AI');
    }

    console.log('✅ Parsed result:', parsed);
    const resources = parsed.resources || [];
    console.log('✅ Returning resources:', resources.length);
    
    return resources;
  } catch (error) {
    console.error('❌ Error getting learning resources:', error);
    throw error;
  }
}
