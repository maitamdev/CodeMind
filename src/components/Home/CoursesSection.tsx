"use client";

import { Clock, Eye, Search, Sparkles, Star, Trophy, Users, Zap } from "lucide-react";

import AvatarWithProBadge from "@/components/AvatarWithProBadge";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Course {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    price: string;
    priceAmount: number;
    rating: number;
    students: number;
    duration: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    isPro: boolean;
    isFree: boolean;
    gradient: string;
    featured?: boolean;
    totalLessons: number;
    isEnrolled?: boolean;
    thumbnailUrl?: string | null;
    instructor?: {
        name?: string;
        username?: string;
        avatar?: string | null;
        isPro?: boolean;
        isRegistered?: boolean;
    };
}

const LEVEL_MAP: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
};

const calculatePricing = (currentPrice: number) => {
    const originalPrice = Math.round(currentPrice * 1.4);
    const roundedOriginalPrice = Math.round(originalPrice / 100000) * 100000;
    const discountPercent = Math.round(
        ((roundedOriginalPrice - currentPrice) / roundedOriginalPrice) * 100,
    );

    return {
        originalPrice: roundedOriginalPrice,
        currentPrice,
        discountPercent,
    };
};

const sectionLinks = [
    { label: "Lộ trình", href: "/roadmap" },
    { label: "Bài viết", href: "/articles" },
    { label: "Q&A", href: "/qa" },
];

export default function CoursesSection() {
    const [proCourses, setProCourses] = useState<Course[]>([]);
    const [freeCourses, setFreeCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"all" | "pro" | "free">("all");
    const [sortMode, setSortMode] = useState<"popular" | "rating" | "newest">("popular");
    const [searchTerm, setSearchTerm] = useState("");
    const toast = useToast();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState(8);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const onResize = () => setVisibleCount(window.innerWidth >= 1280 ? 10 : 8);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/courses");
            const data = await response.json();

            if (data.success) {
                const courses = data.data.courses.map((course: any, index: number) => ({
                    ...course,
                    gradient: "",
                    featured: index === 0 && !course.isFree,
                    isEnrolled: false,
                }));

                setProCourses(courses.filter((c: Course) => c.isPro));
                setFreeCourses(courses.filter((c: Course) => c.isFree));
            } else {
                toast.error("Không thể tải danh sách khóa học");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Đã có lỗi xảy ra khi tải khóa học");
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (course: Course) => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để đăng ký khóa học");
            return;
        }
        if (enrollingCourse) return;

        try {
            setEnrollingCourse(course.id);
            const response = await fetch(`/api/courses/${course.slug}/enroll`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Đăng ký khóa học thành công!");
                setTimeout(() => router.push(`/learn/${course.slug}`), 900);
            } else {
                toast.error(data.message || "Không thể đăng ký khóa học");
            }
        } catch (error) {
            console.error("Error during enrollment:", error);
            toast.error("Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại");
        } finally {
            setEnrollingCourse(null);
        }
    };

    const handleProCourseClick = (course: Course) => {
        router.push(isAuthenticated ? `/courses/${course.slug}` : `/courses/${course.slug}`);
    };

    const proCount = proCourses.length;
    const freeCount = freeCourses.length;
    const allCourses = [...proCourses, ...freeCourses];
    const filteredCourses = (activeTab === "pro"
        ? proCourses
        : activeTab === "free"
            ? freeCourses
            : allCourses
    ).filter((course) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return [course.title, course.subtitle, course.instructor?.name, course.instructor?.username]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(q));
    }).sort((a, b) => {
        if (sortMode === "rating") return b.rating - a.rating;
        if (sortMode === "newest") return (b.totalLessons ?? 0) - (a.totalLessons ?? 0);
        return b.students - a.students;
    });

    const SkeletonCard = () => (
        <div className="border border-border overflow-hidden h-full flex flex-col bg-background animate-pulse">
            <div className="relative aspect-video bg-secondary flex-shrink-0" />
            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3 flex-1">
                    <div className="h-5 w-3/4 bg-secondary mb-2" />
                    <div className="h-4 w-full bg-secondary mb-3" />
                </div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="h-4 w-12 bg-secondary" />
                        <div className="h-4 w-16 bg-secondary" />
                    </div>
                    <div className="h-4 w-16 bg-secondary" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-secondary" />
                    <div className="h-6 w-16 bg-secondary" />
                </div>
            </div>
        </div>
    );

    return (
        <section id="courses-section" ref={sectionRef} className="py-16 bg-background">
            <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 border border-border bg-secondary/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                            <Sparkles className="h-3.5 w-3.5" />
                            Danh mục học tập
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Khóa học được sắp xếp để bạn bắt đầu nhanh hơn
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Chọn giữa khóa Pro, miễn phí hoặc xem toàn bộ danh mục theo nhu cầu học tập hiện tại.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sectionLinks.map((link) => (
                            <a key={link.href} href={link.href} className="border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm khóa học, giảng viên, nội dung..."
                            className="w-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                        />
                    </div>
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
                        className="border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                    >
                        <option value="popular">Phổ biến</option>
                        <option value="rating">Đánh giá cao</option>
                        <option value="newest">Nhiều bài nhất</option>
                    </select>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        {[
                            { id: "all", label: `Tất cả (${proCount + freeCount})` },
                            { id: "pro", label: `Pro (${proCount})` },
                            { id: "free", label: `Miễn phí (${freeCount})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`border px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-secondary"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
                        {[...Array(8)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="border border-border bg-background px-6 py-14 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-border bg-secondary">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">Không tìm thấy khóa học phù hợp</h3>
                        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
                            Thử đổi từ khóa tìm kiếm hoặc chuyển sang tab khác để xem thêm lựa chọn.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 grid gap-4 sm:grid-cols-3">
                            <div className="border border-border bg-background p-4 flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center border border-border bg-secondary">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Học nhanh</p>
                                    <p className="text-xs text-muted-foreground">Cấu trúc rõ, ít ma sát</p>
                                </div>
                            </div>
                            <div className="border border-border bg-background p-4 flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center border border-border bg-secondary">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Có động lực</p>
                                    <p className="text-xs text-muted-foreground">Streak, XP và badge</p>
                                </div>
                            </div>
                            <div className="border border-border bg-background p-4 flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center border border-border bg-secondary">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Cộng đồng</p>
                                    <p className="text-xs text-muted-foreground">Học cùng người khác</p>
                                </div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-px bg-border">
                            {filteredCourses.slice(0, visibleCount).map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onEnroll={() => handleEnroll(course)}
                                    onProClick={() => handleProCourseClick(course)}
                                    isEnrolling={enrollingCourse === course.id}
                                />
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}

function CourseCard({
    course,
    onEnroll,
    onProClick,
    isEnrolling,
}: {
    course: Course;
    onEnroll: () => void;
    onProClick?: () => void;
    isEnrolling: boolean;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);
    const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setLocalMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handleCardClick = () => {
        if (isEnrolling) return;
        if (course.isPro && onProClick) {
            onProClick();
            return;
        }
        if (!isAuthenticated) {
            router.push(`/courses/${course.slug}`);
            return;
        }
        router.push(course.isFree ? `/learn/${course.slug}` : `/courses/${course.slug}`);
    };

    const instructorName = course.instructor?.name || course.instructor?.username || "Giảng viên";
    const instructorAvatar = course.instructor?.avatar;
    const instructorIsPro = course.instructor?.isPro ?? false;
    const instructorIsRegistered = course.instructor?.isRegistered ?? false;
    const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";
    const rating = Number.isFinite(course.rating) ? course.rating.toFixed(1) : "4.8";

    return (
        <div
            ref={cardRef}
            className="group cursor-pointer relative overflow-hidden bg-background"
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(250px circle at ${localMouse.x}px ${localMouse.y}px, rgba(255,255,255,0.05), transparent 60%)`,
                    }}
                />
            )}

            <div className="relative z-10 h-full border border-border">
                <div className={`relative aspect-video flex-shrink-0 overflow-hidden ${isEnrolling ? "opacity-50" : ""}`}>
                    {course.thumbnailUrl ? (
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {course.isPro && !isEnrolling && (
                        <div className="absolute top-3 left-3 z-20">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-foreground text-background text-[10px] font-mono font-bold uppercase tracking-wider">
                                <Zap className="w-3 h-3" /> PRO
                            </span>
                        </div>
                    )}

                    <div className="absolute top-3 right-3 z-20">
                        <span className="px-2 py-0.5 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[10px] font-mono uppercase tracking-wider">
                            {levelDisplay}
                        </span>
                    </div>

                    {isEnrolling && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
                            <div className="text-foreground text-center">
                                <div className="animate-spin h-5 w-5 border border-foreground border-t-transparent rounded-full mx-auto mb-2" />
                                <div className="text-xs font-mono">{course.isFree ? "enrolling..." : "checking..."}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex h-full flex-col p-4">
                    <h3 className="mb-2 text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-foreground/80">
                        {course.title}
                    </h3>
                    <p className="mb-3 text-xs leading-5 text-muted-foreground line-clamp-2">{course.subtitle}</p>

                    <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {rating}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {course.students.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                    </div>

                    <div className="mb-3 flex items-baseline gap-2">
                        {course.isPro ? (
                            <>
                                <span className="text-xs text-muted-foreground line-through font-mono">
                                    {new Intl.NumberFormat("vi-VN").format(calculatePricing(course.priceAmount).originalPrice)}đ
                                </span>
                                <span className="text-sm font-bold text-foreground font-mono">
                                    {new Intl.NumberFormat("vi-VN").format(course.priceAmount)}đ
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-foreground font-mono">Miễn phí</span>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-muted-foreground font-mono">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <AvatarWithProBadge
                                avatarUrl={instructorAvatar}
                                fullName={instructorName}
                                isPro={instructorIsPro}
                                isRegistered={instructorIsRegistered}
                                size="2xs"
                            />
                            <span className="truncate">{instructorName}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (course.isPro && onProClick) {
                                    onProClick();
                                    return;
                                }
                                onEnroll();
                            }}
                            className="shrink-0 border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
                        >
                            {course.isPro ? "Chi tiết" : "Học ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
