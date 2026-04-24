"use client";

import {
    ArrowRight,
    CheckCircle,
    Clock,
    FolderOpen,
    Layout,
    Map,
    Sparkles,
    Target,
    Users,
    Zap,
    Terminal,
    Code2,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { roadmapCatalog } from "@/data/roadmaps";

const roadmaps = roadmapCatalog;

const quickActions = [
    {
        title: "Tạo roadmap với AI",
        description:
            "Sinh lộ trình theo mục tiêu nghề nghiệp, thời gian học và nền tảng hiện tại.",
        href: "/roadmap/generate",
        icon: Sparkles,
        cta: "$ generate --ai",
    },
    {
        title: "Mở roadmap của tôi",
        description:
            "Quay lại lộ trình đã lưu và tiếp tục phần đang học mà không phải tìm lại từ đầu.",
        href: "/roadmap/my",
        icon: FolderOpen,
        cta: "$ ls ~/saved",
    },
    {
        title: "Duyệt roadmap chuẩn",
        description:
            "Xem các lộ trình đã biên soạn sẵn theo vai trò để so sánh các hướng đi phổ biến.",
        href: "#roadmap-catalog",
        icon: Map,
        cta: "$ browse --all",
    },
];

const flowSteps = [
    {
        title: "Chọn mục tiêu",
        description:
            "Bắt đầu từ roadmap chuẩn hoặc dùng AI nếu bạn chưa rõ thứ tự kỹ năng cần học.",
        icon: Target,
    },
    {
        title: "Tùy chỉnh hành trình",
        description:
            "Tinh chỉnh theo thời gian, nền tảng hiện tại và vai trò bạn đang hướng tới.",
        icon: Zap,
    },
    {
        title: "Theo dõi theo node",
        description:
            "Đánh dấu trạng thái ngay trên cây roadmap để biết mình đang ở đâu.",
        icon: CheckCircle,
    },
];

const features = [
    {
        title: "Rõ điểm bắt đầu",
        description:
            "Người học nhìn thấy ngay nhánh cốt lõi, phần tùy chọn và bước tiếp theo.",
        icon: Target,
    },
    {
        title: "Giữ nhịp học",
        description:
            "Roadmap đã lưu giúp quay lại nhanh, tiếp tục phần dang dở và giữ tiến độ ổn định.",
        icon: CheckCircle,
    },
    {
        title: "So sánh nhanh",
        description:
            "Có thể đi qua giữa roadmap chuẩn và roadmap AI mà không đổi ngôn ngữ giao diện.",
        icon: Layout,
    },
    {
        title: "Ít ma sát hơn",
        description:
            "Các hành động chính được gom lại để bạn ít phải tìm đường trong giao diện.",
        icon: Users,
    },
];

const roadmapGroups = [
    {
        id: "all",
        label: "all",
        description:
            "Xem toàn bộ lộ trình hiện có để so sánh nhanh các hướng đi phổ biến.",
    },
    {
        id: "role-based",
        label: "role-based",
        description:
            "Các lộ trình theo vai trò nghề nghiệp, phù hợp khi bạn đã có mục tiêu công việc rõ ràng.",
    },
    {
        id: "web",
        label: "web",
        description:
            "Tập trung vào các kỹ năng xây dựng sản phẩm web từ giao diện đến hệ thống phía sau.",
    },
    {
        id: "mobile",
        label: "mobile",
        description:
            "Dành cho người muốn phát triển ứng dụng di động với trải nghiệm native hoặc đa nền tảng.",
    },
    {
        id: "devops",
        label: "devops",
        description:
            "Nhóm lộ trình về hạ tầng, tự động hóa triển khai và vận hành hệ thống ổn định.",
    },
    {
        id: "python",
        label: "python",
        description:
            "Lộ trình chuyên sâu cho ngôn ngữ Python: web backend, khoa học dữ liệu và AI/ML.",
    },
];

export default function RoadmapPage() {
    const [activeGroup, setActiveGroup] = useState("all");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        };
        const el = heroRef.current;
        el?.addEventListener("mousemove", handleMouseMove);
        return () => el?.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const filteredRoadmaps =
        activeGroup === "all"
            ? roadmaps
            : roadmaps.filter((roadmap) => roadmap.groups.includes(activeGroup));

    const groupCounts = roadmapGroups.reduce<Record<string, number>>(
        (accumulator, group) => {
            accumulator[group.id] =
                group.id === "all"
                    ? roadmaps.length
                    : roadmaps.filter((roadmap) =>
                          roadmap.groups.includes(group.id),
                      ).length;
            return accumulator;
        },
        {},
    );

    const activeGroupMeta =
        roadmapGroups.find((group) => group.id === activeGroup) ??
        roadmapGroups[0];

    return (
        <div className="roadmap-route">
            {/* ═══════ HERO ═══════ */}
            <section className="roadmap-shell__hero" ref={heroRef}>
                {/* Spotlight */}
                <div
                    className="pointer-events-none absolute inset-0 z-[1]"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary-rgb), 0.04), transparent 60%)`,
                    }}
                />
                <div className="roadmap-shell roadmap-shell__hero-grid">
                    <div>
                        {/* Terminal prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="roadmap-shell__eyebrow">
                                <Terminal className="h-3.5 w-3.5" />
                                $ cd ~/roadmap
                            </span>
                        </motion.div>

                        <motion.h1
                            className="roadmap-shell__title"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            Thư viện roadmap
                            <br />
                            <span className="text-muted-foreground">cho từng vai trò kỹ thuật</span>
                        </motion.h1>

                        <motion.p
                            className="roadmap-shell__description"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            Chọn roadmap chuẩn để vào học ngay hoặc dùng AI để
                            dựng phiên bản cá nhân hóa theo mục tiêu, quỹ thời
                            gian và nền tảng hiện tại.
                        </motion.p>

                        <motion.div
                            className="roadmap-shell__actions"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <Link
                                href="/roadmap/generate"
                                className="roadmap-button roadmap-button--primary"
                            >
                                <Sparkles className="h-4 w-4" />
                                Tạo roadmap AI
                            </Link>
                            <Link
                                href="/roadmap/my"
                                className="roadmap-button roadmap-button--dark"
                            >
                                <FolderOpen className="h-4 w-4" />
                                Mở roadmap của tôi
                            </Link>
                        </motion.div>
                    </div>

                    {/* Side panel */}
                    <motion.div
                        className="roadmap-shell__panel"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div>
                            <h2 className="roadmap-shell__panel-title">
                                // Hệ thống roadmap thống nhất
                            </h2>
                            <p className="roadmap-shell__panel-copy" style={{ marginTop: 10 }}>
                                Catalog, overview, AI generator và viewer đều
                                dùng chung shell, card density và detail panel
                                theo tinh thần roadmap.sh.
                            </p>
                        </div>

                        <div className="roadmap-shell__meta">
                            <span className="roadmap-shell__meta-item">
                                <Layout className="h-3.5 w-3.5" />
                                tree_viewer
                            </span>
                            <span className="roadmap-shell__meta-item">
                                <Sparkles className="h-3.5 w-3.5" />
                                ai_roadmap
                            </span>
                            <span className="roadmap-shell__meta-item">
                                <CheckCircle className="h-3.5 w-3.5" />
                                node_tracking
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ BODY ═══════ */}
            <div className="roadmap-shell roadmap-shell__body">
                {/* Quick Actions */}
                <section className="roadmap-surface p-6 md:p-8">
                    <div className="roadmap-section-heading">
                        <div>
                            <h2 className="roadmap-section-heading__title">
                                {"> "} Bắt đầu từ đúng cửa vào
                            </h2>
                            <p className="roadmap-section-heading__body">
                                Tạo roadmap với AI, quay lại roadmap đã lưu hoặc
                                duyệt thư viện roadmap chuẩn.
                            </p>
                        </div>
                    </div>

                    <div className="roadmap-grid roadmap-grid--3">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06 }}
                            >
                                <Link href={action.href} className="roadmap-card">
                                    <span className="roadmap-card__icon">
                                        <action.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="roadmap-card__title">
                                        {action.title}
                                    </h3>
                                    <p className="roadmap-card__body">
                                        {action.description}
                                    </p>
                                    <span className="roadmap-pill roadmap-pill--info">
                                        {action.cta}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Roadmap Catalog */}
                <section className="mt-6" id="roadmap-catalog">
                    <div className="roadmap-section-heading">
                        <div>
                            <h2 className="roadmap-section-heading__title">
                                {"> "} Danh mục roadmap
                            </h2>
                            <p className="roadmap-section-heading__body">
                                Chọn theo nhóm vai trò hoặc domain để thu hẹp
                                nhanh danh sách.
                            </p>
                        </div>
                        <span className="roadmap-pill">
                            [{filteredRoadmaps.length}] roadmap
                        </span>
                    </div>

                    <div className="roadmap-surface p-6 md:p-8">
                        <div className="mb-5">
                            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                // Bộ lọc hiện tại
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {activeGroupMeta.description}
                            </p>
                        </div>

                        <div
                            className="roadmap-filter-row"
                            role="tablist"
                            aria-label="Lọc roadmap theo danh mục"
                        >
                            {roadmapGroups.map((group) => {
                                const isActive = group.id === activeGroup;
                                return (
                                    <button
                                        key={group.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-pressed={isActive}
                                        onClick={() => setActiveGroup(group.id)}
                                        className="roadmap-filter-chip"
                                    >
                                        <span>--{group.label}</span>
                                        <span className="roadmap-pill">
                                            {groupCounts[group.id]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredRoadmaps.map((roadmap, index) => (
                                <motion.div
                                    key={roadmap.id}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ delay: index * 0.04 }}
                                >
                                    <Link
                                        href={`/roadmap/${roadmap.id}`}
                                        className="roadmap-card"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="roadmap-card__icon">
                                                <roadmap.icon className="h-5 w-5" />
                                            </span>
                                            <span className="roadmap-pill roadmap-pill--accent">
                                                {roadmap.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="roadmap-card__title">
                                                {roadmap.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {roadmap.description}
                                            </p>
                                            <p className="mt-3 text-sm leading-6 text-foreground">
                                                {roadmap.fit}
                                            </p>
                                        </div>

                                        <div className="roadmap-card__meta">
                                            <span className="roadmap-pill">
                                                <Clock className="h-3.5 w-3.5" />
                                                {roadmap.stats.duration}
                                            </span>
                                            <span className="roadmap-pill">
                                                <Code2 className="h-3.5 w-3.5" />
                                                {roadmap.stats.courses} khóa học
                                            </span>
                                        </div>

                                        <div className="roadmap-card__meta">
                                            {roadmap.tags.map((tag) => (
                                                <span key={tag} className="roadmap-pill">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <span className="roadmap-pill roadmap-pill--info">
                                            Xem roadmap
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works + Benefits */}
                <section className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="roadmap-surface p-6 md:p-8">
                        <div className="roadmap-section-heading">
                            <div>
                                <h2 className="roadmap-section-heading__title">
                                    {"> "} Cách vận hành
                                </h2>
                                <p className="roadmap-section-heading__body">
                                    Luồng học được rút gọn về ba bước để người
                                    học vào nhanh, xem rõ đường đi và bám theo
                                    tiến độ ngay trong viewer.
                                </p>
                            </div>
                        </div>

                        <div className="roadmap-grid roadmap-grid--3">
                            {flowSteps.map((step, index) => (
                                <div key={step.title} className="roadmap-stat-card">
                                    <div className="flex items-center justify-between">
                                        <span className="roadmap-card__icon">
                                            <step.icon className="h-5 w-5" />
                                        </span>
                                        <span className="text-xs font-mono font-bold text-muted-foreground">
                                            [{String(index + 1).padStart(2, "0")}]
                                        </span>
                                    </div>
                                    <div className="roadmap-stat-card__value !text-[1.05rem]">
                                        {step.title}
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="roadmap-surface p-6 md:p-8">
                        <div className="roadmap-section-heading">
                            <div>
                                <h2 className="roadmap-section-heading__title">
                                    {"> "} Lợi ích
                                </h2>
                                <p className="roadmap-section-heading__body">
                                    UI ưu tiên định hướng, mật độ vừa phải và ít
                                    card marketing hơn.
                                </p>
                            </div>
                        </div>

                        <div className="roadmap-simple-list">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="roadmap-simple-list__item"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="roadmap-card__icon !h-11 !w-11">
                                            <feature.icon className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-bold font-mono text-foreground text-sm">
                                                {feature.title}
                                            </p>
                                            <p className="roadmap-simple-list__copy">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                    <CheckCircle className="h-4 w-4 shrink-0 text-foreground" />
                                </div>
                            ))}
                        </div>

                        {/* CTA block */}
                        <div className="mt-6 border border-border p-6 bg-secondary">
                            <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
                                // Chưa rõ nên học roadmap nào?
                            </p>
                            <h3 className="mt-3 text-lg font-bold font-mono tracking-tight text-foreground">
                                Bắt đầu bằng AI rồi quay lại thư viện để đối chiếu với roadmap chuẩn.
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                Đây là cách ít ma sát nhất để đi từ nhu cầu mơ
                                hồ đến một kế hoạch học tập có thứ tự rõ ràng.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link
                                    href="/roadmap/generate"
                                    className="roadmap-button roadmap-button--primary"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Tạo roadmap AI
                                </Link>
                                <Link
                                    href="/roadmap/my"
                                    className="roadmap-button roadmap-button--dark"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    Mở roadmap của tôi
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
