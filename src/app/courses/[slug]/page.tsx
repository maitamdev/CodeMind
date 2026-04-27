"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Star,
    Users,
    Clock,
    Award,
    CheckCircle,
    PlayCircle,
    BookOpen,
    Target,
    Zap,
    ArrowRight,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import PageLoading from "@/components/PageLoading";
import RoadmapTreeView, { RoadmapNodeData } from "@/components/RoadmapTreeView";
import CourseRecommendations from "@/components/CourseRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ReactMarkdown from "react-markdown";

interface CourseDetail {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: string;
    priceAmount: number;
    rating: number;
    ratingCount?: number;
    students: number;
    duration: string;
    durationMinutes?: number;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    isPro: boolean;
    isFree: boolean;
    isEnrolled?: boolean;
    totalLessons: number;
    instructor: {
        id?: string;
        name: string;
        avatar: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    thumbnailUrl?: string;
    sections?: {
        id: string;
        title: string;
        order: number;
        lessons: {
            id: string;
            title: string;
            durationMinutes: number;
            isFree: boolean;
            type: string;
            order: number;
        }[];
    }[];
}

const LEVEL_MAP: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
};

/**
 * Chuyển đổi dữ liệu sections/lessons thành cấu trúc RoadmapNodeData
 * để tái sử dụng component RoadmapTreeView có sẵn.
 */
function buildRoadmapFromSections(
    courseTitle: string,
    sections: CourseDetail["sections"]
): RoadmapNodeData {
    const chapters: RoadmapNodeData[] = (sections || []).map((section) => ({
        id: section.id,
        title: section.title,
        description: `Chương này gồm ${section.lessons.length} bài học.`,
        type: "core" as const,
        status: "available" as const,
        duration: `${section.lessons.length} bài`,
        children: section.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.type === "code_exercise" ? "Bài thực hành viết code" : "Bài học lý thuyết",
            type: lesson.type === "code_exercise" ? ("project" as const) : ("beginner" as const),
            status: "available" as const,
        })),
    }));

    return {
        id: "root",
        title: courseTitle,
        description: "Lộ trình học tập toàn bộ khóa học",
        type: "core",
        status: "available",
        children: chapters,
    };
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const toaster = useToast();
    const slug = params?.slug as string;

    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetchCourseDetail();
    }, [slug, user]);

    const fetchCourseDetail = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/courses/${slug}`, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success && data.data) {
                setCourse(data.data);
            } else {
                toaster.error("Không tìm thấy khóa học!");
                router.push("/courses");
            }
        } catch (error) {
            console.error("Fetch course error:", error);
            toaster.error("Lỗi tải thông tin khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            toaster.warning("Vui lòng đăng nhập để tham gia khóa học");
            router.push("/login?redirect=/courses/" + slug);
            return;
        }

        if (course?.isEnrolled) {
            router.push(`/learn/${slug}`);
            return;
        }

        if (!course?.isFree) {
            toaster.info("Tính năng thanh toán đang được phát triển!");
            return;
        }

        setIsEnrolling(true);
        try {
            const { secureFetch } = await import("@/contexts/AuthContext");
            const res = await secureFetch(`/api/courses/${slug}/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                toaster.success("Đăng ký thành công! Bắt đầu học thôi.");
                router.push(`/learn/${slug}`);
            } else {
                toaster.error(data.message || "Lỗi khi đăng ký");
            }
        } catch (error) {
            console.error("Enroll error:", error);
            toaster.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsEnrolling(false);
        }
    };

    // Chuyển sections thành tree data cho RoadmapTreeView
    const roadmapData = useMemo(() => {
        if (!course) return null;
        return buildRoadmapFromSections(course.title, course.sections);
    }, [course]);

    if (isLoading) return <PageLoading />;
    if (!course) return null;

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            {/* ══════════════════════════════════════
                HERO SECTION - BOXY STYLE
               ══════════════════════════════════════ */}
            <div className="bg-indigo-600 text-white border-b-4 border-black">
                <PageContainer className="py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-bold border-2 border-black border-b-[3px]">
                                    {course.category?.name || "Lập trình"}
                                </span>
                                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold border-2 border-black border-b-[3px]">
                                    {LEVEL_MAP[course.level] || course.level}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-md">
                                {course.title}
                            </h1>
                            <p className="text-lg md:text-xl text-indigo-100 font-medium">
                                {course.shortDescription || course.description?.slice(0, 120)}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span>
                                        {course.rating} ({course.ratingCount || 0} đánh giá)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                    <span>{(course.students || 0).toLocaleString()} học viên</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-pink-400" />
                                    <span>{course.totalLessons || 0} bài học</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="bg-white text-black border-4 border-black border-b-8 rounded-2xl p-6 lg:p-8 transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                            <div className="aspect-video relative rounded-xl overflow-hidden border-2 border-black mb-6 bg-gray-100">
                                {course.thumbnailUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <PlayCircle className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    {course.isFree ? (
                                        <span className="text-3xl font-black text-green-600">
                                            Miễn phí
                                        </span>
                                    ) : (
                                        <span className="text-3xl font-black">{course.price}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg rounded-xl border-2 border-black border-b-4 hover:translate-y-[2px] hover:border-b-2 transition-all flex items-center justify-center gap-2"
                            >
                                {isEnrolling
                                    ? "Đang xử lý..."
                                    : course.isEnrolled
                                      ? "Vào học ngay"
                                      : "Đăng ký khóa học"}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </PageContainer>
            </div>

            <PageContainer className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-12">
                        {/* ══════════════════════════════════════
                            DESCRIPTION
                           ══════════════════════════════════════ */}
                        <section className="bg-white border-2 border-black border-b-8 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <Target className="w-6 h-6 text-indigo-500" /> Về khóa học
                                này
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <ReactMarkdown>
                                    {course.description ||
                                        "Chưa có mô tả chi tiết."}
                                </ReactMarkdown>
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-black border-b-8 rounded-2xl p-6 sticky top-24">
                            <h3 className="font-black text-xl mb-4">
                                Thông tin thêm
                            </h3>
                            <ul className="space-y-4 font-medium text-gray-700">
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 border-2 border-black flex items-center justify-center text-indigo-600 shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span>
                                        Thời lượng:{" "}
                                        <strong>
                                            {Math.round(
                                                (course.durationMinutes || 0) /
                                                    60,
                                            ) || 20}{" "}
                                            giờ
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 border-2 border-black flex items-center justify-center text-emerald-600 shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span>Học mọi lúc mọi nơi</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-100 border-2 border-black flex items-center justify-center text-yellow-600 shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <span>Cấp chứng chỉ hoàn thành</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pink-100 border-2 border-black flex items-center justify-center text-pink-600 shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <span>Sở hữu khóa học trọn đời</span>
                                </li>
                            </ul>

                            <hr className="my-6 border-black" />

                            <h3 className="font-black text-lg mb-4">
                                Giảng viên
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-indigo-200 flex items-center justify-center font-black text-xl text-indigo-600">
                                    {(course.instructor?.name || "C")[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">
                                        {course.instructor?.name ||
                                            "CodeMind Team"}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Chuyên gia lập trình
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>

            {/* ══════════════════════════════════════════════════════
                LỘ TRÌNH HỌC TẬP — RoadmapTreeView
                Tái sử dụng 100% component RoadmapTreeView hiện có
               ══════════════════════════════════════════════════════ */}
            {roadmapData && roadmapData.children && roadmapData.children.length > 0 && (
                <section className="mt-4">
                    <RoadmapTreeView
                        roadmapId={`course-${course.slug}`}
                        roadmapTitle={`Lộ trình: ${course.title}`}
                        roadmapData={roadmapData}
                    />
                </section>
            )}

            {/* Content-based recommendations */}
            <PageContainer>
                <div className="mt-12">
                    <CourseRecommendations
                        source={{ mode: "similar", courseId: course.id, courseSlug: course.slug }}
                        limit={6}
                    />
                </div>
            </PageContainer>
        </div>
    );
}
