"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Trophy,
    Flame,
    Crown,
    Medal,
    Sparkles,
    TrendingUp,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "all" | "week" | "month";

type LeaderboardEntry = {
    rank: number;
    userId: string;
    username: string | null;
    fullName: string;
    avatarUrl: string | null;
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
};

const PERIOD_LABEL: Record<Period, string> = {
    all: "Mọi thời điểm",
    month: "30 ngày qua",
    week: "7 ngày qua",
};

const PODIUM_STYLES: Record<
    1 | 2 | 3,
    { ring: string; bg: string; medal: string; label: string }
> = {
    1: {
        ring: "ring-amber-400/60 shadow-[0_0_60px_-15px] shadow-amber-400/50",
        bg: "from-amber-500/20 via-amber-500/5 to-transparent",
        medal: "text-amber-400",
        label: "Quán quân",
    },
    2: {
        ring: "ring-slate-300/50",
        bg: "from-slate-400/15 via-slate-400/5 to-transparent",
        medal: "text-slate-300",
        label: "Á quân",
    },
    3: {
        ring: "ring-orange-400/50",
        bg: "from-orange-500/15 via-orange-500/5 to-transparent",
        medal: "text-orange-400",
        label: "Hạng ba",
    },
};

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

function profileHref(entry: LeaderboardEntry): string {
    return entry.username ? `/${entry.username}` : "#";
}

function PodiumCard({
    entry,
    place,
}: {
    entry: LeaderboardEntry;
    place: 1 | 2 | 3;
}) {
    const style = PODIUM_STYLES[place];
    const heightClass =
        place === 1 ? "md:h-72" : place === 2 ? "md:h-60" : "md:h-52";
    const orderClass =
        place === 1 ? "md:order-2" : place === 2 ? "md:order-1" : "md:order-3";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: place * 0.08, type: "spring", damping: 18 }}
            className={cn(
                "relative rounded-2xl border border-border bg-card overflow-hidden",
                "flex flex-col items-center justify-end p-5 text-center",
                heightClass,
                orderClass,
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-b pointer-events-none",
                    style.bg,
                )}
            />
            <Crown
                className={cn(
                    "absolute top-3 left-1/2 -translate-x-1/2 h-5 w-5",
                    style.medal,
                    place === 1 ? "h-7 w-7" : "",
                )}
            />
            <Link
                href={profileHref(entry)}
                className="relative flex flex-col items-center gap-3"
            >
                <div
                    className={cn(
                        "relative w-20 h-20 rounded-full ring-4 overflow-hidden bg-secondary",
                        style.ring,
                        place === 1 ? "w-24 h-24" : "",
                    )}
                >
                    {entry.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={entry.avatarUrl}
                            alt={entry.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-foreground">
                            {getInitials(entry.fullName)}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {style.label}
                    </span>
                    <span className="font-semibold text-foreground line-clamp-1 max-w-[180px]">
                        {entry.fullName}
                    </span>
                    <div className="flex items-center gap-1.5 text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="font-mono text-sm font-semibold">
                            {entry.totalXp.toLocaleString()} XP
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Lv {entry.level}
                        </span>
                        {entry.currentStreak > 0 && (
                            <span className="flex items-center gap-1 text-orange-400">
                                <Flame className="h-3 w-3" />{" "}
                                {entry.currentStreak}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1)
        return (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <Medal className="h-4 w-4" />
            </span>
        );
    if (rank === 2)
        return (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20 text-slate-300">
                <Medal className="h-4 w-4" />
            </span>
        );
    if (rank === 3)
        return (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Medal className="h-4 w-4" />
            </span>
        );
    return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground font-mono text-sm">
            {rank}
        </span>
    );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                delay: Math.min(entry.rank * 0.02, 0.6),
                duration: 0.3,
            }}
            className="flex items-center gap-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors px-4 py-3"
        >
            <RankBadge rank={entry.rank} />
            <Link
                href={profileHref(entry)}
                className="flex items-center gap-3 min-w-0 flex-1"
            >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                    {entry.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={entry.avatarUrl}
                            alt={entry.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-foreground">
                            {getInitials(entry.fullName)}
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground truncate">
                        {entry.fullName}
                    </span>
                    {entry.username && (
                        <span className="text-xs text-muted-foreground truncate">
                            @{entry.username}
                        </span>
                    )}
                </div>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span>Lv {entry.level}</span>
            </div>

            {entry.currentStreak > 0 && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-orange-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{entry.currentStreak}d</span>
                </div>
            )}

            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-sm font-semibold whitespace-nowrap">
                <Sparkles className="h-4 w-4" />
                {entry.totalXp.toLocaleString()}
            </div>
        </motion.div>
    );
}

export default function LeaderboardPage() {
    const [period, setPeriod] = React.useState<Period>("all");
    const [data, setData] = React.useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `/api/leaderboard?period=${period}&limit=50`,
                    { signal: controller.signal, cache: "no-store" },
                );
                const json = await res.json();
                if (cancelled) return;
                if (!res.ok || !json.success) {
                    setError(json.message ?? "Không thể tải bảng xếp hạng.");
                    setData([]);
                } else {
                    setData(json.data as LeaderboardEntry[]);
                }
            } catch (err) {
                if (cancelled) return;
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError("Không thể tải bảng xếp hạng.");
                setData([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [period]);

    const top3 = data.slice(0, 3);
    const rest = data.slice(3);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-6 md:p-10 mb-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_60%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-400 text-xs uppercase tracking-wider mb-3">
                                <Trophy className="h-3.5 w-3.5" /> Bảng xếp
                                hạng
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Top học viên CodeMind
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-xl">
                                Hoàn thành bài học, làm quiz và duy trì streak
                                hằng ngày để vươn lên top. Mỗi XP đều có giá
                                trị.
                            </p>
                        </div>

                        {/* Period Tabs */}
                        <div className="inline-flex p-1 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
                            {(["all", "month", "week"] as Period[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={cn(
                                        "px-3.5 py-1.5 text-sm rounded-lg transition-all",
                                        period === p
                                            ? "bg-primary text-primary-foreground shadow"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {PERIOD_LABEL[p]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* States */}
                {loading && (
                    <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-16 rounded-xl border border-border bg-card animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive px-4 py-6 text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && data.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-12 text-center">
                        <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                            Chưa có dữ liệu cho khoảng thời gian này. Hãy là
                            người đầu tiên trên bảng xếp hạng!
                        </p>
                    </div>
                )}

                {!loading && !error && data.length > 0 && (
                    <>
                        {/* Podium (top 3) */}
                        {top3.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:items-end mb-8">
                                {top3.map((entry, idx) => (
                                    <PodiumCard
                                        key={entry.userId}
                                        entry={entry}
                                        place={(idx + 1) as 1 | 2 | 3}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Rest of list */}
                        {rest.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" /> Xếp
                                        hạng tiếp theo
                                    </h2>
                                    <span className="text-xs text-muted-foreground">
                                        {data.length} học viên
                                    </span>
                                </div>
                                {rest.map((entry) => (
                                    <LeaderboardRow
                                        key={entry.userId}
                                        entry={entry}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
