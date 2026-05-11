"use client";

export const dynamic = "force-dynamic";

import {
    BookOpen,
    Search,
    Bookmark,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Sparkles,
    Clock3,
    Flame,
    LayoutGrid,
    ArrowRight,
    Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AvatarWithProBadge from "@/components/AvatarWithProBadge";
import { getCanonicalProfilePath } from "@/lib/profile-url";

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    username: string;
    full_name: string;
    avatar_url: string | null;
    membership_type: string | null;
    published_at: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    bookmark_count: number;
    category_names: string | null;
    tag_names: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

function estimateReadingTime(excerpt: string): number {
    const wordCount = excerpt.split(/\s+/).length;
    const estimatedTotal = wordCount * 5;
    return Math.max(2, Math.round(estimatedTotal / 200));
}

function formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffWeeks < 5) return `${diffWeeks} tuần trước`;
    if (diffMonths < 12) return `${diffMonths} tháng trước`;
    return `${diffYears} năm trước`;
}

export default function ArticlesPage() {
    const toast = useToast();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const ITEMS_PER_PAGE = 10;
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
    const [bookmarkingPosts, setBookmarkingPosts] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchArticles(currentPage);
    }, [selectedCategory, currentPage]);

    useEffect(() => {
        if (articles.length > 0 && isAuthenticated) {
            checkBookmarkStatuses();
        } else {
            setBookmarkedPosts(new Set());
        }
    }, [articles, isAuthenticated]);

    const checkBookmarkStatuses = async () => {
        if (!isAuthenticated || articles.length === 0) return;
        try {
            const bookmarkPromises = articles.map(async (article) => {
                try {
                    const res = await fetch(`/api/blog/posts/${article.slug}/bookmark`, { credentials: "include" });
                    const result = await res.json();
                    if (result.success && result.data.bookmarked) return article.id;
                } catch (error) {
                    console.error(`Error checking bookmark for article ${article.id}:`, error);
                }
                return null;
            });
            const bookmarkedIds = (await Promise.all(bookmarkPromises)).filter((id): id is number => id !== null);
            setBookmarkedPosts(new Set(bookmarkedIds));
        } catch (error) {
            console.error("Error checking bookmark statuses:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/blog/categories");
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (error) {
            console.error("Fetch categories error:", error);
        }
    };

    const fetchArticles = async (page: number) => {
        try {
            setIsLoading(true);
            const offset = (page - 1) * ITEMS_PER_PAGE;
            const params = new URLSearchParams({ limit: ITEMS_PER_PAGE.toString(), offset: offset.toString() });
            if (selectedCategory) params.append("categoryId", selectedCategory.toString());
            const res = await fetch(`/api/blog/posts?${params}`);
            const result = await res.json();
            if (result.success) {
                const posts = result.data?.posts || result.data || [];
                setArticles(Array.isArray(posts) ? posts : []);
                const pag = result.data?.pagination || result.pagination;
                if (pag) setTotalItems(pag.total || 0);
            } else {
                toast.error(result.error || result.message || "Không thể tải danh sách bài viết");
            }
        } catch (error) {
            console.error("Fetch articles error:", error);
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setIsLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const handleBookmark = async (e: React.MouseEvent, article: Article) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để lưu bài viết");
            router.push("/auth/login");
            return;
        }

        if (bookmarkingPosts.has(article.id)) return;

        try {
            setBookmarkingPosts((prev) => new Set(prev).add(article.id));
            const res = await fetch(`/api/blog/posts/${article.slug}/bookmark`, { method: "POST", credentials: "include" });
            const result = await res.json();
            if (result.success) {
                const isBookmarked = result.data.bookmarked;
                setBookmarkedPosts((prev) => {
                    const newSet = new Set(prev);
                    if (isBookmarked) newSet.add(article.id);
                    else newSet.delete(article.id);
                    return newSet;
                });
                setArticles((prev) =>
                    prev.map((a) =>
                        a.id === article.id ? { ...a, bookmark_count: isBookmarked ? a.bookmark_count + 1 : Math.max(0, a.bookmark_count - 1) } : a,
                    ),
                );
                toast.success(result.message || (isBookmarked ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết"));
            } else {
                toast.error(result.message || "Không thể lưu bài viết");
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Không thể lưu bài viết");
        } finally {
            setBookmarkingPosts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(article.id);
                return newSet;
            });
        }
    };

    const getTags = (tagNames: string | null) => {
        if (!tagNames) return [];
        return tagNames.split(", ").filter((t) => t).slice(0, 3);
    };

    const featuredArticles = useMemo(() => articles.slice(0, 3), [articles]);

    const renderBlogCard = (article: Article, index: number) => {
        const tags = getTags(article.tag_names);
        const readingTime = estimateReadingTime(article.excerpt || "");
        const relativeTime = formatRelativeTime(article.published_at);

        return (
            <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group overflow-hidden border border-border bg-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
                <Link href={`/articles/${article.slug}`} className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="flex flex-col p-5 md:p-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <Link href={getCanonicalProfilePath(article.username)} className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                                <AvatarWithProBadge
                                    avatarUrl={article.avatar_url}
                                    fullName={article.full_name}
                                    isPro={article.membership_type?.toUpperCase() === "PRO"}
                                    size="xs"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{article.full_name}</p>
                                    <p className="text-[11px] text-muted-foreground">{relativeTime}</p>
                                </div>
                            </Link>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => handleBookmark(e, article)}
                                    disabled={bookmarkingPosts.has(article.id)}
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-none border border-border transition-colors ${bookmarkedPosts.has(article.id) ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:bg-secondary"} ${bookmarkingPosts.has(article.id) ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    title={bookmarkedPosts.has(article.id) ? "Bỏ lưu" : "Lưu bài viết"}
                                >
                                    <Bookmark className={`h-4.5 w-4.5 ${bookmarkedPosts.has(article.id) ? "fill-current" : ""}`} />
                                </button>
                                <button className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-border text-muted-foreground transition-colors hover:bg-secondary">
                                    <MoreHorizontal className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                {tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 border border-border bg-secondary/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        <Tag className="h-3 w-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h2 className="line-clamp-2 text-[20px] font-semibold leading-8 text-foreground transition-colors group-hover:text-primary">
                                {article.title}
                            </h2>
                            {article.excerpt && (
                                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                                    {article.excerpt}
                                </p>
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {readingTime} phút đọc</span>
                            <span className="inline-flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" /> {article.view_count.toLocaleString()} lượt xem</span>
                            <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> {article.like_count.toLocaleString()} lượt thích</span>
                        </div>
                    </div>

                    <div className="relative min-h-[220px] border-t border-border md:border-l md:border-t-0 bg-secondary/10">
                        {article.cover_image ? (
                            <Image src={article.cover_image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
                                <BookOpen className="h-10 w-10" />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-5 text-white">
                            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] text-white/70">
                                <Sparkles className="h-3.5 w-3.5" />
                                Bài viết nổi bật
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/90">{article.category_names || "Kiến thức công nghệ, học tập và phát triển"}</p>
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    };

    const renderSkeleton = () => (
        <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden border border-border bg-background shadow-sm">
                    <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                        <div className="p-5 md:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-none bg-secondary" />
                                    <div>
                                        <div className="h-4 w-28 bg-secondary" />
                                        <div className="mt-2 h-3 w-16 bg-secondary/80" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-9 w-9 bg-secondary" />
                                    <div className="h-9 w-9 bg-secondary" />
                                </div>
                            </div>
                            <div className="mb-3 h-4 w-24 bg-secondary/80" />
                            <div className="h-6 w-4/5 bg-secondary" />
                            <div className="mt-3 h-5 w-full bg-secondary/80" />
                            <div className="mt-2 h-5 w-11/12 bg-secondary/80" />
                            <div className="mt-5 flex gap-3">
                                <div className="h-7 w-20 bg-secondary/80" />
                                <div className="h-7 w-20 bg-secondary/80" />
                            </div>
                        </div>
                        <div className="min-h-[220px] bg-secondary/60" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSidebar = () => (
        <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
                <div className="border border-border bg-background p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Discover</p>
                            <h3 className="mt-2 text-xl font-semibold">Tìm bài viết nhanh hơn</h3>
                        </div>
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-4 relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Tìm bài viết, tác giả, tag..."
                            className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                        />
                    </div>
                </div>

                <div className="border border-border bg-background p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chủ đề</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setCurrentPage(1);
                            }}
                            className={`rounded-none border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === null ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-secondary"}`}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                    setCurrentPage(1);
                                }}
                                className={`rounded-none border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat.id ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-secondary"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border border-border bg-secondary/10 p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Nổi bật tuần này</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                        {featuredArticles.length > 0 ? featuredArticles.map((article) => (
                            <Link key={article.id} href={`/articles/${article.slug}`} className="block border border-border bg-background p-4 transition-colors hover:bg-secondary/30">
                                <p className="line-clamp-2 font-medium leading-6">{article.title}</p>
                                <p className="mt-2 text-xs text-muted-foreground">{article.full_name} · {estimateReadingTime(article.excerpt || "")} phút đọc</p>
                            </Link>
                        )) : (
                            <p className="text-sm text-muted-foreground">Bài viết nổi bật sẽ hiện ở đây khi có nội dung mới.</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-secondary/10">
                <PageContainer size="lg" className="py-10 lg:py-14">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                                Knowledge feed
                            </motion.div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Bài viết nổi bật</h1>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                                    Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học, lập trình online và góc nhìn thực chiến từ cộng đồng.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/write" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                                    Viết bài mới
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="/courses" className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                                    Khám phá khóa học
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                { label: "Bài viết", value: totalItems || articles.length, icon: BookOpen },
                                { label: "Chủ đề", value: categories.length, icon: LayoutGrid },
                                { label: "Mới nhất", value: "Hằng ngày", icon: Clock3 },
                            ].map((item) => (
                                <div key={item.label} className="border border-border bg-background p-5 shadow-sm">
                                    <item.icon className="h-5 w-5 text-foreground" />
                                    <p className="mt-4 text-2xl font-bold">{item.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </PageContainer>
            </div>

            <PageContainer size="lg" className="py-8 lg:py-10">
                <div className="mb-6 flex flex-wrap items-center gap-2 lg:hidden">
                    <button
                        onClick={() => {
                            setSelectedCategory(null);
                            setCurrentPage(1);
                        }}
                        className={`rounded-none border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === null ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground"}`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                setCurrentPage(1);
                            }}
                            className={`rounded-none border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat.id ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground"}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <main className="space-y-4">
                        {isLoading ? (
                            renderSkeleton()
                        ) : articles.length > 0 ? (
                            <div className="space-y-4">{articles.map((article, index) => renderBlogCard(article, index))}</div>
                        ) : (
                            <div className="border border-border bg-background py-20 text-center shadow-sm">
                                <BookOpen className="mx-auto mb-4 h-14 w-14 text-muted-foreground/40" />
                                <h3 className="mb-2 text-lg font-semibold text-foreground">Chưa có bài viết</h3>
                                <p className="mb-6 text-muted-foreground">
                                    {selectedCategory ? "Không tìm thấy bài viết phù hợp với chủ đề này." : "Hãy là người đầu tiên chia sẻ kiến thức!"}
                                </p>
                                <Link href="/write" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                                    Viết bài viết đầu tiên
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}

                        {!isLoading && articles.length > 0 && totalPages > 1 && (
                            <nav className="flex items-center justify-center gap-1 pt-4" aria-label="Pagination">
                                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {getPageNumbers().map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`dots-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">…</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`inline-flex h-9 w-9 items-center justify-center border text-sm transition-colors ${page === currentPage ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-secondary"}`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}

                                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        )}
                    </main>

                    {renderSidebar()}
                </div>
            </PageContainer>
        </div>
    );
}
