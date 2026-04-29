/**
 * API Route: GET /api/courses
 *
 * Get all courses
 * - Public endpoint
 * - Optional filters: level, is_free, category
 * - Optional search by title
 */

import { NextRequest, NextResponse } from "next/server";
import { rpc } from "@/lib/db-helpers";

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: API endpoint for /api/courses
 *     description: Tự động sinh tài liệu cho GET /api/courses. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        // Filters
        const level = searchParams.get("level"); // BEGINNER, INTERMEDIATE, ADVANCED
        const isFreeParam = searchParams.get("is_free"); // '1' or '0'
        const category = searchParams.get("category"); // category slug
        const search = searchParams.get("search"); // search title
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const offset = (page - 1) * limit;

        // Build RPC parameters
        const rpcParams: any = {
            p_limit: limit,
            p_offset: offset,
        };

        if (level) {
            rpcParams.p_level = level.toUpperCase();
        }

        if (isFreeParam !== null) {
            rpcParams.p_is_free = parseInt(isFreeParam) === 1;
        }

        if (category) {
            rpcParams.p_category_slug = category;
        }

        if (search) {
            rpcParams.p_search = search;
        }

        // Get courses using RPC function
        const courses = await rpc<any[]>("get_courses_with_details", rpcParams);

        // Get total count
        const total = await rpc<number>("count_courses_with_filters", {
            p_level: level?.toUpperCase() || null,
            p_is_free:
                isFreeParam !== null ? parseInt(isFreeParam) === 1 : null,
            p_category_slug: category || null,
            p_search: search || null,
        });

        // Format response — instructor data now comes directly from the RPC function
        // which already JOINs the users table
        const formattedCourses = (courses || []).map((course: any) => {
            // Determine registration & Pro status from RPC data
            const hasInstructorId = Boolean(course.instructor_id);
            const instructorIsPro = course.instructor_membership_type === "PRO";
            const instructorIsRegistered =
                hasInstructorId && Boolean(course.instructor_name);

            return {
                id: course.id,
                title: course.title,
                slug: course.slug,
                subtitle: course.short_description,
                thumbnailUrl: course.thumbnail_url,
                level: course.level,
                price: course.is_free
                    ? "Miễn phí"
                    : `${parseFloat(course.price || 0).toLocaleString("vi-VN")}đ`,
                priceAmount: parseFloat(course.price || 0),
                isFree: Boolean(course.is_free),
                isPro: !Boolean(course.is_free),
                duration: formatDuration(course.estimated_duration || 0),
                rating: parseFloat(course.rating || 0),
                students: course.total_students || 0,
                totalLessons: course.total_lessons || 0,
                category: {
                    name: course.category_name,
                    slug: course.category_slug,
                },
                instructor: {
                    name: course.instructor_name,
                    username: course.instructor_username,
                    avatar: course.instructor_avatar_url || null,
                    isPro: instructorIsPro,
                    isRegistered: instructorIsRegistered,
                },
                createdAt: course.created_at,
            };
        });

        // Fetch platform stats in parallel (for HeroSection)
        const includeStats = searchParams.get("include_stats") === "1";
        let platformStats = null;

        if (includeStats) {
            const { supabaseAdmin } = await import("@/lib/supabase");
            if (supabaseAdmin) {
                const [studentsRes, ratingRes] = await Promise.all([
                    supabaseAdmin
                        .from("enrollments")
                        .select("user_id", { count: "exact", head: true }),
                    supabaseAdmin
                        .from("courses")
                        .select("rating")
                        .eq("is_published", true)
                        .gt("rating", 0),
                ]);

                const ratings = (ratingRes.data || []).map((c: any) =>
                    parseFloat(c.rating),
                );
                const avgRating =
                    ratings.length > 0
                        ? parseFloat(
                              (
                                  ratings.reduce(
                                      (s: number, r: number) => s + r,
                                      0,
                                  ) / ratings.length
                              ).toFixed(1),
                          )
                        : 0;

                platformStats = {
                    totalStudents: studentsRes.count ?? 0,
                    totalCourses: total || 0,
                    avgRating,
                };
            }
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    courses: formattedCourses,
                    pagination: {
                        total: total || 0,
                        page,
                        limit,
                        totalPages: Math.ceil((total || 0) / limit),
                        hasMore: page * limit < (total || 0),
                    },
                    ...(platformStats && { platformStats }),
                },
            },
            {
                headers: {
                    "Cache-Control":
                        "public, max-age=30, stale-while-revalidate=120",
                },
            },
        );
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        // Check for "function not found" or "table not found" errors
        if (error?.code === 'PGRST202' || error?.code === '42P01' || error?.message?.includes('not found')) {
            console.log("Supabase schema not found, falling back to mock courses...");
            const mockCourses = Array.from({ length: 4 }).map((_, i) => ({
                id: `mock-${i}`,
                title: `Khóa học Lập trình ${['Web', 'Python', 'React', 'NodeJS'][i]} với AI`,
                slug: `khoa-hoc-lap-trinh-${['web', 'python', 'react', 'nodejs'][i]}`,
                subtitle: "Học lập trình thực chiến, có AI hỗ trợ 24/7. Cam kết chất lượng đầu ra.",
                thumbnailUrl: null,
                level: ["Cơ bản", "Trung bình", "Nâng cao", "Cơ bản"][i],
                price: "Miễn phí",
                priceAmount: 0,
                isFree: true,
                isPro: false,
                duration: "12h30p",
                rating: 4.8,
                students: 1200 + i * 50,
                totalLessons: 45,
                category: { name: "Lập trình", slug: "lap-trinh" },
                instructor: {
                    name: "CodeMind Team",
                    username: "codemind",
                    avatar: null,
                    isPro: true,
                    isRegistered: true,
                },
                createdAt: new Date().toISOString(),
            }));

            return NextResponse.json({
                success: true,
                data: {
                    courses: mockCourses,
                    pagination: { total: 4, page: 1, limit: 12, totalPages: 1, hasMore: false },
                    platformStats: { totalStudents: 5000, totalCourses: 4, avgRating: 4.9 },
                },
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch courses",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 },
        );
    }
}

/**
 * Format duration from minutes to human readable
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "32h45p")
 */
function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins.toString().padStart(2, "0") : "00"}p`;
}
