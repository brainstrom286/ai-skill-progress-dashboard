"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

const SUGGESTED = ["ML", "Math", "DSA", "OS", "Systems", "NLP", "DL", "Other"];

export default function AddTopicForm() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<string>("ML");
    const addTopic = useAppStore((s) => s.addTopic);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const n = name.trim();
                const c = (category || "Other").trim();
                if (!n) return;
                addTopic({ id: crypto.randomUUID(), name: n, category: c, progress: 0, hoursSpent: 0 });
                setName("");
            }}
            className="rounded-2xl p-5 shadow flex gap-3 items-end border"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            <div className="flex-1">
                <label className="block text-sm mb-1" style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)" }}>
                    Topic name
                </label>
                <input
                    className="w-full rounded px-3 py-2"
                    style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Decision Trees"
                />
            </div>

            <div>
                <label className="block text-sm mb-1" style={{ color: "color-mix(in srgb, var(--foreground) 70%, transparent)" }}>
                    Category
                </label>
                <input
                    list="cat-suggestions"
                    className="rounded px-3 py-2"
                    style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., ML, OS, NLP…"
                />
                <datalist id="cat-suggestions">
                    {SUGGESTED.map((c) => <option key={c} value={c} />)}
                </datalist>
            </div>

            <button className="px-4 py-2 rounded" style={{ background: "var(--accent)", color: "#0b1220",cursor: 'pointer' }} type="submit">
                Add
            </button>
        </form>
    );
}
