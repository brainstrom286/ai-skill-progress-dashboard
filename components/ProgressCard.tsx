"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";

const CALC_MODE: "average" | "weighted" | "sum" = "weighted";

const COLORS = ["#7aa2ff", "#79c0ff", "#8bd1ff", "#a5e0ff", "#c7e6ff"];

export default function ProgressCard() {
    const hydrated = useHydrated();
    const { topics } = useAppStore();
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const avgDisplay = useMemo(() => {
        if (!hydrated) return "—";
        const avg = topics.length
            ? Math.round(topics.reduce((a, t) => a + t.progress, 0) / topics.length)
            : 0;
        return `${avg}%`;
    }, [hydrated, topics]);

    const data = useMemo(() => {
        type Acc = { total: number; count: number; hours: number };
        const m = new Map<string, Acc>();
        for (const t of topics) {
            const key = (t.category || "Other").trim();
            const prev = m.get(key) ?? { total: 0, count: 0, hours: 0 };
            prev.total += Number(t.progress || 0);
            prev.count += 1;
            prev.hours += Number(t.hoursSpent || 0);
            m.set(key, prev);
        }
        const arr = Array.from(m, ([category, v]) => {
            let value = 0;
            if (CALC_MODE === "average") {
                value = v.count ? v.total / v.count : 0;
            } else if (CALC_MODE === "weighted") {
                value = v.hours > 0
                    ? topics
                        .filter(t => (t.category || "Other").trim() === category)
                        .reduce((s, t) => s + (t.progress || 0) * (t.hoursSpent || 0), 0) /
                    topics
                        .filter(t => (t.category || "Other").trim() === category)
                        .reduce((s, t) => s + (t.hoursSpent || 0), 0)
                    : (v.count ? v.total / v.count : 0);
            } else if (CALC_MODE === "sum") {
                value = Math.min(100, v.total); // cap at 100
            }
            return { category, progress: Math.round(value) };
        });
        return arr;
    }, [topics]);

    return (
        <div
            className="rounded-2xl p-5 shadow border"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold" style={{ color: "rgba(219,231,255,.85)" }}>
                    Category Progress
                </h2>
                <span className="text-3xl font-bold">{avgDisplay}</span>
            </div>

            {!hydrated ? (
                <div className="h-64" />
            ) : data.length > 0 ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="category" tick={{ fill: "var(--foreground)" }} />
                            <YAxis tick={{ fill: "var(--foreground)" }} domain={[0, 100]} />

                            {/* ✅ Fix the black hover box */}
                            <Tooltip
                                cursor={{ fill: "rgba(122,162,255,0.12)" }}   // soft translucent blue
                                contentStyle={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    color: "var(--foreground)",
                                }}
                                labelStyle={{ color: "var(--foreground)" }}
                                itemStyle={{ color: "var(--foreground)" }}
                                formatter={(v: any) => [`${v}%`, "Avg progress"]}
                                labelFormatter={(label: any) => `Category: ${label}`}
                            />

                            {/* Keep bar colors stable on hover */}
                            <Bar dataKey="progress" stroke="none" isAnimationActive={false}>
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-sm opacity-70 mt-3 text-center">Add topics to start tracking progress ✨</p>
            )}
        </div>
    );
}
