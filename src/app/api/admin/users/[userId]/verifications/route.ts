import { NextRequest, NextResponse } from "next/server";
import { getAuthPayloadFromRequest } from "@/lib/server-auth";
import {
    getAuthUserById,
    replaceUserVerifications,
} from "@/lib/profile-service";

/**
 * @swagger
 * /api/admin/users/[userId]/verifications:
 *   put:
 *     tags:
 *       - Admin
 *     summary: API endpoint for /api/admin/users/[userId]/verifications
 *     description: Tự động sinh tài liệu cho PUT /api/admin/users/[userId]/verifications. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function PUT(
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
        const body = await request.json();
        const updates = Array.isArray(body.verifications)
            ? body.verifications
            : [];
        const profile = await replaceUserVerifications(
            payload.userId,
            userId,
            updates,
        );

        return NextResponse.json({
            success: true,
            message: "User verifications updated",
            data: profile,
        });
    } catch (error) {
        console.error("Error updating verifications:", error);
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update verifications",
            },
            { status: 400 },
        );
    }
}
