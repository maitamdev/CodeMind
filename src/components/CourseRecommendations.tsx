"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Sparkles,
    Star,
    Users as UsersIcon,
    Tag,
    Compass,
    BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationItem {
    id: string;
    slug: string;
    title: string;
    shortDescription: string | null;
    level: string | null;
    thumbnailUrl: string | null;
    isFree: boolean;
    rating: number;
    students: number;
    instructorName: string | null;
    score: number;
}

type Source =
    | { mode: "similar"; courseId?: string; courseSlug?: string }
    | { mode: "for-me" };

interface CourseRecommendationsProps {
    source: Source;
    title?: string;
    subtitle?: string;
    limit?: number;
    className?: string;
    /** When true, show a relevance score on each card (default false). */
    showScore?: boolean;
}

const LEVEL_LABEL: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
};

function formatStudents(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return count.toString();
}

function buildUrl(source: Source, limit: number): string {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (source.mode === "similar") {
        if (source.courseId) params.set("courseId", source.courseId);
        if (source.courseSlug) params.set("courseSlug", source.courseSlug);
    } else {
        params.set("for", "me");
    }
    return `/api/recommendations/courses?${params.toString()}`;
}

function RecommendationCard({
    item,
    showScore,
}: {
    item: RecommendationItem;
    showScore: boolean;
}) {
    const levelLabel = item.level
        ? LEVEL_LABEL[item.level] ?? item.level
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="group"
        >
            <Link
                href={`/courses/${item.slug}`}
                className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/40"
            >
                <div className="relative aspect-video bg-secondary overflow-hidden">
                    {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <BookOpen className="h-8 w-8" />
                        </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        {item.isFree ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-semibold uppercase tracking-wider">
                                Miễn phí
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-semibold uppercase tracking-wider">
                                PRO
                            </span>
                        )}
                        {levelLabel && (
                            <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                                {levelLabel}
                            </span>
                        )}
                    </div>
                    {showScore && item.score > 0 && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-mono">
                            {(item.score * 100).toFixed(0)}%
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                    {item.shortDescription && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                            {item.shortDescription}
                        </p>
                    )}
                    <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <UsersIcon className="h-3 w-3" />{" "}
                            {formatStudents(item.students)}
                        </span>
                        {item.rating > 0 && (
                            <span className="flex items-center gap-1 text-amber-400">
                                <Star className="h-3 w-3 fill-amber-400" />
                                {item.rating.toFixed(1)}
                            </span>
                        )}
                        {item.instructorName && (
                            <span className="truncate max-w-[40%] text-right">
                                {item.instructorName}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
            <div className="aspect-video bg-secondary" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary/70 rounded w-full" />
                <div className="h-3 bg-secondary/70 rounded w-5/6" />
                <div className="h-3 bg-secondary/50 rounded w-1/2 mt-3" />
            </div>
        </div>
    );
}

export default function CourseRecommendations({
    source,
    title,
    subtitle,
    limit = 6,
    className,
    showScore = false,
}: CourseRecommendationsProps) {
    const [items, setItems] = React.useState<RecommendationItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [errored, setErrored] = React.useState(false);

    const url = React.useMemo(() => buildUrl(source, limit), [source, limit]);

    React.useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setErrored(false);
            try {
                const res = await fetch(url, {
                    signal: controller.signal,
                    cache: "no-store",
                });
                const json = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok || !json?.success) {
                    setErrored(true);
                    setItems([]);
                } else {
                    setItems(
                        (json.data as RecommendationItem[]) ?? [],
                    );
                }
            } catch (err) {
                if (cancelled) return;
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setErrored(true);
                setItems([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [url]);

    const headingTitle =
        title ??
        (source.mode === "similar"
            ? "Khóa học tương tự"
            : "Đề xuất cho bạn");
    const headingSubtitle =
        subtitle ??
        (source.mode === "similar"
            ? "Dựa trên nội dung và chủ đề của khóa học hiện tại."
            : "Cá nhân hóa từ các khóa học bạn đã ghi danh.");

    // Empty state — do not render the section at all to avoid clutter
    if (!loading && !errored && items.length === 0) {
        return null;
    }

    return (
        <section className={cn("w-full", className)}>
            <div className="flex items-end justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                        {source.mode === "similar" ? (
                            <Compass className="h-5 w-5 text-primary" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-primary" />
                        )}
                        {headingTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {headingSubtitle}
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                    <Tag className="h-3.5 w-3.5" /> Xem tất cả
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : errored ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive">
                    Không thể tải gợi ý. Vui lòng thử lại sau.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <RecommendationCard
                            key={item.id}
                            item={item}
                            showScore={showScore}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
