import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function heuristicPlan(topics: any[]) {
    const names = new Set<string>();
    const low =
        (Array.isArray(topics) ? topics : [])
            .slice()
            .sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0))
            .filter((t) => {
                const n = String(t?.name || "").trim();
                if (!n || names.has(n)) return false;
                names.add(n);
                return true;
            })
            .slice(0, 3)
            .map((t) => t.name)
            .join(", ") || "your lowest-progress topics";

    return `Heuristic Plan:
- Focus next on: ${low}.
- Daily (2–3h): 60% practice, 40% theory.
- For each topic: 1 tutorial, 10 problems, and 1-page notes.
- End-of-week: build a tiny recap project mixing 2–3 topics.`;
}

async function listGeminiModels(key: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        key
    )}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`ListModels HTTP ${res.status}`);
    const json = await res.json();
    const models: string[] = (json.models ?? [])
        .filter(
            (m: any) =>
                Array.isArray(m.supportedGenerationMethods) &&
                m.supportedGenerationMethods.includes("generateContent")
        )
        .map((m: any) => String(m.name || "").replace(/^models\//, "")); // bare id for SDK
    return models;
}

export async function POST(req: Request) {
    const { topics = [] } = await req.json();

    const topicList = topics
        .map(
            (t: any) =>
                `• ${t.name} (${t.category || "Other"}) — ${t.progress ?? 0}% done, ${t.hoursSpent ?? 0}h spent`
        )
        .join("\n");

    const prompt = `
You are an expert AI/ML mentor. Given the student's topics, progress %, and hours spent, produce a concise 7-day plan for the students.
Prioritize categories with lower progress and low hours. Each day: 2–3 bullet tasks with concrete outcomes.
Keep it ~180–220 words.
Topics:
${topicList}
`.trim();

    // Try Gemini
    try {
        const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!key) throw new Error("Missing GEMINI_API_KEY / GOOGLE_API_KEY");

        const preferred = process.env.GEMINI_MODEL
            ? [process.env.GEMINI_MODEL]
            : [
                "gemini-1.5-flash-latest",
                "gemini-1.5-flash-8b",
                "gemini-1.5-pro-latest",
            ];

        let discovered: string[] = [];
        try {
            discovered = await listGeminiModels(key);
        } catch (e) {
            console.error("ListModels failed:", e);
        }

        const candidates = Array.from(new Set([...preferred, ...discovered])).sort((a, b) => {
            const aw = /1\.5|latest|flash|pro/i.test(a) ? 1 : 0;
            const bw = /1\.5|latest|flash|pro/i.test(b) ? 1 : 0;
            return bw - aw;
        });

        const genAI = new GoogleGenerativeAI(key);
        let lastErr: unknown = null;

        for (const modelId of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: modelId });
                const result = await model.generateContent(prompt);
                const plan =
                    result.response?.text?.() ||
                    result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    null;

                if (plan) {
                    return NextResponse.json({ plan, source: `gemini:${modelId}` });
                }
            } catch (e) {
                lastErr = e;
            }
        }

        console.error("Gemini attempts failed. Last error:", lastErr);
    } catch (e) {
        console.error("Gemini setup error:", e);
    }

    return NextResponse.json({ plan: heuristicPlan(topics), source: "heuristic" });
}
