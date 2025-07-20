import { NextResponse } from "next/server"

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')      // Remove HTML tags
    .replace(/\n|\r|\t/g, ' ') // Remove escaped newlines/tabs
    .replace(/[\[\]{}]/g, '')   // Remove brackets
    .replace(/\*/g, '')          // Remove asterisks
    .replace(/[_`~]/g, '')        // Remove markdown special chars
    .replace(/\s+/g, ' ')        // Collapse extra spaces
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Try to extract the main text field from n8n response
    const text = body.tailored_resume || body.output || body.text || JSON.stringify(body);
    if (!text) {
      return new Response("No text found in request body.", { status: 400, headers: { 'Content-Type': 'text/plain' } });
    }
    const filtered = cleanText(text);
    return new Response(filtered, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (e) {
    return new Response("Invalid request or JSON.", { status: 400, headers: { 'Content-Type': 'text/plain' } });
  }
}
