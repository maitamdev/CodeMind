import { NextResponse } from "next/server";
import { generateCSRFToken, setCSRFCookie } from "@/lib/csrf";

/**
 * GET /api/auth/csrf
 *
 * Returns a fresh CSRF token, also set as a cookie.
 * Client should call this on page load and include
 * the token in the `x-csrf-token` header for mutating requests.
 */
/**
 * @swagger
 * /api/auth/csrf:
 *   get:
 *     tags:
 *       - Auth
 *     summary: API endpoint for /api/auth/csrf
 *     description: Tự động sinh tài liệu cho GET /api/auth/csrf. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET() {
    const token = generateCSRFToken();

    const response = NextResponse.json(
        {
            success: true,
            csrfToken: token,
        },
        { status: 200 },
    );

    return setCSRFCookie(response, token);
}
