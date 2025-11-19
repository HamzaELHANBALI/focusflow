import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // OpenAI SDK requires Node.js runtime
export const dynamic = "force-dynamic"; // Ensure routes are not statically optimized
export const maxDuration = 30; // Maximum execution time in seconds

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const { task } = await request.json();

    if (!task || typeof task !== "string") {
      return NextResponse.json(
        { error: "Task is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Break the following task into 3–7 small, actionable, developer-friendly subtasks.

Provide **only** a list of 3–7 short titles. Each title should be a single line, concise and actionable.

Task: ${task}

Return only the list of subtasks, one per line, without numbering or bullets.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that breaks down large tasks into small, actionable subtasks. Return only the list of subtasks, one per line.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const responseText =
      completion.choices[0]?.message?.content?.trim() || "";
    const subtasks = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 7);

    if (subtasks.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate subtasks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subtasks });
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return NextResponse.json(
      { error: "Failed to generate subtasks" },
      { status: 500 }
    );
  }
}

