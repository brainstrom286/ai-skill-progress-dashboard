import AddTopicForm from "@/components/AddTopicForm";
import Link from "next/link";

export default function AddTopicPage() {
    return (
        <main className="min-h-dvh p-6">
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add Topic</h1>
                    <Link href="/" className="px-4 py-2 rounded" style={{ background: "var(--accent)", color: "#0b1220" }}>
                        Back
                    </Link>
                </div>
                <AddTopicForm />
            </div>
        </main>
    );
}
