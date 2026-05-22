import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { assistantId, role, text } = body;

  if (!assistantId || !role || !text) {
    return NextResponse.json(
      { error: "assistantId, role and text are required" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      assistantId,
      role,
      text,
    },
  });

  return NextResponse.json(message);
}