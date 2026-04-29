import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth-helpers";
import { db as supabaseAdmin } from "@/lib/db";
import { buildCertificateCode, getCertificateVerifyUrl } from "@/lib/certificate";

interface IssueBody {
    courseId?: string;
    courseSlug?: string;
}

/**
 * POST /api/certificates/issue
 * Body: { courseId?: string; courseSlug?: string }
 *
 * Issues a deterministic certificate code for the current user + course.
 * Requires:
 *   - Authenticated user
 *   - An active enrollment for that course
 *   - All lessons in the course marked complete
 */
/**
 * @swagger
 * /api/certificates/issue:
 *   post:
 *     tags:
 *       - Certificates
 *     summary: API endpoint for /api/certificates/issue
 *     description: Tự động sinh tài liệu cho POST /api/certificates/issue. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await getAuthUserId();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { success: false, message: "Database not available" },
                { status: 503 },
            );
        }

        const body = (await request.json().catch(() => ({}))) as IssueBody;
        let courseId = body.courseId;

        if (!courseId && body.courseSlug) {
            const { data: courseRow } = await supabaseAdmin
                .from("courses")
                .select("id")
                .eq("slug", body.courseSlug)
                .maybeSingle();
            if (courseRow?.id) courseId = courseRow.id as string;
        }

        if (!courseId) {
            return NextResponse.json(
                { success: false, message: "courseId hoặc courseSlug là bắt buộc" },
                { status: 400 },
            );
        }

        // 1) Enrollment must exist
        const { data: enrollment } = await supabaseAdmin
            .from("enrollments")
            .select("id, completed_at")
            .eq("user_id", userId)
            .eq("course_id", courseId)
            .maybeSingle();

        if (!enrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bạn chưa ghi danh khóa học này.",
                },
                { status: 403 },
            );
        }

        // 2) All lessons completed
        const { data: chapters } = await supabaseAdmin
            .from("chapters")
            .select("id")
            .eq("course_id", courseId);

        const chapterIds = (chapters ?? []).map((c) => c.id as string);

        let lessonIds: string[] = [];
        if (chapterIds.length > 0) {
            const { data: lessons } = await supabaseAdmin
                .from("lessons")
                .select("id")
                .in("chapter_id", chapterIds);
            lessonIds = (lessons ?? []).map((l) => l.id as string);
        }

        const totalLessons = lessonIds.length;
        let completedCount = 0;

        if (totalLessons > 0) {
            const { data: progressRows } = await supabaseAdmin
                .from("lesson_progress")
                .select("lesson_id, is_completed")
                .eq("user_id", userId)
                .in("lesson_id", lessonIds);

            completedCount = (progressRows ?? []).filter(
                (p) => p.is_completed === true,
            ).length;
        }

        const isFinished =
            (totalLessons > 0 && completedCount >= totalLessons) ||
            !!enrollment.completed_at;

        if (!isFinished) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Bạn cần hoàn thành tất cả bài học trước khi nhận chứng chỉ.",
                    data: { completedCount, totalLessons },
                },
                { status: 409 },
            );
        }

        // 3) Mark enrollment as completed if not yet
        if (!enrollment.completed_at) {
            await supabaseAdmin
                .from("enrollments")
                .update({ completed_at: new Date().toISOString() })
                .eq("id", enrollment.id);
        }

        const code = buildCertificateCode({ userId, courseId });

        const baseUrl =
            request.headers.get("x-forwarded-host") ??
            request.headers.get("host") ??
            null;
        const protocol = (
            request.headers.get("x-forwarded-proto") ?? "https"
        ).split(",")[0];
        const fullBase =
            baseUrl ? `${protocol}://${baseUrl}` : undefined;

        const verifyUrl = getCertificateVerifyUrl(code, fullBase);

        return NextResponse.json({
            success: true,
            data: { code, verifyUrl },
        });
    } catch (error) {
        console.error("[Certificates issue] error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
