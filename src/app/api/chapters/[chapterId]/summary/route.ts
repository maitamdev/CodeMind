import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";

/**
 * @swagger
 * /api/chapters/[chapterId]/summary:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: API endpoint for /api/chapters/[chapterId]/summary
 *     description: Tự động sinh tài liệu cho GET /api/chapters/[chapterId]/summary. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chapterId: string }> },
) {
    try {
        const { chapterId } = await params;

        const { data, error } = await supabaseAdmin!
            .from("chapter_summaries")
            .select("id, content, created_at, updated_at")
            .eq("chapter_id", chapterId)
            .single();

        if (error || !data) {
            return NextResponse.json({
                success: true,
                data: null,
            });
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching chapter summary:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
