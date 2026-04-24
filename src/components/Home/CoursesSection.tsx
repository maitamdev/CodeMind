"use client";

import { ArrowRight, Clock, Eye, Users, Sparkles, Zap, Star } from "lucide-react";

import AvatarWithProBadge from "@/components/AvatarWithProBadge";
import { useState, useEffect, useRef } from "react";
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

// Helper function to calculate original price and discount for PRO courses
const calculatePricing = (currentPrice: number) => {
    const originalPrice = Math.round(currentPrice * 1.4);
    const roundedOriginalPrice = Math.round(originalPrice / 100000) * 100000;
    const discountPercent = Math.round(
        ((roundedOriginalPrice - currentPrice) / roundedOriginalPrice) * 100,
    );

    return {
        originalPrice: roundedOriginalPrice,
        currentPrice: currentPrice,
        discountPercent,
    };
};

export default function CoursesSection() {
    const [proCourses, setProCourses] = useState<Course[]>([]);
    const [freeCourses, setFreeCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
    const toast = useToast();
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/courses");
            const data = await response.json();

            if (data.success) {
                const courses = data.data.courses.map(
                    (course: any, index: number) => ({
                        ...course,
                        gradient: "",
                        featured: index === 0 && !course.isFree,
                        isEnrolled: false,
                    }),
                );

                const pro = courses.filter((c: Course) => c.isPro);
                const free = courses.filter((c: Course) => c.isFree);

                setProCourses(pro);
                setFreeCourses(free);
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

                if (data.data?.upgradedToPro) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    setTimeout(() => {
                        router.push(`/learn/${course.slug}`);
                    }, 800);
                }
            } else {
                if (data.message && data.message.includes("đã đăng ký")) {
                    toast.info(
                        "Bạn đã đăng ký khóa học này. Đang chuyển hướng...",
                    );
                    setTimeout(() => {
                        router.push(`/learn/${course.slug}`);
                    }, 800);
                } else {
                    toast.error(data.message || "Không thể đăng ký khóa học");
                }
            }
        } catch (error) {
            console.error("Error during enrollment:", error);
            toast.error("Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại");
        } finally {
            setEnrollingCourse(null);
        }
    };

    const handleProCourseClick = async (course: Course) => {
        if (!isAuthenticated) {
            router.push(`/courses/${course.slug}`);
            return;
        }

        if (enrollingCourse) return;

        try {
            setEnrollingCourse(course.id);

            const response = await fetch(`/api/courses/${course.slug}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                if (data.data.isEnrolled) {
                    router.push(`/learn/${course.slug}`);
                } else {
                    router.push(`/courses/${course.slug}`);
                }
            } else {
                router.push(`/courses/${course.slug}`);
            }
        } catch (error) {
            console.error("Error checking enrollment:", error);
            router.push(`/courses/${course.slug}`);
        } finally {
            setEnrollingCourse(null);
        }
    };

    // Skeleton loading component
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

    const renderSectionHeader = (title: string, subtitle: string, badge?: string) => (
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-foreground font-mono" style={{ fontWeight: 800 }}>
                        {title}
                    </h2>
                    {badge && (
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-border text-muted-foreground">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-sm">{subtitle}</p>
            </div>
            <a
                href="/roadmap"
                className="hidden md:flex items-center text-muted-foreground font-mono text-sm hover:text-foreground transition-colors duration-200"
            >
                Xem lộ trình
                <ArrowRight className="w-4 h-4 ml-2" />
            </a>
        </div>
    );

    const GRID_CLASS =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-px bg-border";

    return (
        <section
            id="courses-section"
            className="py-16 bg-background"
        >
            <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                {loading ? (
                    <>
                        {/* PRO Courses Skeleton */}
                        <div className="mb-16">
                            {renderSectionHeader("Khóa học Pro", "Khóa học chuyên sâu cho developer", "PRO")}
                            <div className={GRID_CLASS}>
                                {[...Array(4)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        </div>
                        {/* FREE Courses Skeleton */}
                        <div>
                            {renderSectionHeader("Khóa học miễn phí", "Học miễn phí với các khóa học chất lượng")}
                            <div className={GRID_CLASS}>
                                {[...Array(4)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {proCourses.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="mb-16"
                            >
                                {renderSectionHeader("Khóa học Pro", "Khóa học chuyên sâu cho developer", "PRO")}
                                <div className={GRID_CLASS}>
                                    {proCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onEnroll={() =>
                                                handleEnroll(course)
                                            }
                                            onProClick={() =>
                                                handleProCourseClick(course)
                                            }
                                            isEnrolling={
                                                enrollingCourse === course.id
                                            }
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {freeCourses.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderSectionHeader("Khóa học miễn phí", "Học miễn phí với các khóa học chất lượng")}
                                <div className={GRID_CLASS}>
                                    {freeCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onEnroll={() =>
                                                handleEnroll(course)
                                            }
                                            isEnrolling={
                                                enrollingCourse === course.id
                                            }
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
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
    const toast = useToast();
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

        if (!isAuthenticated) {
            router.push(`/courses/${course.slug}`);
            return;
        }

        (async () => {
            try {
                const response = await fetch(`/api/courses/${course.slug}`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.success && data.data.isEnrolled) {
                    router.push(`/learn/${course.slug}`);
                } else {
                    router.push(`/courses/${course.slug}`);
                }
            } catch {
                router.push(`/courses/${course.slug}`);
            }
        })();
    };

    const instructorName =
        course.instructor?.name || course.instructor?.username || "Giảng viên";
    const instructorAvatar = course.instructor?.avatar;
    const instructorIsPro = course.instructor?.isPro ?? false;
    const instructorIsRegistered = course.instructor?.isRegistered ?? false;
    const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";

    return (
        <div
            ref={cardRef}
            className="group cursor-pointer relative overflow-hidden bg-background"
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Spotlight hover effect */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(250px circle at ${localMouse.x}px ${localMouse.y}px, rgba(255,255,255,0.05), transparent 60%)`,
                    }}
                />
            )}

            <div className="relative z-10">
                {/* Banner */}
                <div
                    className={`relative aspect-video flex-shrink-0 overflow-hidden ${isEnrolling ? "opacity-50" : ""}`}
                >
                    {course.thumbnailUrl ? (
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Pro badge */}
                    {course.isPro && !isEnrolling && (
                        <div className="absolute top-3 left-3 z-20">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-foreground text-background text-[10px] font-mono font-bold uppercase tracking-wider">
                                <Zap className="w-3 h-3" /> PRO
                            </span>
                        </div>
                    )}

                    {/* Level badge */}
                    <div className="absolute top-3 right-3 z-20">
                        <span className="px-2 py-0.5 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[10px] font-mono uppercase tracking-wider">
                            {levelDisplay}
                        </span>
                    </div>

                    {/* Loading overlay */}
                    {isEnrolling && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
                            <div className="text-foreground text-center">
                                <div className="animate-spin h-5 w-5 border border-foreground border-t-transparent rounded-full mx-auto mb-2" />
                                <div className="text-xs font-mono">
                                    {course.isFree ? "enrolling..." : "checking..."}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-4">
                    {/* Title */}
                    <h3 className="text-foreground font-semibold text-sm mb-2 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {course.title}
                    </h3>

                    {/* Price row */}
                    <div className="mb-3">
                        {course.isPro ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-muted-foreground line-through font-mono">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        calculatePricing(course.priceAmount)
                                            .originalPrice,
                                    )}
                                    đ
                                </span>
                                <span className="text-sm font-bold text-foreground font-mono">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        course.priceAmount,
                                    )}
                                    đ
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm font-bold text-foreground font-mono">
                                {course.price === "Miễn phí"
                                    ? "$ free"
                                    : course.price}
                            </span>
                        )}
                    </div>

                    {/* Author + Stats row */}
                    <div className="flex items-center justify-between text-[12px] text-muted-foreground mt-auto font-mono">
                        {/* Author */}
                        <div className="flex items-center gap-1.5 min-w-0">
                            <AvatarWithProBadge
                                avatarUrl={instructorAvatar}
                                fullName={instructorName}
                                isPro={instructorIsPro}
                                isRegistered={instructorIsRegistered}
                                size="2xs"
                            />
                            <span className="truncate">
                                {instructorName}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {course.students.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {course.duration}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
