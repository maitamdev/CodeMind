import { NextResponse } from "next/server";
import { getAuthUserById } from "@/lib/profile-service";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "codemind-secret-key-2024";

async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            role: string;
        };
        return await getAuthUserById(decoded.userId);
    } catch {
        return null;
    }
}

/**
 * @swagger
 * /api/blog/posts/[slug]/share:
 *   post:
 *     tags:
 *       - Blog
 *     summary: API endpoint for /api/blog/posts/[slug]/share
 *     description: Tự động sinh tài liệu cho POST /api/blog/posts/[slug]/share. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json().catch(() => ({}));
        const platform = body.platform || 'copy';

        // Find post ID
        const { data: post, error: postError } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .single();

        if (postError || !post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        await supabase.from("blog_shares").insert({
            post_id: post.id,
            user_id: user.id,
            platform
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
