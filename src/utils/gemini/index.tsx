import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if the API key is loaded correctly
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Modified function to accept a prompt and return the generated content
export async function getGeneratedContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    
    if (error.message.includes("API key not valid")) {
      return "Error: API key is invalid or not properly set. Please check your environment variables.";
    }
    
    return `An error occurred while generating content: ${error.message}`;
  }
}
