import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth-helpers";
import { db as supabaseAdmin } from "@/lib/db";
import {
    recommendSimilarCourses,
    recommendForUser,
} from "@/lib/recommender";

/**
 * GET /api/recommendations/courses
 *
 * Query params:
 *   - courseId   : string  (return courses similar to this course)
 *   - courseSlug : string  (alternative to courseId)
 *   - for        : "me"    (personalized — uses caller's enrollments)
 *   - limit      : number  (1..20, default 6)
 */
/**
 * @swagger
 * /api/recommendations/courses:
 *   get:
 *     tags:
 *       - Recommendations
 *     summary: API endpoint for /api/recommendations/courses
 *     description: Tự động sinh tài liệu cho GET /api/recommendations/courses. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId") ?? undefined;
        const courseSlug = searchParams.get("courseSlug") ?? undefined;
        const forParam = searchParams.get("for");
        const limit = Math.min(
            Math.max(parseInt(searchParams.get("limit") ?? "6", 10) || 6, 1),
            20,
        );

        // Personalized recommendations
        if (forParam === "me") {
            const userId = await getAuthUserId();
            if (!userId) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized" },
                    { status: 401 },
                );
            }

            let enrolledIds: string[] = [];
            if (supabaseAdmin) {
                const { data } = await supabaseAdmin
                    .from("enrollments")
                    .select("course_id")
                    .eq("user_id", userId);
                enrolledIds = (data ?? [])
                    .map((r) => r.course_id as string)
                    .filter(Boolean);
            }

            const items = await recommendForUser({
                enrolledCourseIds: enrolledIds,
                limit,
            });

            return NextResponse.json(
                {
                    success: true,
                    strategy: "content-based:user-centroid",
                    data: items,
                },
                {
                    headers: {
                        "Cache-Control":
                            "private, max-age=120, stale-while-revalidate=300",
                    },
                },
            );
        }

        // Similar-courses recommendation
        if (courseId || courseSlug) {
            const items = await recommendSimilarCourses({
                courseId,
                courseSlug,
                limit,
            });
            return NextResponse.json(
                {
                    success: true,
                    strategy: "content-based:similar",
                    data: items,
                },
                {
                    headers: {
                        "Cache-Control":
                            "public, max-age=300, stale-while-revalidate=600",
                    },
                },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                    "Cần truyền `courseId`, `courseSlug` hoặc `for=me`.",
            },
            { status: 400 },
        );
    } catch (error) {
        console.error("[Recommendations] error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
