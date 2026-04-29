import { NextRequest, NextResponse } from "next/server";
import { getAuthPayloadFromRequest } from "@/lib/server-auth";
import {
    getAuthUserById,
    rejectProfessionalProfile,
} from "@/lib/profile-service";

/**
 * @swagger
 * /api/admin/profile-reviews/[userId]/reject:
 *   post:
 *     tags:
 *       - Admin
 *     summary: API endpoint for /api/admin/profile-reviews/[userId]/reject
 *     description: Tự động sinh tài liệu cho POST /api/admin/profile-reviews/[userId]/reject. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> },
) {
    try {
        const payload = getAuthPayloadFromRequest(request);

        if (!payload) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const authUser = await getAuthUserById(payload.userId);
        if (!authUser?.roles.includes("admin")) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 },
            );
        }

        const { userId } = await params;
        const body = await request.json().catch(() => ({}));
        const profile = await rejectProfessionalProfile(
            payload.userId,
            userId,
            body.reviewNotes,
        );

        return NextResponse.json({
            success: true,
            message: "Professional profile rejected",
            data: profile,
        });
    } catch (error) {
        console.error("Error rejecting professional profile:", error);
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to reject professional profile",
            },
            { status: 400 },
        );
    }
}
