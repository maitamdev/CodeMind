"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  FileText,
  Search,
  Sparkles,
  Terminal,
  X,
  Braces,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Logo from "@/components/Logo";
import { removeVietnameseTones } from "@/lib/string-utils";

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
}

interface PlatformStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  avgRating: number;
}

function useTypingEffect(text: string, speed = 60) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i += 1;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

const formatStatNumber = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}k+`;
  return String(num);
};

export default function HeroSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { displayText, isComplete } = useTypingEffect("Nền tảng học lập trình tích hợp AI", 45);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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
        setCourses(data.data.courses || []);
        if (data.data.platformStats) setPlatformStats(data.data.platformStats);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const normalizedSearch = removeVietnameseTones(value.toLowerCase());
    const filtered = courses.filter((course) => {
      const haystack = [course.title, course.subtitle].join(" ");
      return removeVietnameseTones(haystack.toLowerCase()).includes(normalizedSearch);
    });

    setSearchResults(filtered.slice(0, 6));
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setShowResults(false);
  };

  const quickTopics = ["React", "Next.js", "TypeScript", "AI", "Python", "Backend"];
  const hasSearchResults = showResults && searchResults.length > 0;
  const hasNoSearchResults = showResults && searchValue.trim() && searchResults.length === 0;

  const featureItems = [
    { icon: Terminal, label: "IDE trực tuyến", desc: "Code ngay trên trình duyệt" },
    { icon: Cpu, label: "AI Assistant", desc: "Trợ giảng AI thông minh" },
    { icon: Braces, label: "Dự án thực tế", desc: "Xây dựng portfolio chuẩn" },
    { icon: Code2, label: "Multi-language", desc: "JS, Python, C++, Java..." },
  ];

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px]"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500"
        style={{
          background: `radial-gradient(720px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary-rgb), 0.07), transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
        <div className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Nền tảng học lập trình tích hợp AI
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-6 inline-flex flex-wrap items-center gap-2 border border-border bg-secondary/20 px-3 py-2 text-[11px] tracking-wide text-muted-foreground"
            >
              <span className="font-mono uppercase">Premium stack</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>CV Builder</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>Study Planner</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>ATS Analyzer</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>Messenger</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-5"
            >
              <Logo size="xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-8 grid max-w-2xl gap-3 sm:grid-cols-3"
            >
              {[
                { label: "Học viên", value: platformStats ? formatStatNumber(platformStats.totalStudents) : "10k+" },
                { label: "Instructor", value: platformStats ? formatStatNumber(platformStats.totalInstructors) : "120+" },
                { label: "Khóa học", value: platformStats ? formatStatNumber(platformStats.totalCourses) : "80+" },
              ].map((item) => (
                <div key={item.label} className="border border-border bg-background p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{item.value}</p>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
            >
              <span className="text-foreground/70">{">"} </span>
              {displayText}
              <span className={`ml-1 inline-block h-5 w-[2px] align-middle bg-foreground ${isComplete ? "animate-pulse" : ""}`} />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90"
              >
                Khám phá khóa học
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => router.push("/roadmap")}
                className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <BookOpen className="h-4 w-4" />
                Lộ trình học
              </button>
            </motion.div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Học viên", value: platformStats ? formatStatNumber(platformStats.totalStudents) : loading ? "..." : "—" },
                { label: "Khóa học", value: platformStats ? platformStats.totalCourses.toString() : loading ? "..." : "—" },
                { label: "Đánh giá", value: platformStats ? platformStats.avgRating.toFixed(1) : loading ? "..." : "—" },
              ].map((item) => (
                <div key={item.label} className="border border-border bg-background px-4 py-4">
                  <p className="font-mono text-lg font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative border border-border bg-background p-5 md:p-6"
              ref={searchContainerRef}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Tìm kiếm tri thức</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Khám phá khóa học theo tên, mô tả hoặc giảng viên.</p>
                </div>
                <span className="hidden border border-border px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground md:inline-flex">
                  Nâng cấp mới
                </span>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm khóa học, ngôn ngữ, giảng viên..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0) {
                      router.push(`/courses/${searchResults[0].slug}`);
                      setShowResults(false);
                    } else if (e.key === "Escape") {
                      clearSearch();
                    }
                  }}
                  className="w-full border border-border bg-background py-4 pl-12 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {searchValue ? (
                    <button onClick={clearSearch} className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Xóa tìm kiếm">
                      <X className="h-5 w-5" />
                    </button>
                  ) : (
                    <span className="hidden rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-block">
                      Ctrl + K
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => router.push("/courses")} className="border border-border bg-secondary/30 px-4 py-3 text-left text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                  Xem toàn bộ danh mục
                </button>
                <button onClick={() => router.push("/qa")} className="border border-border bg-secondary/30 px-4 py-3 text-left text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                  Hỏi đáp cộng đồng
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSearchChange(topic)}
                    className="border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {(hasSearchResults || hasNoSearchResults || isFocused) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-[calc(100%-1px)] z-50 overflow-hidden border border-border bg-background"
                  >
                    {hasSearchResults ? (
                      <div className="divide-y divide-border">
                        {searchResults.map((course) => (
                          <button
                            key={course.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              router.push(`/courses/${course.slug}`);
                              setShowResults(false);
                            }}
                            className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary"
                          >
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary">
                              {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">{course.title}</p>
                              <p className="truncate text-xs text-muted-foreground">{course.subtitle}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    ) : hasNoSearchResults ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm font-medium text-foreground">Không tìm thấy kết quả</p>
                        <p className="mt-1 text-xs text-muted-foreground">Thử đổi từ khóa hoặc xem danh mục bên dưới.</p>
                      </div>
                    ) : (
                      <div className="px-4 py-5 text-xs text-muted-foreground">
                        Gõ để tìm nhanh khóa học, mô tả, hoặc giảng viên.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-x border-b border-border md:grid-cols-4">
          {featureItems.map((item) => (
            <div key={item.label} className="border-r border-border px-5 py-5 last:border-r-0 transition-colors hover:bg-secondary/40">
              <item.icon className="mb-3 h-5 w-5 text-foreground" />
              <p className="font-mono text-sm font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
