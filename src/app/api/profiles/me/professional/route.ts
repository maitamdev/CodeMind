import { NextRequest, NextResponse } from "next/server";
import { getAuthPayloadFromRequest } from "@/lib/server-auth";
import {
    getProfileEditorByUserId,
    upsertProfessionalProfileDraft,
} from "@/lib/profile-service";

/**
 * @swagger
 * /api/profiles/me/professional:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: API endpoint for /api/profiles/me/professional
 *     description: Tự động sinh tài liệu cho GET /api/profiles/me/professional. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(request: NextRequest) {
    try {
        const payload = getAuthPayloadFromRequest(request);

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const profile = await getProfileEditorByUserId(
            payload.userId,
            payload.userId,
        );

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Error loading professional profile editor:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to load professional profile",
            },
            { status: 500 },
        );
    }
}

/**
 * @swagger
 * /api/profiles/me/professional:
 *   put:
 *     tags:
 *       - Profiles
 *     summary: API endpoint for /api/profiles/me/professional
 *     description: Tự động sinh tài liệu cho PUT /api/profiles/me/professional. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function PUT(request: NextRequest) {
    try {
        const payload = getAuthPayloadFromRequest(request);

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const body = await request.json();
        const profile = await upsertProfessionalProfileDraft(
            payload.userId,
            body,
        );

        return NextResponse.json({
            success: true,
            message: "Professional profile draft saved",
            data: profile,
        });
    } catch (error) {
        console.error("Error saving professional profile draft:", error);
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to save professional profile draft",
            },
            { status: 500 },
        );
    }
}
