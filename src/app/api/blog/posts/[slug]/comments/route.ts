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
 * /api/blog/posts/[slug]/comments:
 *   get:
 *     tags:
 *       - Blog
 *     summary: API endpoint for /api/blog/posts/[slug]/comments
 *     description: Tự động sinh tài liệu cho GET /api/blog/posts/[slug]/comments. Hãy cập nhật mô tả chi tiết sau.
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

        const { data: comments, error } = await supabase
            .from("blog_comments")
            .select(`
                id,
                content,
                created_at,
                users (
                    id,
                    username,
                    full_name,
                    avatar_url
                )
            `)
            .eq("post_id", post.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: comments.map(c => ({
                id: c.id,
                content: c.content,
                createdAt: c.created_at,
                author: {
                    id: (c.users as any)?.id,
                    username: (c.users as any)?.username,
                    full_name: (c.users as any)?.full_name,
                    avatar_url: (c.users as any)?.avatar_url,
                }
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/blog/posts/[slug]/comments:
 *   post:
 *     tags:
 *       - Blog
 *     summary: API endpoint for /api/blog/posts/[slug]/comments
 *     description: Tự động sinh tài liệu cho POST /api/blog/posts/[slug]/comments. Hãy cập nhật mô tả chi tiết sau.
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
        const body = await request.json();
        
        if (!body.content || !body.content.trim()) {
            return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });
        }

        // Find post ID
        const { data: post, error: postError } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .single();

        if (postError || !post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        const { data: comment, error } = await supabase
            .from("blog_comments")
            .insert({
                post_id: post.id,
                user_id: user.id,
                content: body.content.trim()
            })
            .select(`
                id,
                content,
                created_at,
                users (
                    id,
                    username,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                author: {
                    id: (comment.users as any)?.id,
                    username: (comment.users as any)?.username,
                    full_name: (comment.users as any)?.full_name,
                    avatar_url: (comment.users as any)?.avatar_url,
                }
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
