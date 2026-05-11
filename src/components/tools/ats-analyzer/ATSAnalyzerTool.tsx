"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, BrainCircuit, FileText, Sparkles, Target, TrendingUp } from "lucide-react";

const sampleJobs = [
    "Frontend Developer - React, TypeScript, Next.js, UI/UX, testing",
    "Backend Engineer - Node.js, PostgreSQL, API design, security, Docker",
    "AI Engineer - Python, LLMs, prompt engineering, data analysis",
];

const cvSections = [
    "Contact info",
    "Summary",
    "Skills",
    "Projects",
    "Experience",
    "Education",
    "Certifications",
];

const suggestions = [
    "Thêm keyword từ JD vào Skills và Summary",
    "Viết bullet theo công thức action + result + metric",
    "Ưu tiên dự án có stack trùng với job mục tiêu",
    "Giữ CV dưới 2 trang và tránh mô tả quá dài",
];

export function ATSAnalyzerTool() {
    const [jobDescription, setJobDescription] = useState(sampleJobs[0]);
    const [selectedSections, setSelectedSections] = useState<string[]>(["Summary", "Skills", "Projects"]);

    const score = useMemo(() => {
        const keywords = jobDescription.toLowerCase().split(/[,\s]+/).filter(Boolean);
        const matched = selectedSections.length * 14 + Math.min(45, keywords.length * 2);
        return Math.min(98, matched);
    }, [jobDescription, selectedSections]);

    const coverage = Math.round(score * 0.82);
    const atsReadability = Math.max(68, score - 8);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="border-b border-border bg-secondary/10">
                <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                    <motion.div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Sparkles className="h-3.5 w-3.5" />
                        ATS CV Analyzer
                    </motion.div>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Kiểm tra CV của bạn có hợp với job chưa</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                        Công cụ này tương tự CV Builder nhưng tập trung vào đánh giá mức độ phù hợp của CV với mô tả công việc.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-16">
                <div className="space-y-6 rounded-3xl border border-border bg-background p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Job description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={7}
                            className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                            placeholder="Dán mô tả công việc vào đây..."
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-semibold">CV sections đang có</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {cvSections.map((section) => {
                                const active = selectedSections.includes(section);
                                return (
                                    <button
                                        key={section}
                                        onClick={() =>
                                            setSelectedSections((prev) =>
                                                prev.includes(section)
                                                    ? prev.filter((item) => item !== section)
                                                    : [...prev, section],
                                            )
                                        }
                                        className={`border px-3 py-2 text-sm transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
                                    >
                                        {section}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <BrainCircuit className="h-4 w-4" />
                            Gợi ý nhanh
                        </div>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            {suggestions.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">ATS match report</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Điểm phù hợp ước tính theo keyword, coverage và cấu trúc CV.</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-center">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Score</p>
                            <p className="text-3xl font-bold">{score}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "Keyword coverage", value: `${coverage}%`, icon: Target },
                            { label: "ATS readability", value: `${atsReadability}%`, icon: FileText },
                            { label: "Section fit", value: `${selectedSections.length}/7`, icon: TrendingUp },
                        ].map((item) => (
                            <div key={item.label} className="border border-border bg-secondary/20 p-4">
                                <item.icon className="h-5 w-5 text-foreground" />
                                <p className="mt-4 text-2xl font-bold">{item.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">What to fix first</p>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                                <span>Nhấn mạnh stack khớp JD ngay trong Summary.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                                <span>Đưa dự án nổi bật lên đầu và mô tả kết quả định lượng.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                                <span>Thêm keyword kỹ thuật đúng ngôn ngữ trong job description.</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                            Phân tích lại
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <button className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                            Mở CV Builder
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
