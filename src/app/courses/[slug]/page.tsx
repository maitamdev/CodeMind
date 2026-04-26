"use client";

import { useEffect, useState } from "react";
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
    Code2,
    ChevronRight,
    ArrowRight,
    Play,
    Check,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageContainer from "@/components/PageContainer";
import PageLoading from "@/components/PageLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ReactMarkdown from "react-markdown";
import CourseReviews from "@/components/CourseReviews";

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
                credentials: 'include'
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

    if (isLoading) return <PageLoading />;
    if (!course) return null;

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            {/* HERO SECTION - BOXY STYLE */}
            <div className="bg-indigo-600 text-white border-b-4 border-black">
                <PageContainer className="py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-bold border-2 border-black border-b-[3px]">
                                    {course.category.name}
                                </span>
                                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold border-2 border-black border-b-[3px]">
                                    {LEVEL_MAP[course.level] || course.level}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-md">
                                {course.title}
                            </h1>
                            <p className="text-lg md:text-xl text-indigo-100 font-medium">
                                {course.shortDescription}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span>{course.rating} ({course.ratingCount || 0} đánh giá)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                    <span>{course.students.toLocaleString()} học viên</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-pink-400" />
                                    <span>{course.totalLessons} bài học</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="bg-white text-black border-4 border-black border-b-8 rounded-2xl p-6 lg:p-8 transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                            <div className="aspect-video relative rounded-xl overflow-hidden border-2 border-black mb-6 bg-gray-100">
                                {course.thumbnailUrl ? (
                                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <PlayCircle className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    {course.isFree ? (
                                        <span className="text-3xl font-black text-green-600">Miễn phí</span>
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
                                {isEnrolling ? "Đang xử lý..." : course.isEnrolled ? "Vào học ngay" : "Đăng ký khóa học"}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </PageContainer>
            </div>

            <PageContainer className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-12">
                        {/* DESCRIPTION */}
                        <section className="bg-white border-2 border-black border-b-8 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <Target className="w-6 h-6 text-indigo-500" /> Về khóa học này
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <ReactMarkdown>{course.description || "Chưa có mô tả chi tiết."}</ReactMarkdown>
                            </div>
                        </section>

                        {/* ROADMAP / CURRICULUM */}
                        <section>
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
                                <GraduationCap className="w-7 h-7 text-indigo-500" /> Lộ trình học tập
                            </h2>
                            
                            <div className="relative border-l-4 border-black ml-4 md:ml-8 space-y-10 py-4">
                                {course.sections?.map((section, idx) => (
                                    <div key={section.id} className="relative pl-8 md:pl-12">
                                        {/* Chapter Node Marker */}
                                        <div className="absolute -left-[22px] top-0 w-10 h-10 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center font-black z-10">
                                            {idx + 1}
                                        </div>

                                        {/* Chapter Card */}
                                        <div className="bg-indigo-50 border-2 border-black border-b-4 rounded-xl p-5 mb-4">
                                            <h3 className="text-xl font-bold">{section.title}</h3>
                                            <p className="text-sm text-gray-600 font-medium mt-1">
                                                {section.lessons.length} bài học
                                            </p>
                                        </div>

                                        {/* Lessons List */}
                                        <div className="space-y-3">
                                            {section.lessons.map((lesson, lIdx) => (
                                                <div key={lesson.id} className="bg-white border-2 border-black border-b-4 rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-black flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                                                        {lIdx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                                                    </div>
                                                    {lesson.isFree && (
                                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 border border-green-300 rounded-md">
                                                            Học thử
                                                        </span>
                                                    )}
                                                    <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                {(!course.sections || course.sections.length === 0) && (
                                    <div className="pl-8 text-gray-500 italic font-medium">
                                        Nội dung khóa học đang được cập nhật...
                                    </div>
                                )}
                            </div>
                        </section>
                        
                        {/* REVIEWS */}
                        <section className="bg-white border-2 border-black border-b-8 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-500" /> Đánh giá từ học viên
                            </h2>
                            <CourseReviews
                                courseSlug={slug}
                                courseRating={course.rating}
                                ratingCount={course.ratingCount || 0}
                                isEnrolled={!!course.isEnrolled}
                                readOnly={true}
                            />
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-black border-b-8 rounded-2xl p-6 sticky top-24">
                            <h3 className="font-black text-xl mb-4">Thông tin thêm</h3>
                            <ul className="space-y-4 font-medium text-gray-700">
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 border-2 border-black flex items-center justify-center text-indigo-600 shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span>Thời lượng ước tính: <strong>{Math.round((course.durationMinutes || 0) / 60) || 10} giờ</strong></span>
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
                            
                            <h3 className="font-black text-lg mb-4">Giảng viên</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden relative">
                                    {course.instructor?.avatar ? (
                                        <Image src={course.instructor.avatar} alt="Instructor" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{course.instructor?.name || "CodeMind Team"}</h4>
                                    <p className="text-sm text-gray-500 font-medium">Chuyên gia lập trình</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}
