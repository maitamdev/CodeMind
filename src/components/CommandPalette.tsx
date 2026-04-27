"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    BookOpen,
    Compass,
    Code2,
    PencilLine,
    MessageCircle,
    Wrench,
    User as UserIcon,
    Settings as SettingsIcon,
    LogOut,
    LogIn,
    Sun,
    Moon,
    Sparkles,
    GraduationCap,
    Bookmark,
    Mail,
    LayoutDashboard,
    Home as HomeIcon,
    Search as SearchIcon,
    FileText,
    Hash,
    Briefcase,
    Image as ImageIcon,
    Link as LinkIcon,
    Scissors,
    ScanFace,
    Trophy,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useAuth } from "@/contexts/AuthContext";

type CourseSuggestion = {
    id: string;
    slug: string;
    title: string;
    thumbnail_url?: string | null;
    instructor_name?: string | null;
};

type ArticleSuggestion = {
    id: string;
    slug: string;
    title: string;
};

const NAV_ITEMS: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    keywords?: string;
}> = [
    { label: "Trang chủ", href: "/", icon: HomeIcon, keywords: "home dashboard" },
    { label: "Khóa học", href: "/courses", icon: BookOpen, keywords: "courses learning" },
    { label: "Lộ trình", href: "/roadmap", icon: Compass, keywords: "roadmap path" },
    { label: "Bảng xếp hạng", href: "/leaderboard", icon: Trophy, keywords: "leaderboard ranking xp top" },
    { label: "Bài viết", href: "/articles", icon: PencilLine, keywords: "blog articles posts" },
    { label: "Hỏi đáp", href: "/qa", icon: MessageCircle, keywords: "qa forum questions" },
    { label: "Code Playground", href: "/playground", icon: Code2, keywords: "ide editor code" },
    { label: "Công cụ", href: "/tools", icon: Wrench, keywords: "tools utilities" },
    { label: "Bài viết của tôi", href: "/my-posts", icon: FileText, keywords: "my posts drafts" },
    { label: "Đã lưu", href: "/saved", icon: Bookmark, keywords: "saved bookmarks" },
    { label: "Liên hệ", href: "/contact", icon: Mail, keywords: "contact support" },
    { label: "Giới thiệu", href: "/about", icon: Sparkles, keywords: "about info" },
];

const TOOL_ITEMS: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}> = [
    { label: "CV Builder", href: "/tools/cv-builder", icon: Briefcase },
    { label: "CSS Grid Generator", href: "/tools/css-grid-generator", icon: Hash },
    { label: "Clip-path Maker", href: "/tools/clip-path-maker", icon: Scissors },
    { label: "Link Shortener", href: "/tools/link-shortener", icon: LinkIcon },
    { label: "Snippet Generator", href: "/tools/snippet-generator", icon: ImageIcon },
    { label: "Face-touch Alert", href: "/tools/face-touch-alert", icon: ScanFace },
];

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = React.useState(value);
    React.useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}

export default function CommandPalette() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const debouncedQuery = useDebouncedValue(query, 250);

    const [courses, setCourses] = React.useState<CourseSuggestion[]>([]);
    const [articles, setArticles] = React.useState<ArticleSuggestion[]>([]);
    const [searching, setSearching] = React.useState(false);

    // Global ⌘K / Ctrl+K listener
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isModK =
                (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
            if (isModK) {
                e.preventDefault();
                setOpen((prev) => !prev);
                return;
            }
            // "/" focuses palette when not typing in an input/textarea
            if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                const target = e.target as HTMLElement | null;
                const tag = target?.tagName?.toLowerCase();
                const editable = target?.isContentEditable;
                if (
                    tag === "input" ||
                    tag === "textarea" ||
                    tag === "select" ||
                    editable
                ) {
                    return;
                }
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Listen for a custom event so other components can open the palette
    React.useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener("codemind:open-command-palette", onOpen);
        return () =>
            window.removeEventListener(
                "codemind:open-command-palette",
                onOpen,
            );
    }, []);

    React.useEffect(() => {
        if (!open) {
            setQuery("");
        }
    }, [open]);

    // Fetch course / article suggestions on debounced query
    React.useEffect(() => {
        const q = debouncedQuery.trim();
        if (!open || q.length < 2) {
            setCourses([]);
            setArticles([]);
            setSearching(false);
            return;
        }
        let cancelled = false;
        const controller = new AbortController();

        async function run() {
            setSearching(true);
            try {
                const [coursesRes, articlesRes] = await Promise.allSettled([
                    fetch(
                        `/api/courses?search=${encodeURIComponent(q)}&limit=5`,
                        { signal: controller.signal, cache: "no-store" },
                    ),
                    fetch(
                        `/api/blog?search=${encodeURIComponent(q)}&limit=5`,
                        { signal: controller.signal, cache: "no-store" },
                    ),
                ]);

                if (cancelled) return;

                if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
                    const data = await coursesRes.value
                        .json()
                        .catch(() => null);
                    const list: CourseSuggestion[] = Array.isArray(
                        data?.courses,
                    )
                        ? data.courses
                              .map((c: Record<string, unknown>) => ({
                                  id: String(c.id ?? c.slug ?? ""),
                                  slug: String(c.slug ?? ""),
                                  title: String(c.title ?? "(Không tiêu đề)"),
                                  thumbnail_url:
                                      (c.thumbnail_url as string | null) ??
                                      null,
                                  instructor_name:
                                      ((c.instructor as Record<
                                          string,
                                          unknown
                                      > | null)?.full_name as string) ??
                                      ((c.instructor as Record<
                                          string,
                                          unknown
                                      > | null)?.username as string) ??
                                      null,
                              }))
                              .filter(
                                  (c: CourseSuggestion) =>
                                      c.slug && c.title,
                              )
                        : [];
                    setCourses(list);
                }

                if (
                    articlesRes.status === "fulfilled" &&
                    articlesRes.value.ok
                ) {
                    const data = await articlesRes.value
                        .json()
                        .catch(() => null);
                    const raw = Array.isArray(data?.posts)
                        ? data.posts
                        : Array.isArray(data?.data)
                          ? data.data
                          : Array.isArray(data)
                            ? data
                            : [];
                    const list: ArticleSuggestion[] = raw
                        .map((p: Record<string, unknown>) => ({
                            id: String(p.id ?? p.slug ?? ""),
                            slug: String(p.slug ?? ""),
                            title: String(p.title ?? "(Không tiêu đề)"),
                        }))
                        .filter(
                            (p: ArticleSuggestion) => p.slug && p.title,
                        );
                    setArticles(list);
                }
            } catch {
                // swallow — abort or network errors are non-fatal here
            } finally {
                if (!cancelled) setSearching(false);
            }
        }

        run();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [debouncedQuery, open]);

    const go = React.useCallback(
        (href: string) => {
            setOpen(false);
            // Defer navigation slightly so dialog close animation doesn't interrupt
            setTimeout(() => router.push(href), 50);
        },
        [router],
    );

    const profileHref = user?.username
        ? `/${user.username}`
        : "/profile";

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Command Palette"
            description="Tìm kiếm và điều hướng nhanh trong CodeMind"
            className="sm:max-w-2xl"
        >
            <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Tìm khóa học, bài viết, công cụ, hành động… (gõ ‘/’ hoặc ⌘K)"
            />
            <CommandList className="max-h-[420px]">
                <CommandEmpty>
                    {searching
                        ? "Đang tìm…"
                        : "Không tìm thấy kết quả phù hợp."}
                </CommandEmpty>

                {courses.length > 0 && (
                    <CommandGroup heading="Khóa học">
                        {courses.map((c) => (
                            <CommandItem
                                key={`course-${c.id}`}
                                value={`course ${c.title} ${c.instructor_name ?? ""}`}
                                onSelect={() => go(`/courses/${c.slug}`)}
                            >
                                <GraduationCap />
                                <div className="flex flex-col">
                                    <span className="truncate">{c.title}</span>
                                    {c.instructor_name && (
                                        <span className="text-xs text-muted-foreground truncate">
                                            {c.instructor_name}
                                        </span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {articles.length > 0 && (
                    <>
                        {courses.length > 0 && <CommandSeparator />}
                        <CommandGroup heading="Bài viết">
                            {articles.map((a) => (
                                <CommandItem
                                    key={`article-${a.id}`}
                                    value={`article ${a.title}`}
                                    onSelect={() =>
                                        go(`/articles/${a.slug}`)
                                    }
                                >
                                    <PencilLine />
                                    <span className="truncate">{a.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                {(courses.length > 0 || articles.length > 0) && (
                    <CommandSeparator />
                )}

                <CommandGroup heading="Điều hướng">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <CommandItem
                                key={item.href}
                                value={`${item.label} ${item.keywords ?? ""}`}
                                onSelect={() => go(item.href)}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Công cụ Developer">
                    {TOOL_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <CommandItem
                                key={item.href}
                                value={`tool ${item.label}`}
                                onSelect={() => go(item.href)}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Hành động">
                    <CommandItem
                        value="search-courses"
                        onSelect={() => go("/courses")}
                    >
                        <SearchIcon />
                        <span>Tìm kiếm khóa học</span>
                        <CommandShortcut>G C</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                        value="theme-toggle dark light"
                        onSelect={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                            setOpen(false);
                        }}
                    >
                        {theme === "dark" ? <Sun /> : <Moon />}
                        <span>
                            Chuyển sang chế độ{" "}
                            {theme === "dark" ? "sáng" : "tối"}
                        </span>
                        <CommandShortcut>⌥T</CommandShortcut>
                    </CommandItem>

                    {isAuthenticated ? (
                        <>
                            <CommandItem
                                value="profile"
                                onSelect={() => go(profileHref)}
                            >
                                <UserIcon />
                                <span>Hồ sơ của tôi</span>
                            </CommandItem>
                            <CommandItem
                                value="settings"
                                onSelect={() => go("/settings")}
                            >
                                <SettingsIcon />
                                <span>Cài đặt</span>
                            </CommandItem>
                            {user?.role === "admin" && (
                                <CommandItem
                                    value="admin dashboard"
                                    onSelect={() => go("/admin")}
                                >
                                    <LayoutDashboard />
                                    <span>Bảng quản trị</span>
                                </CommandItem>
                            )}
                            <CommandItem
                                value="logout"
                                onSelect={() => {
                                    setOpen(false);
                                    void logout();
                                }}
                            >
                                <LogOut />
                                <span>Đăng xuất</span>
                            </CommandItem>
                        </>
                    ) : (
                        <CommandItem
                            value="login signin"
                            onSelect={() => go("/auth/login")}
                        >
                            <LogIn />
                            <span>Đăng nhập</span>
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}

/**
 * Helper: open the command palette from anywhere via a custom event.
 *   import { openCommandPalette } from "@/components/CommandPalette";
 *   openCommandPalette();
 */
export function openCommandPalette() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("codemind:open-command-palette"));
}
