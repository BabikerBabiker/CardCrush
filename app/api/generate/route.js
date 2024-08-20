import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    const data = await req.json();
    const userPrompt = data.prompt;

    const systemPrompt = `
    You are a flashcard creator. Your task is to generate flashcards for various subjects based on the user's input. Make all information accurate as of the current year (2024). Each flashcard should have a clear and concise question on one side and an accurate, informative, and concise answer on the other side. Keep the content under 200 characters for both front and back. Make the content engaging, easy to understand, and free of formatting.
    
    - Respond in the language that the user uses.
    - Use simple and direct language, avoiding jargon and complex terms.
    - For vocabulary flashcards: provide definitions and, if relevant, example sentences.
    - For mathematical concepts: include sample problems and solutions.
    - For historical events: include key dates, significance, and main figures.
    - Organize flashcards by topic, focusing each flashcard on one idea or concept.
    - Use bullet points or numbering to highlight important information if necessary.
    - Break down complex topics into smaller, digestible pieces to avoid overwhelming the user.
    - Provide context where needed to enhance understanding, especially for abstract or technical subjects.
    - Limit the number of flashcards to 10 per request.
    
    Return the flashcards in the following JSON format:
    {
        "flashcards": [{
            "Front": str,
            "Back": str
        }]
    }
    `;

    const result = await model.generateContent(
      `${systemPrompt} \n${userPrompt}`
    );
    let responseText = await result.response.text();
    console.log("Raw response from the model:", responseText);

    responseText = responseText.replace(/^```json\s*/g, "");
    responseText = responseText.replace(/\s*```$/g, "");

    const flashcards = JSON.parse(responseText);

    return NextResponse.json({
      prompt: userPrompt,
      flashcards: flashcards.flashcards,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);

    if (error.message.includes("API_KEY_INVALID")) {
      return new NextResponse(
        "Invalid API Key. Please check your API key and try again.",
        {
          status: 401,
        }
      );
    }

    if (error instanceof SyntaxError) {
      return new NextResponse(
        "Error parsing response JSON. Please ensure the response is valid JSON.",
        {
          status: 400,
        }
      );
    }

    return new NextResponse(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
}
