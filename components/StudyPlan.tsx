"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type CodeProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
> & {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export default function StudyPlan() {
    const hydrated = useHydrated();
    const topics = useAppStore((s) => s.topics);
    const [plan, setPlan] = useState<string>("");
    const [loading, setLoading] = useState(false);

    if (!hydrated) return null;

    const generate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/recommend", {
                method: "POST",
                body: JSON.stringify({ topics }),
            });
            const data = await res.json();
            setPlan(data.plan ?? "No plan generated.");
        } catch (err) {
            console.error(err);
            setPlan("⚠️ Failed to generate recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearPlan = () => setPlan("");

    const mdComponents: Components = {
        h1: (props) => <h3 className="text-lg font-semibold mb-2" {...props} />,
        h2: (props) => <h4 className="text-base font-semibold mt-3 mb-1" {...props} />,
        p: (props) => <p className="mb-2" {...props} />,
        ul: (props) => <ul className="list-disc pl-5 mb-2" {...props} />,
        ol: (props) => <ol className="list-decimal pl-5 mb-2" {...props} />,
        li: (props) => <li className="mb-1" {...props} />,
        a: (props) => (
            <a className="underline" style={{ color: "var(--accent)" }} {...props} />
        ),

        code: (props: CodeProps) => {
            const { inline, className, children, ...rest } = props;
            if (inline) {
                return (
                    <code
                        className={`px-1 py-0.5 rounded ${className ?? ""}`}
                        style={{ background: "rgba(255,255,255,0.06)" }}
                        {...rest}
                    >
                        {children}
                    </code>
                );
            }
            return (
                <pre
                    className="p-3 rounded overflow-auto"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                >
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
            );
        },
    };

    return (
        <div
            className="rounded-2xl p-5 shadow border mt-6 transition"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold" style={{ color: "rgba(219,231,255,.85)" }}>
                    Study Plan
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={generate}
                        disabled={loading}
                        className="px-4 py-2 rounded font-medium transition"
                        style={{
                            background: loading ? "rgba(122,162,255,0.4)" : "var(--accent, #7aa2ff)",
                            color: loading ? "rgba(255,255,255,0.8)" : "#0b1220",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Thinking..." : "Generate plan"}
                    </button>

                    {plan && !loading && (
                        <button
                            onClick={clearPlan}
                            className="px-4 py-2 rounded font-medium transition cursor-pointer hover:opacity-90"
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                color: "var(--foreground)",
                                border: "1px solid var(--card-border)",
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div
                className="mt-4 p-4 rounded-lg text-sm overflow-y-auto max-h-[300px]"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                    lineHeight: 1.6,
                }}
            >
                {loading ? (
                    <p className="opacity-80 italic">
                        🧠 Generating a personalized study plan based on your topics...
                    </p>
                ) : plan ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {plan}
                    </ReactMarkdown>
                ) : (
                    <p className="opacity-60">
                        Click <b>Generate plan</b> to get a custom AI-powered study roadmap.
                    </p>
                )}
            </div>
        </div>
    );
}
