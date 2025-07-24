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
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[API/tailor] Webhook URL not configured.");
      return new Response("Webhook URL not configured.", { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
    // Forward to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`[API/tailor] n8n webhook error: ${n8nResponse.status} - ${errorText}`);
      return new Response(`n8n webhook error: ${n8nResponse.status}: ${errorText}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
    let n8nData;
    let text;
    try {
      n8nData = await n8nResponse.json();
      text = n8nData.tailored_resume || n8nData.output || n8nData.text || JSON.stringify(n8nData);
    } catch (jsonErr) {
      console.error(`[API/tailor] Failed to parse n8n response as JSON, trying plain text...`, jsonErr);
      try {
        text = await n8nResponse.text();
      } catch (textErr) {
        console.error(`[API/tailor] Also failed to read n8n response as text:`, textErr);
        return new Response("Failed to parse n8n response as JSON or text.", { status: 500, headers: { 'Content-Type': 'text/plain' } });
      }
    }
    if (!text) {
      console.error("[API/tailor] No text found in n8n response.", n8nData);
      return new Response("No text found in n8n response.", { status: 400, headers: { 'Content-Type': 'text/plain' } });
    }
    const filtered = cleanText(text);

    // Save to MongoDB
    try {
      const db = await getDb();
      await db.collection('resumes').insertOne({ resume: filtered, createdAt: new Date() });
    } catch (mongoErr) {
      console.error('[API/tailor] Failed to save resume to MongoDB:', mongoErr);
      // Don't block response if DB fails
    }

    return new Response(filtered, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (e) {
    if (e instanceof Error) {
      console.error("[API/tailor] Unexpected error:", e.stack || e.message);
    } else {
      console.error("[API/tailor] Unexpected error:", e);
    }
    return new Response("Failed to forward and filter n8n webhook response.", { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}
