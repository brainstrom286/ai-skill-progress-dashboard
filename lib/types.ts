export type Topic = {
    id: string;
    name: string;
    category: string;
    progress: number;   // 0–100
    hoursSpent: number; // total hours
    lastStudied?: string; // ISO date
    resources?: { label: string; url: string }[];
};
