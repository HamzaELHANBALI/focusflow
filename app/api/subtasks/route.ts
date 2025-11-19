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
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { task } = await request.json();

    if (!task || typeof task !== "string") {
      return NextResponse.json(
        { error: "Task is required" },
        { status: 400 }
      );
    }

    const prompt = `Analyze the following task and break it down into the appropriate number of small, actionable subtasks.

IMPORTANT RULES:
- If the task is simple and can be done in one step, return "NO_SUBTASKS" (no subtasks needed)
- If the task needs 1-2 subtasks, return exactly that many
- If the task needs 3-7 subtasks, return that many
- Only create subtasks if they are truly needed - don't create unnecessary breakdowns
- Each subtask should be a single, actionable step
- Keep subtask titles concise (one line each)

Task: ${task}

Return only the list of subtasks, one per line, without numbering or bullets. If no subtasks are needed, return only "NO_SUBTASKS".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that intelligently breaks down tasks. Only create subtasks if they are truly needed. If a task is simple enough to do directly, return 'NO_SUBTASKS'. Otherwise, return only the necessary subtasks, one per line.",
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
    
    // Check if AI determined no subtasks are needed
    if (responseText.toUpperCase().includes("NO_SUBTASKS") || responseText.toUpperCase().includes("NO SUBTASKS")) {
      return NextResponse.json({ subtasks: [] });
    }

    const subtasks = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.toUpperCase().includes("NO_SUBTASKS"));

    // Return empty array if no valid subtasks, or the subtasks
    return NextResponse.json({ subtasks });
  } catch (error) {
    console.error("Error generating subtasks:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to generate subtasks",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

