"use client";
import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { Trash2 } from "lucide-react";

type InlineNumberProps = {
    value: number;
    onCommit: (n: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    style?: React.CSSProperties;
    suffix?: string;
};

function clamp(n: number, min = -Infinity, max = Infinity) {
    return Math.max(min, Math.min(max, n));
}

function InlineNumber({
                          value,
                          onCommit,
                          min,
                          max,
                          step = 1,
                          className,
                          style,
                          suffix,
                      }: InlineNumberProps) {
    const [draft, setDraft] = useState<string>(String(value));
    const [editing, setEditing] = useState(false);
    const numeric = useMemo(() => Number.isFinite(Number(draft)) ? Number(draft) : value, [draft, value]);

    const commit = () => {
        const trimmed = draft.trim();
        if (trimmed === "") {
            const next = clamp(0, min ?? -Infinity, max ?? Infinity);
            setDraft(String(next));
            onCommit(next);
            setEditing(false);
            return;
        }
        const n = clamp(Number(trimmed), min ?? -Infinity, max ?? Infinity);
        setDraft(String(n));
        onCommit(n);
        setEditing(false);
    };

    const cancel = () => {
        setDraft(String(value));
        setEditing(false);
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commit();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = clamp((Number(draft || value) || 0) + step, min ?? -Infinity, max ?? Infinity);
            setDraft(String(next));
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = clamp((Number(draft || value) || 0) - step, min ?? -Infinity, max ?? Infinity);
            setDraft(String(next));
        }
    };

    return (
        <div className="flex items-center gap-1">
            <input
                inputMode="numeric"
                type="text"
                className={className}
                style={style}
                value={draft}
                onFocus={() => setEditing(true)}
                onChange={(e) => setDraft(e.target.value.replace(/[^\d.-]/g, ""))}
                onBlur={commit}
                onKeyDown={onKeyDown}
            />
            {suffix ? <span className="opacity-70">{suffix}</span> : null}
        </div>
    );
}

export default function TopicTable() {
    const hydrated = useHydrated();
    const { topics, updateTopic, removeTopic } = useAppStore();
    if (!hydrated) return null;

    return (
        <div
            className="rounded-2xl p-5 shadow border mt-4"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "rgba(219,231,255,.85)" }}>
                Your Topics
            </h2>

            {topics.length === 0 ? (
                <p className="text-sm opacity-70 text-center py-8">
                    No topics yet. Add one above to get started ✨
                </p>
            ) : (
                <>
                    <div
                        className="grid grid-cols-12 gap-3 text-sm font-medium border-b pb-2"
                        style={{ borderColor: "var(--card-border)" }}
                    >
                        <div className="col-span-4">Topic</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Progress</div>
                        <div className="col-span-2">Hours</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {topics.map((t) => (
                        <div
                            key={t.id}
                            className="grid grid-cols-12 gap-3 items-center py-2 border-b"
                            style={{ borderColor: "var(--card-border)" }}
                        >
                            <div className="col-span-4">{t.name}</div>
                            <div className="col-span-2">{t.category}</div>

                            <div className="col-span-2">
                                <InlineNumber
                                    value={t.progress}
                                    min={0}
                                    max={100}
                                    step={1}
                                    suffix="%"
                                    className="w-20 rounded px-2 py-1 text-sm"
                                    style={{
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        border: "1px solid var(--card-border)",
                                    }}
                                    onCommit={(n) => updateTopic(t.id, { progress: n })}
                                />
                            </div>

                            <div className="col-span-2">
                                <InlineNumber
                                    value={t.hoursSpent}
                                    min={0}
                                    step={1}
                                    className="w-20 rounded px-2 py-1 text-sm"
                                    style={{
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        border: "1px solid var(--card-border)",
                                    }}
                                    onCommit={(n) => updateTopic(t.id, { hoursSpent: n })}
                                />
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <button
                                    className="p-2 rounded transition"
                                    style={{ background: "transparent", color: "var(--foreground)" }}
                                    title="Delete"
                                    onClick={() => removeTopic(t.id)}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
