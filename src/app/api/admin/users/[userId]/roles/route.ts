import { NextRequest, NextResponse } from "next/server";
import { getAuthPayloadFromRequest } from "@/lib/server-auth";
import { getAuthUserById, replaceUserRoles } from "@/lib/profile-service";
import type { AppRole } from "@/types/profile";

/**
 * @swagger
 * /api/admin/users/[userId]/roles:
 *   put:
 *     tags:
 *       - Admin
 *     summary: API endpoint for /api/admin/users/[userId]/roles
 *     description: Tự động sinh tài liệu cho PUT /api/admin/users/[userId]/roles. Hãy cập nhật mô tả chi tiết sau.
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
        const roles = Array.isArray(body.roles) ? (body.roles as AppRole[]) : [];
        const profile = await replaceUserRoles(payload.userId, userId, roles);

        return NextResponse.json({
            success: true,
            message: "User roles updated",
            data: profile,
        });
    } catch (error) {
        console.error("Error updating roles:", error);
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update user roles",
            },
            { status: 400 },
        );
    }
}
