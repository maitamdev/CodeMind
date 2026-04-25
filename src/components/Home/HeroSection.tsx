"use client";

import {
    Users,
    BookOpen,
    ArrowRight,
    Sparkles,
    GraduationCap,
    Zap,
    Star,
    Terminal,
    Code2,
    Braces,
    Cpu,
    Search,
    X,
    FileText,
} from "lucide-react";
import { removeVietnameseTones } from "@/lib/string-utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

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
    thumbnailUrl?: string | null;
    instructor?: {
        name?: string;
        username?: string;
        avatar?: string | null;
    };
    featured?: boolean;
}

interface PlatformStats {
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    avgRating: number;
}

const LEVEL_MAP: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
};

const formatStatNumber = (num: number): string => {
    if (num >= 1000000)
        return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
    return num.toString();
};

// Typing animation hook
function useTypingEffect(text: string, speed: number = 60) {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayText("");
        setIsComplete(false);
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayText, isComplete };
}

export default function HeroSection() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const toast = useToast();
    const { isAuthenticated } = useAuth();

    // Search Logic
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        
        if (value.trim()) {
            const normalizedSearch = removeVietnameseTones(value.toLowerCase());
            const filtered = courses.filter(course => {
                const normalizedTitle = removeVietnameseTones(course.title.toLowerCase());
                return normalizedTitle.includes(normalizedSearch);
            });
            setSearchResults(filtered.slice(0, 5));
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const clearSearch = () => {
        setSearchValue("");
        setSearchResults([]);
        setShowResults(false);
    };

    const { displayText, isComplete } = useTypingEffect(
        "Nền tảng học lập trình tích hợp AI",
        45,
    );

    useEffect(() => {
        fetchCourses();
    }, []);

    // Track mouse for spotlight effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };
        const el = heroRef.current;
        if (el) el.addEventListener("mousemove", handleMouseMove);
        return () => {
            if (el) el.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/courses?limit=4&include_stats=1");
            const data = await response.json();

            if (data.success) {
                setCourses(
                    data.data.courses.map((course: any, index: number) => ({
                        ...course,
                        featured: index === 0,
                    })),
                );
                if (data.data.platformStats) {
                    setPlatformStats(data.data.platformStats);
                }
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
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
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    setTimeout(() => router.push(`/learn/${course.slug}`), 800);
                }
            } else {
                if (data.message?.includes("đã đăng ký")) {
                    toast.info("Bạn đã đăng ký khóa học này. Đang chuyển hướng...");
                    setTimeout(() => router.push(`/learn/${course.slug}`), 800);
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

    const handleCourseClick = useCallback(
        async (course: Course) => {
            if (enrollingCourse) return;

            if (!isAuthenticated) {
                if (course.isFree) {
                    toast.error("Vui lòng đăng nhập để tiếp tục");
                } else {
                    router.push(`/courses/${course.slug}`);
                }
                return;
            }

            try {
                setEnrollingCourse(course.id);
                const response = await fetch(`/api/courses/${course.slug}`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.success && data.data.isEnrolled) {
                    router.push(`/learn/${course.slug}`);
                } else if (course.isFree) {
                    await handleEnroll(course);
                } else {
                    router.push(`/courses/${course.slug}`);
                }
            } catch {
                router.push(`/courses/${course.slug}`);
            } finally {
                setEnrollingCourse(null);
            }
        },
        [isAuthenticated, enrollingCourse],
    );

    // Skeleton
    const SkeletonGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-secondary/50 animate-pulse p-8" style={{ minHeight: 180 }}>
                    <div className="h-3 w-16 bg-muted-foreground/20 mb-4" />
                    <div className="h-5 w-3/4 bg-muted-foreground/20 mb-3" />
                    <div className="h-3 w-full bg-muted-foreground/20 mb-2" />
                    <div className="h-3 w-2/3 bg-muted-foreground/20" />
                </div>
            ))}
        </div>
    );

    const FEATURE_ITEMS = [
        { icon: Terminal, label: "IDE trực tuyến", desc: "Code ngay trên trình duyệt" },
        { icon: Cpu, label: "AI Assistant", desc: "Trợ giảng AI thông minh" },
        { icon: Braces, label: "Dự án thực tế", desc: "Xây dựng portfolio chuẩn" },
        { icon: Code2, label: "Multi-language", desc: "JS, Python, C++, Java..." },
    ];

    return (
        <section ref={heroRef} className="relative w-full overflow-hidden bg-background">
            {/* ═══════════ PREMIUM BACKGROUND EFFECTS ═══════════ */}
            {/* 1. Base Grid */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* 2. Scanning Line Animation */}
            <motion.div 
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-[1] opacity-50"
            />

            {/* 3. Floating Code Symbols */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: ((i * 37) % 100) + "%", 
                            y: ((i * 13) % 100) + "%",
                            opacity: 0 
                        }}
                        animate={{ 
                            y: ["0%", "100%"],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 10 + ((i * 7) % 20), 
                            repeat: Infinity, 
                            delay: ((i * 3) % 5) 
                        }}
                        className="absolute font-mono text-4xl select-none"
                    >
                        {["{ }", "[ ]", "/>", "++", "==", "=>", "!!"][i % 7]}
                    </motion.div>
                ))}
            </div>


            {/* 4. Moving Gradient Blobs (Glassmorphism feel) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.03, 0.06, 0.03],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] pointer-events-none"
            />

            {/* 5. Radial spotlight following cursor */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-[2]"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary-rgb), 0.05), transparent 65%)`,
                }}
            />

            <div className="relative z-10">
                {/* ═══════════ HERO TEXT ═══════════ */}
                <div className="px-6 pt-16 pb-10 md:pt-24 md:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-4xl">
                        {/* Terminal prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <span className="text-muted-foreground font-mono text-sm">$</span>
                            <span className="text-muted-foreground font-mono text-sm">
                                cd ~/codemind
                            </span>
                        </motion.div>

                        {/* Main heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-4"
                        >
                            <Logo size="xl" />
                        </motion.div>

                        {/* Typing effect subtitle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="mb-8"
                        >
                            <p className="text-muted-foreground text-lg md:text-xl font-mono">
                                <span className="text-foreground/60">{">"} </span>
                                {displayText}
                                <span
                                    className={`inline-block w-[2px] h-5 bg-foreground ml-0.5 align-middle ${isComplete ? "animate-pulse" : ""}`}
                                />
                            </p>
                        </motion.div>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <button
                                onClick={() => {
                                    const el = document.getElementById("courses-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="group px-6 py-3 bg-foreground text-background font-mono text-sm font-semibold
                                           hover:opacity-90 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                            >
                                <span>Khám phá khóa học</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push("/roadmap")}
                                className="px-6 py-3 border border-border text-foreground font-mono text-sm font-semibold
                                           hover:bg-secondary transition-all duration-200 flex items-center gap-2 cursor-pointer"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Lộ trình học</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Side: Search & Feature Box */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="border border-border p-6 md:p-10 bg-secondary/10 backdrop-blur-sm relative z-50"
                            ref={searchContainerRef}
                        >
                            <div className="mb-6">
                                <h3 className="text-foreground font-mono text-lg font-bold mb-2">// Tìm kiếm tri thức</h3>
                                <p className="text-muted-foreground text-sm">Khám phá hàng trăm khóa học lập trình chất lượng cao.</p>
                            </div>

                            <div className="group relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Tìm khóa học, ngôn ngữ..."
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onFocus={() => {
                                        if (searchValue.trim()) setShowResults(true);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchResults.length > 0) {
                                            router.push(`/courses/${searchResults[0].slug}`);
                                            setShowResults(false);
                                        } else if (e.key === 'Escape') {
                                            clearSearch();
                                        }
                                    }}
                                    className="w-full bg-background border border-border px-12 py-4 font-mono text-sm
                                             focus:outline-none focus:border-foreground transition-all"
                                />
                                <div className="absolute right-4 flex items-center gap-2">
                                    {searchValue ? (
                                        <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground">
                                            <X className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <span className="hidden sm:block text-[10px] font-mono border border-border px-1.5 py-0.5 text-muted-foreground uppercase">Ctrl + K</span>
                                    )}
                                </div>
                            </div>

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showResults && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-[calc(100%-1px)] left-[24px] right-[24px] md:left-[40px] md:right-[40px] bg-background border border-border border-t-0 shadow-2xl overflow-hidden z-50"
                                    >
                                        {searchResults.length > 0 ? (
                                            <div className="divide-y divide-border">
                                                {searchResults.map((course) => (
                                                    <button
                                                        key={course.id}
                                                        onClick={() => {
                                                            router.push(`/courses/${course.slug}`);
                                                            setShowResults(false);
                                                        }}
                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors text-left"
                                                    >
                                                        <div className="w-10 h-10 bg-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                            {course.thumbnailUrl ? (
                                                                <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-foreground truncate">{course.title}</p>
                                                            <p className="text-xs text-muted-foreground font-mono">{course.isFree ? "$ Miễn phí" : "Khóa học PRO"}</p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center border-t border-border">
                                                <p className="text-muted-foreground font-mono text-xs">// Không tìm thấy kết quả</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* ═══════════ BENTO GRID ═══════════ */}
                <div className="px-6 pb-8">
                    {/* Stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        className="border border-border divide-x divide-border flex overflow-x-auto mb-px"
                    >
                        {[
                            {
                                icon: Users,
                                value: platformStats ? formatStatNumber(platformStats.totalStudents) : "—",
                                label: "Học viên",
                            },
                            {
                                icon: GraduationCap,
                                value: platformStats ? platformStats.totalCourses.toString() : "—",
                                label: "Khóa học",
                            },
                            {
                                icon: Star,
                                value: platformStats ? (platformStats.avgRating || "—").toString() : "—",
                                label: "Đánh giá",
                            },
                            {
                                icon: Zap,
                                value: "24/7",
                                label: "AI Support",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="flex-1 min-w-[120px] flex items-center gap-3 px-5 py-4 bg-background hover:bg-secondary/50 transition-colors"
                            >
                                <stat.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-foreground font-mono font-bold text-sm leading-none">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Featured courses grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        {loading ? (
                            <SkeletonGrid />
                        ) : courses.length === 0 ? (
                            <div className="border border-border p-16 text-center">
                                <p className="text-muted-foreground font-mono text-sm">
                                    // Chưa có khóa học nào
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 border border-border">
                                {courses.slice(0, 4).map((course, i) => (
                                    <BentoCard
                                        key={course.id}
                                        course={course}
                                        index={i}
                                        onClick={() => handleCourseClick(course)}
                                        isEnrolling={enrollingCourse === course.id}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Feature grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 border-x border-b border-border"
                    >
                        {FEATURE_ITEMS.map((feat, i) => (
                            <div
                                key={i}
                                className="group px-5 py-5 border-r last:border-r-0 border-b md:border-b-0 border-border
                                           hover:bg-secondary/50 transition-colors cursor-default"
                            >
                                <feat.icon className="w-5 h-5 text-muted-foreground mb-3 group-hover:text-foreground transition-colors" />
                                <p className="text-foreground font-mono text-sm font-semibold mb-1">
                                    {feat.label}
                                </p>
                                <p className="text-muted-foreground text-xs">{feat.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// Bento Card Component
// ============================================================
function BentoCard({
    course,
    index,
    onClick,
    isEnrolling,
}: {
    course: Course;
    index: number;
    onClick: () => void;
    isEnrolling: boolean;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setLocalMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative group cursor-pointer overflow-hidden
                transition-colors duration-300
                ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "border-b" : ""} border-border
                hover:bg-secondary/30
            `}
            style={{ minHeight: 200 }}
        >
            {/* Spotlight glow on hover */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
                    style={{
                        background: `radial-gradient(300px circle at ${localMouse.x}px ${localMouse.y}px, rgba(255,255,255,0.06), transparent 60%)`,
                    }}
                />
            )}

            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                {/* Top section */}
                <div>
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                        {course.isPro ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border text-foreground text-[11px] font-mono font-bold uppercase tracking-wider">
                                <Zap className="w-3 h-3" /> PRO
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border text-muted-foreground text-[11px] font-mono font-bold uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" /> FREE
                            </span>
                        )}
                        <span className="px-2 py-0.5 border border-border text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                            {levelDisplay}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-2 group-hover:text-foreground/90 transition-colors">
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                        {course.subtitle ||
                            "Khám phá khóa học chất lượng cao từ các chuyên gia hàng đầu."}
                    </p>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-muted-foreground text-xs font-mono">
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {course.students.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {course.rating > 0 ? course.rating.toFixed(1) : "—"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors text-sm font-mono">
                        {isEnrolling ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin h-3 w-3 border border-foreground border-t-transparent rounded-full" />
                                <span className="text-xs">loading...</span>
                            </span>
                        ) : (
                            <>
                                <span className="text-xs hidden sm:inline">
                                    {course.isFree ? "Học ngay" : "Xem chi tiết"}
                                </span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Thumbnail peek on large cards */}
            {course.thumbnailUrl && index === 0 && (
                <div className="absolute right-0 bottom-0 w-32 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img
                        src={course.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}
