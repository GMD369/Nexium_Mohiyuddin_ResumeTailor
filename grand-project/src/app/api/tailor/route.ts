import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const body = await req.json()
  const prompt = `
Tailor this resume to the job description:

Resume:
${body.resume}

Job Description:
${body.jobDesc}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })

  const output = response.choices[0].message.content
  return NextResponse.json({ output })
}
