import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Bolt,
    Braces,
    CheckCircle2,
    Code2,
    Cpu,
    ExternalLink,
    FileText,
    Filter,
    Grid3X3,
    Lightbulb,
    Link2,
    Scissors,
    Search,
    ShieldAlert,
    Sparkles,
    Zap,
    type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toolCatalog, type ToolCatalogItem } from "@/lib/tool-catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Công cụ học tập và phát triển | CodeMind",
    description:
        "Khám phá bộ công cụ hỗ trợ tạo CV, rút gọn liên kết, sinh snippet, dựng CSS Grid, clip-path và demo AI.",
};

const iconMap: Record<ToolCatalogItem["icon"], LucideIcon> = {
    resume: FileText,
    "short-link": Link2,
    "clip-path": Scissors,
    snippet: Braces,
    grid: Grid3X3,
    planner: Sparkles,
    "face-alert": ShieldAlert,
    ats: Zap,
};

const accentStyles: Record<ToolCatalogItem["accent"], { bar: string; iconBg: string; icon: string; check: string; hoverTitle: string; hoverBtn: string }> = {
    sky: { bar: "bg-sky-500", iconBg: "bg-sky-50", icon: "text-sky-600", check: "text-sky-500", hoverTitle: "group-hover:text-sky-600", hoverBtn: "hover:bg-sky-50 hover:text-sky-600" },
    violet: { bar: "bg-violet-500", iconBg: "bg-violet-50", icon: "text-violet-600", check: "text-violet-500", hoverTitle: "group-hover:text-violet-600", hoverBtn: "hover:bg-violet-50 hover:text-violet-600" },
    amber: { bar: "bg-amber-500", iconBg: "bg-amber-50", icon: "text-amber-600", check: "text-amber-500", hoverTitle: "group-hover:text-amber-600", hoverBtn: "hover:bg-amber-50 hover:text-amber-600" },
    emerald: { bar: "bg-emerald-500", iconBg: "bg-emerald-50", icon: "text-emerald-600", check: "text-emerald-500", hoverTitle: "group-hover:text-emerald-600", hoverBtn: "hover:bg-emerald-50 hover:text-emerald-600" },
    rose: { bar: "bg-rose-500", iconBg: "bg-rose-50", icon: "text-rose-600", check: "text-rose-500", hoverTitle: "group-hover:text-rose-600", hoverBtn: "hover:bg-rose-50 hover:text-rose-600" },
    cyan: { bar: "bg-cyan-500", iconBg: "bg-cyan-50", icon: "text-cyan-600", check: "text-cyan-500", hoverTitle: "group-hover:text-cyan-600", hoverBtn: "hover:bg-cyan-50 hover:text-cyan-600" },
};

const quickAccessItems = [
    { tool: toolCatalog[0], iconBg: "bg-sky-500/20", iconColor: "text-sky-400", hoverColor: "group-hover:text-cyan-300" },
    { tool: toolCatalog[1], iconBg: "bg-violet-500/20", iconColor: "text-violet-400", hoverColor: "group-hover:text-violet-300" },
    { tool: toolCatalog[2], iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", hoverColor: "group-hover:text-emerald-300" },
];

const methodologyPillars = [
    { icon: Lightbulb, title: "Giải quyết vấn đề thực tế", description: "Mỗi công cụ sinh ra từ nhu cầu thật trong học tập và làm việc." },
    { icon: Code2, title: "Tối ưu hóa Code", description: "Ưu tiên load nhanh, ít rối và chạy tốt trong luồng sản phẩm thật." },
    { icon: Cpu, title: "Ứng dụng AI", description: "Tích hợp AI tinh tế để tự động hóa các thao tác thủ công." },
];

const featuredTools = [
    { title: "CV Builder", href: "/tools/cv-builder", icon: FileText, desc: "Tạo CV ATS-friendly, chọn template và export nhanh." },
    { title: "Roadmap AI", href: "/roadmap/generate", icon: Sparkles, desc: "Sinh roadmap học tập theo mục tiêu và quỹ thời gian." },
    { title: "Course Discovery", href: "/courses", icon: Search, desc: "Tìm khóa học nhanh hơn với marketplace-style discovery." },
];

function getLinkProps(href: string) {
    return href.startsWith("http://") || href.startsWith("https://") ? { target: "_blank" as const, rel: "noopener noreferrer" as const } : {};
}

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="relative overflow-hidden border-b border-border bg-secondary/10 pt-20 pb-20">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-primary/10" />
                <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/60 blur-[110px]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div className="space-y-6">
                            <span className="inline-flex w-fit items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                                Kho công cụ cao cấp
                            </span>
                            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                Một điểm đến cho mọi công cụ bạn thật sự cần
                            </h1>
                            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                                Từ tạo CV, sinh snippet, dựng layout, rút gọn link đến các công cụ AI hỗ trợ học tập và lập trình.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="lg" className="h-12 rounded-xl px-6 font-semibold">
                                    <Link href="#tool-catalog">
                                        Khám phá ngay
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6 font-semibold">
                                    <Link href="/tools/cv-builder">Mở CV Builder</Link>
                                </Button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { label: "Công cụ", value: toolCatalog.length },
                                    { label: "CV / Resume", value: "CV Builder" },
                                    { label: "AI hỗ trợ", value: "24/7" },
                                ].map((item) => (
                                    <div key={item.label} className="border border-border bg-background p-4">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                        <p className="mt-2 text-lg font-semibold">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="border border-border bg-background p-6 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Bolt className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold">Truy cập nhanh</h2>
                                </div>
                                <div className="mt-5 space-y-3">
                                    {quickAccessItems.map(({ tool, iconBg, iconColor, hoverColor }) => {
                                        const Icon = iconMap[tool.icon];
                                        return (
                                            <Link key={tool.id} href={tool.href} {...getLinkProps(tool.href)} className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/30">
                                                <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", iconBg)}>
                                                    <Icon className={cn("h-5 w-5", iconColor)} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className={cn("font-semibold transition-colors", hoverColor)}>{tool.name}</h3>
                                                    <p className="mt-1 text-sm text-muted-foreground">{tool.summary}</p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                {featuredTools.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.title} href={item.href} className="border border-border bg-background p-4 transition-colors hover:bg-secondary/30">
                                            <Icon className="h-5 w-5 text-foreground" />
                                            <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                                            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tool-catalog" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 scroll-mt-28">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Danh mục công cụ</h2>
                        <p className="mt-2 text-muted-foreground">Các công cụ được thiết kế để hỗ trợ học tập, phát triển và tự động hóa.</p>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                        <button className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary/30"><Filter className="h-5 w-5" /></button>
                        <button className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary/30"><Search className="h-5 w-5" /></button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {toolCatalog.map((tool) => {
                        const Icon = iconMap[tool.icon];
                        const accent = accentStyles[tool.accent];
                        return (
                            <Card key={tool.id} id={tool.id} className="group overflow-hidden border border-border bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className={cn("h-2 w-full", accent.bar)} />
                                <div className="flex h-full flex-col p-8">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", accent.iconBg)}>
                                            <Icon className={cn("h-7 w-7", accent.icon)} />
                                        </div>
                                        <Badge variant="secondary" className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">{tool.category}</Badge>
                                    </div>

                                    <CardTitle className={cn("mb-2 text-xl font-bold transition-colors", accent.hoverTitle)}>{tool.name}</CardTitle>
                                    <CardDescription className="mb-6 flex-1 text-sm text-muted-foreground">{tool.description}</CardDescription>

                                    <div className="mb-6 space-y-3">
                                        {tool.highlights.map((highlight) => (
                                            <div key={highlight} className="flex items-start gap-2 text-sm text-foreground/90">
                                                <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", accent.check)} />
                                                {highlight}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto rounded-xl border border-border bg-secondary/20 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kết quả kỳ vọng</p>
                                        <p className="mt-1 text-sm font-medium">{tool.outcome}</p>
                                    </div>
                                </div>
                                <div className="px-8 pb-8">
                                    <Button asChild variant="secondary" className={cn("h-11 w-full rounded-xl font-semibold", accent.hoverBtn)}>
                                        <Link href={tool.href} {...getLinkProps(tool.href)}>
                                            Mở công cụ
                                            <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>

            <section className="border-t border-border bg-secondary/10 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="rounded-3xl border border-border bg-background p-8 lg:p-12">
                            <h3 className="mb-6 text-2xl font-bold">Cách chúng tôi phát triển công cụ</h3>
                            <div className="space-y-6">
                                {methodologyPillars.map((pillar) => (
                                    <div key={pillar.title} className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <pillar.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold">{pillar.title}</h4>
                                            <p className="mt-1 text-sm text-muted-foreground">{pillar.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-3xl border border-border bg-foreground p-8 text-background lg:p-12">
                            <div>
                                <Badge className="mb-6 rounded-full border border-background/10 bg-background/10 px-3 py-1 text-xs font-semibold text-background">Dành cho nhà phát triển</Badge>
                                <h3 className="mb-4 text-2xl font-bold">Bạn có ý tưởng công cụ mới?</h3>
                                <p className="mb-8 leading-relaxed text-background/75">
                                    CodeMind luôn có thể mở rộng thêm các công cụ phục vụ học tập, portfolio, interview prep và workflow cá nhân.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button asChild size="lg" className="h-12 rounded-xl bg-background px-6 font-semibold text-foreground hover:bg-background/90">
                                    <Link href="/contact">
                                        Đóng góp ý tưởng
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-background/15 bg-background/10 px-6 font-semibold text-background hover:bg-background/15 hover:text-background">
                                    <Link href="/tools/cv-builder">Thử CV Builder</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
