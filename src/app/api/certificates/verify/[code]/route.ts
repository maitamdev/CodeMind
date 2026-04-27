import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { parseCertificateCode } from "@/lib/certificate";

/**
 * GET /api/certificates/verify/[code]
 *
 * Public endpoint — anyone with the certificate code can verify it.
 * Returns 200 with `valid: true` and the rendering payload if the
 * code's HMAC signature is valid AND the user truly has an enrollment
 * (preferably with `completed_at`) for that course.
 *
 * Returns 200 with `valid: false` for any tampered / unknown code.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ code: string }> },
) {
    try {
        const { code } = await params;
        const decoded = parseCertificateCode(code);

        if (!decoded) {
            return NextResponse.json({
                success: true,
                data: { valid: false, reason: "INVALID_SIGNATURE" },
            });
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { success: false, message: "Database not available" },
                { status: 503 },
            );
        }

        const { userId, courseId } = decoded;

        const [enrollmentRes, userRes, courseRes] = await Promise.all([
            supabaseAdmin
                .from("enrollments")
                .select("id, enrolled_at, completed_at")
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .maybeSingle(),
            supabaseAdmin
                .from("users")
                .select("id, username, full_name, avatar_url")
                .eq("id", userId)
                .maybeSingle(),
            supabaseAdmin
                .from("courses")
                .select(
                    "id, title, slug, estimated_duration, instructor_id",
                )
                .eq("id", courseId)
                .maybeSingle(),
        ]);

        const enrollment = enrollmentRes.data;
        const user = userRes.data;
        const course = courseRes.data;

        if (!enrollment || !user || !course) {
            return NextResponse.json({
                success: true,
                data: { valid: false, reason: "NOT_FOUND" },
            });
        }

        // Resolve instructor name
        let instructorName: string | null = null;
        if (course.instructor_id) {
            const { data: instructor } = await supabaseAdmin
                .from("users")
                .select("full_name, username")
                .eq("id", course.instructor_id as string)
                .maybeSingle();
            instructorName =
                (instructor?.full_name as string | null) ??
                (instructor?.username as string | null) ??
                null;
        }

        const completedAt =
            (enrollment.completed_at as string | null) ??
            (enrollment.enrolled_at as string | null) ??
            null;

        return NextResponse.json(
            {
                success: true,
                data: {
                    valid: true,
                    code,
                    student: {
                        id: user.id,
                        fullName:
                            (user.full_name as string | null) ??
                            (user.username as string | null) ??
                            "Học viên",
                        username: user.username as string | null,
                        avatarUrl: user.avatar_url as string | null,
                    },
                    course: {
                        id: course.id,
                        slug: course.slug,
                        title: course.title,
                        durationMinutes:
                            (course.estimated_duration as number | null) ??
                            null,
                        instructorName,
                    },
                    completedAt,
                    isCompleted: !!enrollment.completed_at,
                },
            },
            {
                headers: {
                    "Cache-Control":
                        "public, max-age=120, stale-while-revalidate=600",
                },
            },
        );
    } catch (error) {
        console.error("[Certificates verify] error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
