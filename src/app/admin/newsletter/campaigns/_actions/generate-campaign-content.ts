"use server";

import { z } from "zod";

const generateCampaignSchema = z.object({
  goal: z.string().min(1, "Campaign goal is required"),
  audience: z.string().optional(),
  tone: z.string().optional(),
  keyPoints: z.string().optional(),
  callToAction: z.string().optional(),
});

const generatedContentSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  previewText: z.string().min(1),
  bodyHtml: z.string().min(1),
  bodyText: z.string().min(1),
});

export type GenerateCampaignInput = z.infer<typeof generateCampaignSchema>;

export type GeneratedCampaignContent = z.infer<typeof generatedContentSchema>;

export async function generateCampaignContent(
  values: GenerateCampaignInput
): Promise<{
  success: boolean;
  content?: GeneratedCampaignContent;
  message?: string;
}> {
  const parsed = generateCampaignSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please provide a campaign goal before generating content.",
    };
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message:
        "AI configuration is missing. Add GEMINI_API_KEY, GOOGLE_AI_API_KEY, or GOOGLE_API_KEY to .env.local.",
    };
  }

  const { goal, audience, tone, keyPoints, callToAction } = parsed.data;

  const prompt = `
You are writing a donor-friendly DIB Foundation newsletter campaign.

Generate a concise campaign draft in JSON only. Do not include markdown fences.

DIB Foundation voice:
- warm
- trustworthy
- hopeful
- community-focused
- clear and concise
- donor/supporter friendly

Do not include unsubscribe text.
Do not mention AI.
Do not create fake statistics.
Do not make unsupported claims.

Campaign goal:
${goal}

Audience:
${audience || "DIB Foundation supporters, donors, volunteers, and community partners"}

Tone:
${tone || "Warm, hopeful, and professional"}

Key points:
${keyPoints || "Recent impact, appreciation, and invitation to continue supporting the mission"}

Call to action:
${callToAction || "Continue supporting DIB Foundation"}

Return exactly this JSON shape:
{
  "title": "Internal admin campaign title",
  "subject": "Email subject line",
  "previewText": "Inbox preview text",
  "bodyHtml": "<h1>...</h1><p>...</p>",
  "bodyText": "Plain text fallback"
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1600,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    return {
      success: false,
      message: `AI generation failed. ${errorText}`,
    };
  }

  const json = await response.json();

  const text = json?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("\n")
    .trim();

  if (!text) {
    return {
      success: false,
      message: "AI did not return campaign content.",
    };
  }

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const rawJson = jsonMatch ? jsonMatch[0] : cleaned;
    const generated = generatedContentSchema.parse(JSON.parse(rawJson));

    return {
      success: true,
      content: generated,
    };
  } catch {
    return {
      success: false,
      message: "AI returned content, but it could not be parsed safely.",
    };
  }
}