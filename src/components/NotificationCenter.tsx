"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    MessageSquare,
    Flame,
    Trophy,
    BookOpen,
    Sparkles,
    Inbox,
    Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type NotificationKind =
    | "answer"
    | "streak"
    | "course-complete"
    | "course-update"
    | "system";

interface NotificationItem {
    id: string;
    kind: NotificationKind;
    title: string;
    message: string;
    href: string | null;
    createdAt: string;
    actor?: {
        name: string;
        avatarUrl: string | null;
    } | null;
}

const STORAGE_KEY = "codemind:notifications:lastSeenAt";
const POLL_INTERVAL_MS = 60_000;

function getLastSeen(): number {
    if (typeof window === "undefined") return 0;
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (!v) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function setLastSeen(ts: number) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(ts));
}

function timeAgo(iso: string): string {
    try {
        const then = new Date(iso).getTime();
        if (Number.isNaN(then)) return "";
        const diff = Math.max(0, Date.now() - then);
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return "vừa xong";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ngày trước`;
        return new Date(iso).toLocaleDateString("vi-VN");
    } catch {
        return "";
    }
}

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

function KindIcon({ kind }: { kind: NotificationKind }) {
    const cls = "h-4 w-4";
    switch (kind) {
        case "answer":
            return <MessageSquare className={cn(cls, "text-blue-400")} />;
        case "streak":
            return <Flame className={cn(cls, "text-orange-400")} />;
        case "course-complete":
            return <Trophy className={cn(cls, "text-amber-400")} />;
        case "course-update":
            return <BookOpen className={cn(cls, "text-emerald-400")} />;
        default:
            return <Sparkles className={cn(cls, "text-primary")} />;
    }
}

function NotificationRow({
    item,
    isUnread,
    onNavigate,
}: {
    item: NotificationItem;
    isUnread: boolean;
    onNavigate: () => void;
}) {
    const Body = (
        <div
            className={cn(
                "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isUnread ? "bg-primary/5" : "hover:bg-secondary/50",
            )}
        >
            <div className="relative flex-shrink-0 mt-0.5">
                {item.actor?.avatarUrl ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.actor.avatarUrl}
                            alt={item.actor.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : item.actor ? (
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                        {getInitials(item.actor.name)}
                    </div>
                ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                        <KindIcon kind={item.kind} />
                    </div>
                )}
                {item.actor && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                        <KindIcon kind={item.kind} />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2">
                    <span className={cn(isUnread && "font-semibold")}>
                        {item.title}
                    </span>
                </p>
                {item.message && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {item.message}
                    </p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">
                    {timeAgo(item.createdAt)}
                </p>
            </div>
            {isUnread && (
                <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            )}
        </div>
    );

    if (item.href) {
        return (
            <Link href={item.href} onClick={onNavigate} className="block">
                {Body}
            </Link>
        );
    }
    return <div onClick={onNavigate}>{Body}</div>;
}

export default function NotificationCenter() {
    const { isAuthenticated } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<NotificationItem[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [lastSeenAt, setLastSeenAtState] = React.useState<number>(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setLastSeenAtState(getLastSeen());
    }, []);

    const loadNotifications = React.useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const res = await fetch("/api/notifications", {
                cache: "no-store",
            });
            if (!res.ok) {
                setItems([]);
                return;
            }
            const json = await res.json();
            if (json?.success && Array.isArray(json.data)) {
                setItems(json.data as NotificationItem[]);
            }
        } catch {
            // non-fatal
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Initial load + polling
    React.useEffect(() => {
        if (!isAuthenticated) {
            setItems([]);
            return;
        }
        loadNotifications();
        const id = setInterval(loadNotifications, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [isAuthenticated, loadNotifications]);

    // Click outside to close
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const unreadCount = React.useMemo(() => {
        if (!lastSeenAt) return items.length;
        return items.filter(
            (i) => new Date(i.createdAt).getTime() > lastSeenAt,
        ).length;
    }, [items, lastSeenAt]);

    const markAllRead = () => {
        const now = Date.now();
        setLastSeen(now);
        setLastSeenAtState(now);
    };

    const handleOpen = () => {
        setOpen((prev) => {
            const next = !prev;
            if (next && !loading && items.length === 0) {
                loadNotifications();
            }
            return next;
        });
    };

    if (!isAuthenticated) return null;

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={handleOpen}
                className="relative p-2 border border-border rounded-none hover:bg-secondary text-foreground transition-colors"
                aria-label="Thông báo"
                title="Thông báo"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover text-popover-foreground shadow-xl overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <div>
                                <p className="font-semibold text-sm">
                                    Thông báo
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount > 0
                                        ? `${unreadCount} thông báo mới`
                                        : "Bạn đã xem hết"}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <Check className="h-3.5 w-3.5" /> Đánh
                                    dấu đã đọc
                                </button>
                            )}
                        </div>

                        <div className="max-h-[480px] overflow-y-auto p-2">
                            {loading && items.length === 0 ? (
                                <div className="space-y-2 p-1">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-16 rounded-lg bg-secondary/40 animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Chưa có thông báo nào
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const isUnread =
                                        new Date(
                                            item.createdAt,
                                        ).getTime() > lastSeenAt;
                                    return (
                                        <NotificationRow
                                            key={item.id}
                                            item={item}
                                            isUnread={isUnread}
                                            onNavigate={() => {
                                                markAllRead();
                                                setOpen(false);
                                            }}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
