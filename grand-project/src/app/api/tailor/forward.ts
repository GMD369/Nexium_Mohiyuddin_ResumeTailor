import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response("Webhook URL not configured.", { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
    // Forward to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const n8nData = await n8nResponse.json();
    // Forward n8n response to /api/tailor/route for filtering
    const filterResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/tailor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n8nData)
    });
    const filteredText = await filterResponse.text();
    return new Response(filteredText, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (e) {
    return new Response("Failed to forward and filter n8n webhook response.", { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
} 