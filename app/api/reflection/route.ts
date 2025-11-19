import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { subtask, userNotes, finished } = await request.json();

    if (!subtask || !userNotes || typeof finished !== "boolean") {
      return NextResponse.json(
        { error: "subtask, userNotes, and finished are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `The user worked on the subtask: ${subtask}

Here's what they say they did: ${userNotes}

They finished: ${finished ? "Yes" : "No"}

Determine:
1. Did they drift off the core subtask? (true/false)
2. Provide a short drift warning if yes (1-2 sentences max)
3. Give the best next step (1 sentence)
4. Give one sentence of encouragement

Respond in JSON format:
{
  "drift": boolean,
  "driftMessage": "string (only if drift is true)",
  "nextStep": "string",
  "encouragement": "string"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful focus coach. Analyze the user's work session and provide constructive feedback. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const responseText =
      completion.choices[0]?.message?.content?.trim() || "";
    let aiResponse;

    try {
      aiResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json(
        {
          drift: false,
          nextStep: "Continue working on your current subtask.",
          encouragement: "Keep up the great work!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      drift: aiResponse.drift === true,
      driftMessage: aiResponse.driftMessage || undefined,
      nextStep: aiResponse.nextStep || "Continue working on your current subtask.",
      encouragement: aiResponse.encouragement || "Keep up the great work!",
    });
  } catch (error) {
    console.error("Error generating reflection:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}

