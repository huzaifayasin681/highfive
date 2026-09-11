import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: id },
    select: { videoUrl: true },
  });

  if (!teacher || !teacher.videoUrl || !teacher.videoUrl.startsWith('data:')) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Parse the data URI
  // Format: data:[<mediatype>][;base64],<data>
  const match = teacher.videoUrl.match(/^data:([^;]+);base64,(.+)$/);
  
  if (!match) {
    return new NextResponse("Invalid video format", { status: 400 });
  }

  const mimeType = match[1];
  const base64Data = match[2];
  
  const buffer = Buffer.from(base64Data, "base64");
  
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes" // Basic support, proper range requests would be better but this works for small videos
    },
  });
}
