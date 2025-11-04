import ProgressCard from "@/components/ProgressCard";
import TopicTable from "@/components/TopicTable";
import AddTopicForm from "@/components/AddTopicForm";
import StudyPlan from "@/components/StudyPlan";
import Link from "next/link";

export default function Page() {
    return (
        <main className="min-h-dvh p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">AI Skill Progress Dashboard</h1>
                </header>

                <ProgressCard />
                <AddTopicForm />
                <TopicTable />
                <StudyPlan />
            </div>
        </main>
    );
}
