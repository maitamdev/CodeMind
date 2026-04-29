import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuthUserId } from "@/lib/auth-helpers";

/**
 * @swagger
 * /api/user/code:
 *   get:
 *     tags:
 *       - User
 *     summary: API endpoint for /api/user/code
 *     description: Tự động sinh tài liệu cho GET /api/user/code. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(request: NextRequest) {
    try {
        const userId = await getAuthUserId();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const lessonId = url.searchParams.get("lessonId");
        const slug = url.searchParams.get("slug") || lessonId || "scratch";

        const { data, error } = await supabaseAdmin!
            .from("user_projects")
            .select("*")
            .eq("user_id", userId)
            .eq("slug", slug)
            .single();

        if (error && error.code !== "PGRST116") { 
            throw error;
        }

        return NextResponse.json({ data: data || null });
    } catch (error) {
        console.error("Error fetching user project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/user/code:
 *   post:
 *     tags:
 *       - User
 *     summary: API endpoint for /api/user/code
 *     description: Tự động sinh tài liệu cho POST /api/user/code. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await getAuthUserId();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        
        const { lessonId, html, css, javascript, cpp, action, message, isPublic, projectName } = body || {};
        const slug = lessonId || "scratch";
        const name = projectName || (lessonId ? `Lesson ${lessonId}` : "Scratchpad");

        // First, check if project exists to get current commits
        const { data: existingProject, error: fetchError } = await supabaseAdmin!
            .from("user_projects")
            .select("commits")
            .eq("user_id", userId)
            .eq("slug", slug)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError;
        }

        let commits = existingProject?.commits || [];

        // If action is commit, add a new commit
        if (action === "commit") {
            commits.push({
                id: Math.random().toString(36).substring(2, 9),
                message: message || "Update code",
                timestamp: new Date().toISOString(),
                stats: {
                    html: html?.length || 0,
                    css: css?.length || 0,
                    js: javascript?.length || 0,
                }
            });
        }

        const updateData: any = {
            user_id: userId,
            slug: slug,
            name: name,
            lesson_id: lessonId || null,
            html: html || "",
            css: css || "",
            javascript: javascript || "",
            cpp: cpp || "",
            commits: commits,
            updated_at: new Date().toISOString()
        };

        if (action === "publish" || isPublic !== undefined) {
            updateData.is_public = true;
        }

        const { data, error } = await supabaseAdmin!
            .from("user_projects")
            .upsert(updateData, { onConflict: "user_id, slug" })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data, success: true });
    } catch (error) {
        console.error("Error saving user project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
