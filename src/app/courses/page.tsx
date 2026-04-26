"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Filter,
    Star,
    Users,
    Clock,
    BookOpen,
    GraduationCap,
    Sparkles,
    ChevronRight,
    Zap,
    TrendingUp,
    Award,
    Code2,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/PageContainer";

interface Course {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    thumbnailUrl: string | null;
    level: string;
    price: string;
    priceAmount: number;
    isFree: boolean;
    isPro: boolean;
    duration: string;
    rating: number;
    students: number;
    totalLessons: number;
    category: { name: string; slug: string };
    instructor: {
        name: string;
        username: string;
        avatar: string | null;
        isPro: boolean;
    };
}

const LEVEL_MAP: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
};

const LEVEL_COLORS: Record<string, string> = {
    BEGINNER: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ADVANCED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const LEVEL_OPTIONS = [
    { value: "", label: "Tất cả cấp độ" },
    { value: "BEGINNER", label: "Cơ bản" },
    { value: "INTERMEDIATE", label: "Trung cấp" },
    { value: "ADVANCED", label: "Nâng cao" },
];

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-indigo-500">Đang tải...</div></div>}>
            <CoursesContent />
        </Suspense>
    );
}

function CoursesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [level, setLevel] = useState(searchParams.get("level") || "");
    const [totalCourses, setTotalCourses] = useState(0);
    const [platformStats, setPlatformStats] = useState<{
        totalStudents: number;
        totalCourses: number;
        avgRating: number;
    } | null>(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (level) params.set("level", level);
            if (search) params.set("search", search);
            params.set("include_stats", "1");
            params.set("limit", "20");

            const res = await fetch(`/api/courses?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setCourses(data.data.courses || []);
                setTotalCourses(data.data.pagination?.total || 0);
                if (data.data.platformStats) {
                    setPlatformStats(data.data.platformStats);
                }
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }, [level, search]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCourses();
    };

    const clearFilters = () => {
        setSearch("");
        setLevel("");
    };

    const hasFilters = search || level;

    return (
        <div className="min-h-screen bg-background">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION
               ═══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b border-border">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/3 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/3 rounded-full blur-[100px]" />

                <PageContainer className="relative z-10 py-16 lg:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-semibold mb-6">
                                <Sparkles className="w-4 h-4" />
                                Học miễn phí 100%
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
                                Khóa học{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
                                    Lập trình
                                </span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Từ zero đến hero — hệ thống khóa học bài bản, có AI hỗ trợ 24/7,
                                thực hành trực tiếp trên trình duyệt. Tất cả hoàn toàn miễn phí.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        {platformStats && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-center gap-8 mb-8"
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">
                                        {platformStats.totalCourses}+
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Khóa học
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">
                                        {platformStats.totalStudents.toLocaleString()}+
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Học viên
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        {platformStats.avgRating}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Đánh giá
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Search Bar */}
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-xl mx-auto relative"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm khóa học..."
                                className="w-full pl-12 pr-4 py-3.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </motion.form>
                    </div>
                </PageContainer>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                FILTERS & COURSES GRID
               ═══════════════════════════════════════════════════════════ */}
            <PageContainer className="py-10">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    {LEVEL_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setLevel(opt.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                                level === opt.value
                                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500"
                                    : "bg-secondary/30 border-border text-muted-foreground hover:text-foreground hover:border-border"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="ml-auto text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Xóa bộ lọc
                        </button>
                    )}

                    <span className="ml-auto text-sm text-muted-foreground">
                        {totalCourses} khóa học
                    </span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-secondary/30 border border-border rounded-2xl overflow-hidden animate-pulse"
                            >
                                <div className="aspect-video bg-secondary" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-secondary rounded w-3/4" />
                                    <div className="h-3 bg-secondary rounded w-full" />
                                    <div className="h-3 bg-secondary rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 bg-secondary/50 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            Chưa có khóa học nào
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            {hasFilters
                                ? "Không tìm thấy khóa học phù hợp với bộ lọc. Hãy thử thay đổi điều kiện tìm kiếm."
                                : "Các khóa học đang được xây dựng. Hãy quay lại sau nhé!"}
                        </p>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    /* Courses Grid */
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/courses/${course.slug}`}>
                                    <div className="group bg-secondary/20 border border-border rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer h-full flex flex-col">
                                        {/* Thumbnail */}
                                        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                                            {course.thumbnailUrl ? (
                                                <img
                                                    src={course.thumbnailUrl}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Code2 className="w-12 h-12 text-indigo-500/40" />
                                                </div>
                                            )}

                                            {/* Free badge */}
                                            {course.isFree && (
                                                <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
                                                    <Zap className="w-3 h-3" />
                                                    Miễn phí
                                                </div>
                                            )}

                                            {/* Level badge */}
                                            <div
                                                className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-sm ${
                                                    LEVEL_COLORS[course.level] ||
                                                    LEVEL_COLORS.BEGINNER
                                                }`}
                                            >
                                                {LEVEL_MAP[course.level] || "Cơ bản"}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            {/* Category */}
                                            {course.category?.name && (
                                                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                                                    {course.category.name}
                                                </span>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-base font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2 mb-2">
                                                {course.title}
                                            </h3>

                                            {/* Subtitle */}
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                                {course.subtitle}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    {course.totalLessons} bài
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {course.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {course.students.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                {/* Rating */}
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-bold text-foreground">
                                                        {course.rating > 0
                                                            ? course.rating.toFixed(1)
                                                            : "Mới"}
                                                    </span>
                                                </div>

                                                {/* Instructor */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                                                        {course.instructor?.avatar ? (
                                                            <img
                                                                src={course.instructor.avatar}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <GraduationCap className="w-3 h-3 text-indigo-500" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                                                        {course.instructor?.name || "CodeMind"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </PageContainer>

            {/* ═══════════════════════════════════════════════════════════
                CTA SECTION
               ═══════════════════════════════════════════════════════════ */}
            {!loading && courses.length > 0 && (
                <section className="py-16 border-t border-border">
                    <PageContainer>
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                Học xong, nhận chứng chỉ!
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Hoàn thành bất kỳ khóa học nào để nhận chứng chỉ hoàn thành
                                từ CodeMind — bổ sung vào CV chuyên nghiệp của bạn.
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Zap className="w-4 h-4 text-emerald-500" />
                                    100% Miễn phí
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="flex items-center gap-1.5">
                                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                                    AI hỗ trợ 24/7
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-amber-500" />
                                    Chứng chỉ hoàn thành
                                </span>
                            </div>
                        </div>
                    </PageContainer>
                </section>
            )}
        </div>
    );
}
