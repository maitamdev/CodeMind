"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Sparkles, Target, Trophy } from "lucide-react";

const focusAreas = ["Frontend", "Backend", "AI", "Mobile", "DevOps", "Data"];
const durations = ["2 tuần", "4 tuần", "8 tuần"];
const goals = ["Xin thực tập", "Đổi việc", "Build portfolio", "Ôn phỏng vấn"];

const suggestionMap: Record<string, string[]> = {
    Frontend: ["HTML/CSS fundamentals", "Responsive layout", "React components", "State management", "Project portfolio"],
    Backend: ["API design", "Database modeling", "Auth & security", "Testing", "Deploy & observability"],
    AI: ["Python & notebooks", "Data preprocessing", "Model basics", "Prompting", "AI project demo"],
    Mobile: ["App architecture", "Navigation", "State handling", "API integration", "Release checklist"],
    DevOps: ["Linux basics", "Docker", "CI/CD", "Monitoring", "Infra checklist"],
    Data: ["SQL basics", "Data cleaning", "Visualization", "Notebook workflow", "Capstone project"],
};

export function StudyPlannerTool() {
    const [focus, setFocus] = useState("Frontend");
    const [duration, setDuration] = useState("4 tuần");
    const [goal, setGoal] = useState("Xin thực tập");

    const plan = useMemo(() => {
        const core = suggestionMap[focus] ?? suggestionMap.Frontend;
        const weeks = duration === "2 tuần" ? 2 : duration === "4 tuần" ? 4 : 8;
        return core.slice(0, Math.min(core.length, weeks + 1));
    }, [focus, duration]);

    const intensity = duration === "2 tuần" ? "Cao" : duration === "4 tuần" ? "Vừa" : "Nhẹ";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="border-b border-border bg-secondary/10">
                <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:px-10 lg:px-16">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        Study planner
                    </motion.div>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Tạo kế hoạch học cá nhân hóa trong vài giây</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                        Đây là công cụ mới giúp người học chọn mục tiêu, thời gian và trọng tâm kỹ năng để hệ thống tạo một kế hoạch học thực tế.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-16">
                <div className="space-y-6 rounded-3xl border border-border bg-background p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Mục tiêu</label>
                        <div className="flex flex-wrap gap-2">
                            {goals.map((item) => (
                                <button key={item} onClick={() => setGoal(item)} className={`border px-3 py-2 text-sm transition-colors ${goal === item ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Trọng tâm</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {focusAreas.map((item) => (
                                <button key={item} onClick={() => setFocus(item)} className={`border px-3 py-2 text-sm transition-colors ${focus === item ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Thời lượng</label>
                        <div className="flex flex-wrap gap-2">
                            {durations.map((item) => (
                                <button key={item} onClick={() => setDuration(item)} className={`border px-3 py-2 text-sm transition-colors ${duration === item ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Target className="h-4 w-4" />
                            Snapshot kế hoạch
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                            <div><p className="text-muted-foreground">Mục tiêu</p><p className="font-medium">{goal}</p></div>
                            <div><p className="text-muted-foreground">Mức độ</p><p className="font-medium">{intensity}</p></div>
                            <div><p className="text-muted-foreground">Tuần</p><p className="font-medium">{duration}</p></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">Kế hoạch đề xuất</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Dựa trên lựa chọn hiện tại của bạn.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {duration}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {plan.map((item, index) => (
                            <div key={item} className="flex items-start gap-4 border border-border p-4 transition-colors hover:bg-secondary/30">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-secondary font-mono text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">{item}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Mỗi bước nên có bài tập nhỏ để đảm bảo tiến độ.
                                    </p>
                                </div>
                                <CheckCircle2 className="mt-1 h-5 w-5 text-foreground" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-border bg-secondary/20 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4" /> Lộ trình gợi ý</div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="border border-border px-2 py-1">Học 25 phút / ngày</span>
                            <span className="border border-border px-2 py-1">Ôn tập cuối tuần</span>
                            <span className="border border-border px-2 py-1">Làm mini project</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                            Lưu plan
                            <Trophy className="h-4 w-4" />
                        </button>
                        <button className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                            Tạo roadmap khác
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
