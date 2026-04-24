"use client";

import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    Layout,
    Target,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { roadmapDetails, roadmapIcons } from "@/data/roadmaps";

export default function RoadmapDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const roadmap = roadmapDetails[slug];

    if (!roadmap) {
        notFound();
    }

    const Icon = roadmapIcons[slug as keyof typeof roadmapIcons] || Layout;

    return (
        <div className="roadmap-route">
            <section className="roadmap-shell__hero">
                <div className="roadmap-shell roadmap-shell__hero-grid">
                    <div>
                        <Link
                            href="/roadmap"
                            className="roadmap-button roadmap-button--dark"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại thư viện
                        </Link>

                        <div className="mt-6">
                            <span className="roadmap-shell__eyebrow">
                                <Icon className="h-4 w-4" />
                                Overview
                            </span>
                        </div>

                        <h1 className="roadmap-shell__title">{roadmap.title}</h1>
                        <p className="roadmap-shell__description">
                            {roadmap.subtitle} {roadmap.description}
                        </p>

                        <div className="roadmap-shell__actions">
                            <Link
                                href={`/roadmap/${slug}/flow`}
                                className="roadmap-button roadmap-button--primary"
                            >
                                <Zap className="h-4 w-4" />
                                Mở tree viewer
                            </Link>
                            <Link
                                href="/roadmap/generate"
                                className="roadmap-button roadmap-button--dark"
                            >
                                <Target className="h-4 w-4" />
                                So sánh với AI roadmap
                            </Link>
                        </div>
                    </div>

                    <div className="roadmap-shell__panel">
                        <div>
                            <h2 className="roadmap-shell__panel-title">
                                Snapshot nhanh
                            </h2>
                            <p className="roadmap-shell__panel-copy">
                                Đây là cửa overview trước khi đi vào tree viewer.
                                Từ đây bạn có thể xem khung học, nghề nghiệp phù hợp và nhảy thẳng vào sơ đồ.
                            </p>
                        </div>

                        <div className="roadmap-shell__meta">
                            <span className="roadmap-shell__meta-item">
                                <Clock className="h-4 w-4" />
                                {roadmap.totalDuration}
                            </span>
                            <span className="roadmap-shell__meta-item">
                                <Users className="h-4 w-4" />
                                {roadmap.totalStudents}
                            </span>
                            <span className="roadmap-shell__meta-item">
                                <CheckCircle className="h-4 w-4" />
                                {roadmap.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="roadmap-shell roadmap-shell__body">
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="roadmap-stat-card">
                        <div className="roadmap-stat-card__label">Thời lượng</div>
                        <div className="roadmap-stat-card__value">
                            {roadmap.totalDuration}
                        </div>
                    </div>
                    <div className="roadmap-stat-card">
                        <div className="roadmap-stat-card__label">Khóa học</div>
                        <div className="roadmap-stat-card__value">
                            {roadmap.totalCourses}
                        </div>
                    </div>
                    <div className="roadmap-stat-card">
                        <div className="roadmap-stat-card__label">Độ khó</div>
                        <div className="roadmap-stat-card__value">
                            {roadmap.difficulty}
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-6">
                        <div className="roadmap-surface p-6 md:p-8">
                            <div className="roadmap-section-heading">
                                <div>
                                    <h2 className="roadmap-section-heading__title">
                                        Bạn sẽ học được gì
                                    </h2>
                                    <p className="roadmap-section-heading__body">
                                        Các đầu ra chính để quyết định roadmap này có hợp với mục tiêu của bạn hay không.
                                    </p>
                                </div>
                            </div>

                            <div className="roadmap-simple-list">
                                {roadmap.outcomes.map((item) => (
                                    <div
                                        key={item}
                                        className="roadmap-simple-list__item"
                                    >
                                        <div className="roadmap-simple-list__copy">
                                            {item}
                                        </div>
                                        <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="roadmap-surface p-6 md:p-8">
                            <div className="roadmap-section-heading">
                                <div>
                                    <h2 className="roadmap-section-heading__title">
                                        Khung học theo giai đoạn
                                    </h2>
                                    <p className="roadmap-section-heading__body">
                                        Overview ngắn trước khi bạn chuyển sang tree viewer chi tiết.
                                    </p>
                                </div>
                            </div>

                            <div className="roadmap-grid">
                                {roadmap.curriculum.map((phase) => (
                                    <div key={phase.phase} className="roadmap-card">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="roadmap-pill roadmap-pill--accent">
                                                Giai đoạn {phase.phase}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-slate-300" />
                                        </div>
                                        <h3 className="roadmap-card__title">
                                            {phase.title}
                                        </h3>
                                        <p className="roadmap-card__body">
                                            {phase.description}
                                        </p>
                                        <div className="roadmap-card__meta">
                                            {phase.topics.map((topic) => (
                                                <span key={topic} className="roadmap-pill">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="roadmap-surface p-6 md:p-8">
                            <div className="roadmap-section-heading">
                                <div>
                                    <h2 className="roadmap-section-heading__title">
                                        Trọng tâm chính
                                    </h2>
                                    <p className="roadmap-section-heading__body">
                                        Các tag nổi bật để bạn đối chiếu nhanh với mục tiêu cá nhân.
                                    </p>
                                </div>
                            </div>

                            <div className="roadmap-card__meta">
                                {roadmap.focusTags.map((tag) => (
                                    <span key={tag} className="roadmap-pill">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                                    Sẵn sàng đi sâu hơn?
                                </p>
                                <h3 className="mt-3 !text-[1.36rem] font-bold tracking-[-0.04em] text-white">
                                    Mở tree viewer để đi theo từng node và cập nhật tiến độ trực tiếp.
                                </h3>
                                <div className="mt-5">
                                    <Link
                                        href={`/roadmap/${slug}/flow`}
                                        className="roadmap-button roadmap-button--primary"
                                    >
                                        <Zap className="h-4 w-4" />
                                        Vào viewer
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="roadmap-surface p-6 md:p-8">
                            <div className="roadmap-section-heading">
                                <div>
                                    <h2 className="roadmap-section-heading__title">
                                        Cơ hội nghề nghiệp
                                    </h2>
                                </div>
                            </div>

                            <div className="roadmap-simple-list">
                                {roadmap.careerPaths.map((career) => (
                                    <div
                                        key={career}
                                        className="roadmap-simple-list__item"
                                    >
                                        <div className="font-bold text-roadmap-ink">
                                            {career}
                                        </div>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="roadmap-surface p-6 md:p-8">
                            <div className="roadmap-section-heading">
                                <div>
                                    <h2 className="roadmap-section-heading__title">
                                        Câu hỏi thường gặp
                                    </h2>
                                </div>
                            </div>

                            <div className="roadmap-grid">
                                {roadmap.faqs.map((faq) => (
                                    <FAQItem
                                        key={faq.question}
                                        question={faq.question}
                                        answer={faq.answer}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function FAQItem({
    question,
    answer,
}: {
    question: string;
    answer: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-[20px] border border-slate-200 bg-slate-50">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <span className="font-bold text-slate-900">{question}</span>
                <span className="roadmap-pill">
                    {isOpen ? "Ẩn" : "Mở"}
                </span>
            </button>
            {isOpen ? (
                <div className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                    {answer}
                </div>
            ) : null}
        </div>
    );
}
