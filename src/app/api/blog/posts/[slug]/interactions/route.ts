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
 * /api/blog/posts/[slug]/interactions:
 *   get:
 *     tags:
 *       - Blog
 *     summary: API endpoint for /api/blog/posts/[slug]/interactions
 *     description: Tự động sinh tài liệu cho GET /api/blog/posts/[slug]/interactions. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        
        // Find post ID
        const { data: post, error: postError } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .single();

        if (postError || !post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        // Fetch counts
        const [{ count: likeCount }, { count: shareCount }, { count: commentCount }] = await Promise.all([
            supabase.from("blog_likes").select("*", { count: "exact", head: true }).eq("post_id", post.id),
            supabase.from("blog_shares").select("*", { count: "exact", head: true }).eq("post_id", post.id),
            supabase.from("blog_comments").select("*", { count: "exact", head: true }).eq("post_id", post.id)
        ]);

        let isLiked = false;
        
        const user = await getAuthUser();
        if (user) {
            const { data: userLike } = await supabase
                .from("blog_likes")
                .select("id")
                .eq("post_id", post.id)
                .eq("user_id", user.id)
                .maybeSingle();
                
            isLiked = !!userLike;
        }

        return NextResponse.json({
            success: true,
            data: {
                likeCount: likeCount || 0,
                shareCount: shareCount || 0,
                commentCount: commentCount || 0,
                isLiked
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
