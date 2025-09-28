import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY 
});

export interface GeneratedCode {
  files: Record<string, string>;
  framework: string;
  language: string;
  deploymentInstructions: string;
}

export async function generateProjectCode(
  prompt: string, 
  framework?: string,
  language?: string
): Promise<GeneratedCode> {
  try {
    // Use the latest available OpenAI model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert full-stack developer who generates complete, production-ready code based on project descriptions.

Generate a complete project structure with all necessary files based on the user's description. 

Requirements:
- Create a fully functional application
- Include package.json, configuration files, and all source code
- Use modern best practices and clean code
- Include proper error handling and validation
- Generate responsive, accessible UI components
- Support both Arabic and English if mentioned
- Use TypeScript when possible
- Include deployment instructions

Respond with JSON in this exact format:
{
  "files": {
    "package.json": "file content here",
    "src/index.js": "file content here",
    "src/components/App.js": "file content here",
    // ... all necessary files
  },
  "framework": "react|vue|angular|vanilla|nodejs|python|php",
  "language": "javascript|typescript|python|php",
  "deploymentInstructions": "Step-by-step deployment instructions"
}`
        },
        {
          role: "user",
          content: `Generate a complete project for: ${prompt}

${framework ? `Preferred framework: ${framework}` : ''}
${language ? `Preferred language: ${language}` : ''}

Create all necessary files including configuration, source code, and styling.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      files: result.files || {},
      framework: result.framework || 'react',
      language: result.language || 'javascript',
      deploymentInstructions: result.deploymentInstructions || 'No deployment instructions provided'
    };
  } catch (error) {
    console.error('Error generating project code:', error);
    throw new Error('Failed to generate project code');
  }
}

function sanitizeCodeOutput(rawOutput: string): string {
  if (!rawOutput || typeof rawOutput !== 'string') {
    throw new Error('Invalid code output received');
  }

  let cleaned = rawOutput.trim();
  
  // Remove all lines that are markdown code fences (``` or ~~~ with any language/spaces)
  cleaned = cleaned.replace(/^```.*$/gm, '');  // Remove all ``` fence lines
  cleaned = cleaned.replace(/^~~~.*$/gm, '');  // Remove all ~~~ fence lines
  
  // Remove any leading/trailing whitespace again
  cleaned = cleaned.trim();
  
  if (!cleaned) {
    throw new Error('Empty code output after sanitization');
  }
  
  return cleaned;
}

export async function improveCode(
  code: string,
  improvements: string
): Promise<string> {
  try {
    // Validate inputs
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      throw new Error('Invalid code input');
    }
    
    if (!improvements || typeof improvements !== 'string' || improvements.trim().length === 0) {
      throw new Error('Invalid improvements input');
    }

    // Use the latest available OpenAI model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert developer who improves and optimizes code based on specific requirements. Return ONLY the improved code without any explanations, markdown formatting, or code fences. Do not include ``` or language tags."
        },
        {
          role: "user",
          content: `Improve this code based on the following requirements:
${improvements.trim()}

Original code:
${code}

Return only the clean improved code without any markdown formatting:`
        }
      ],
    });

    const rawOutput = response.choices[0].message.content;
    if (!rawOutput) {
      throw new Error('No response received from OpenAI');
    }

    return sanitizeCodeOutput(rawOutput);
  } catch (error) {
    console.error('Error improving code:', error);
    throw new Error('Failed to improve code');
  }
}
