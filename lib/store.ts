"use client";

import { create } from "zustand";
import type { Topic } from "./types";

type State = {
    topics: Topic[];
    addTopic: (t: Topic) => void;
    updateTopic: (id: string, patch: Partial<Topic>) => void;
    removeTopic: (id: string) => void;
    reset: () => void;
};

const STORAGE_KEY = "ai-skill-dashboard.v1";

function save(topics: Topic[]) {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ topics }));
    }
}

function load(): Topic[] | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        return (data?.topics ?? []) as Topic[];
    } catch {
        return null;
    }
}

export const useAppStore = create<State>((set, get) => {
    // default seed (shows something on first run)
    const initial: Topic[] = [
        { id: "t1", name: "Linear Algebra", category: "Math", progress: 60, hoursSpent: 12 },
        { id: "t2", name: "Regression Basics", category: "ML", progress: 40, hoursSpent: 6 },
        { id: "t3", name: "Graphs (DSA)", category: "DSA", progress: 20, hoursSpent: 3 },
    ];

    // hydrate from localStorage (client-only)
    const hydrated = load() ?? initial;

    return {
        topics: hydrated,
        addTopic: (t) => {
            const topics = [...get().topics, t];
            set({ topics });
            save(topics);
        },
        updateTopic: (id, patch) => {
            let topics = get().topics.map((t) => (t.id === id ? { ...t, ...patch } : t));
            // remove any completed topics
            topics = topics.filter((t) => (t.progress ?? 0) < 100);
            set({ topics });
            if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify({ topics }));
        },

        removeTopic: (id) => {
            const topics = get().topics.filter((t) => t.id !== id);
            set({ topics });
            save(topics);
        },
        reset: () => {
            set({ topics: [] });
            save([]);
        },
    };
});
