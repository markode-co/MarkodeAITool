import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
});
/**
 * توليد مشروع كامل بناءً على وصف المستخدم
 */
export async function generateProjectCode(prompt, framework, language) {
    if (!prompt || prompt.trim().length === 0) {
        throw new Error("Prompt cannot be empty");
    }
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert full-stack developer who generates complete, production-ready code based on project descriptions.

Generate a complete project structure with all necessary files based on the user's description. 

Requirements:
- Fully functional application
- Include package.json, configuration files, and source code
- Modern best practices, clean code
- Error handling and validation
- Responsive, accessible UI components
- Support Arabic and English if mentioned
- Use TypeScript if possible
- Include deployment instructions

Respond in JSON format exactly as:
{
  "files": { "file/path": "content" },
  "framework": "react|vue|angular|vanilla|nodejs|python|php",
  "language": "javascript|typescript|python|php",
  "deploymentInstructions": "step-by-step instructions"
}`
                },
                {
                    role: "user",
                    content: `Generate a complete project for: ${prompt}
${framework ? `Preferred framework: ${framework}` : ''}
${language ? `Preferred language: ${language}` : ''}

Include all necessary files, configuration, source code, and styling.`
                }
            ],
            response_format: { type: "json_object" },
        });
        // ⚡ تأكد من وجود محتوى
        const resultRaw = response.choices?.[0]?.message?.content;
        if (!resultRaw)
            throw new Error("No response from OpenAI");
        const result = typeof resultRaw === "string" ? JSON.parse(resultRaw) : resultRaw;
        return {
            files: result.files || {},
            framework: result.framework || "react",
            language: result.language || "javascript",
            deploymentInstructions: result.deploymentInstructions || "No deployment instructions provided",
        };
    }
    catch (error) {
        console.error("Error generating project code:", error);
        throw new Error("Failed to generate project code");
    }
}
/**
 * تنظيف الكود من fences أو markdown
 */
function sanitizeCodeOutput(rawOutput) {
    if (!rawOutput || typeof rawOutput !== "string") {
        throw new Error("Invalid code output received");
    }
    let cleaned = rawOutput.trim();
    cleaned = cleaned.replace(/^```.*$/gm, "").replace(/^~~~.*$/gm, "").trim();
    if (!cleaned)
        throw new Error("Empty code output after sanitization");
    return cleaned;
}
/**
 * تحسين كود موجود بناءً على تعليمات محددة
 */
export async function improveCode(code, improvements) {
    if (!code?.trim())
        throw new Error("Invalid code input");
    if (!improvements?.trim())
        throw new Error("Invalid improvements input");
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert developer who improves code. Return ONLY the improved code without explanations, markdown, or code fences."
                },
                {
                    role: "user",
                    content: `Improve this code according to:
${improvements.trim()}

Original code:
${code}

Return ONLY the clean improved code:`
                }
            ],
        });
        const rawOutput = response.choices?.[0]?.message?.content;
        if (!rawOutput)
            throw new Error("No response received from OpenAI");
        return sanitizeCodeOutput(rawOutput);
    }
    catch (error) {
        console.error("Error improving code:", error);
        throw new Error("Failed to improve code");
    }
}
