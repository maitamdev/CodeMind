import { NextRequest, NextResponse } from "next/server";
import { getLegacyProfileByUsername } from "@/lib/profile-service";

/**
 * @swagger
 * /api/users/[username]:
 *   get:
 *     tags:
 *       - Users
 *     summary: API endpoint for /api/users/[username]
 *     description: Tự động sinh tài liệu cho GET /api/users/[username]. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ username: string }> },
) {
    try {
        const { username } = await params;
        const profile = await getLegacyProfileByUsername(username);

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to load user profile",
            },
            { status: 500 },
        );
    }
}
