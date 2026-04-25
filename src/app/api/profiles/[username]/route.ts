import { NextRequest, NextResponse } from "next/server";
import { getPublicProfileByUsername } from "@/lib/profile-service";
import { normalizeUsername } from "@/lib/profile-url";

export const dynamic = "force-dynamic";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ username: string }> },
) {
    try {
        const { username } = await params;
        const normalizedUsername = normalizeUsername(username);
        const profile = await getPublicProfileByUsername(normalizedUsername);

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User profile not found",
                },
                { status: 404 },
            );
        }

        // Fetch public projects (code snippets)
        const { supabaseAdmin } = await import("@/lib/supabase");
        const { data: projects } = await supabaseAdmin!
            .from("user_projects")
            .select("id, name, slug, description, html, css, javascript, commits, updated_at")
            .eq("user_id", profile.user.id)
            .eq("is_public", true)
            .order("updated_at", { ascending: false });

        // Fetch published articles
        const { data: articles } = await supabaseAdmin!
            .from("blog_posts")
            .select("id, title, slug, excerpt, cover_image, published_at, view_count")
            .eq("user_id", profile.user.id)
            .eq("status", "published")
            .order("published_at", { ascending: false });

        // Fetch shared articles
        const { data: shared } = await supabaseAdmin!
            .from("blog_shares")
            .select(`
                id,
                created_at,
                blog_posts (
                    id, title, slug, excerpt, cover_image, published_at, view_count,
                    users (id, full_name, username, avatar_url)
                )
            `)
            .eq("user_id", profile.user.id)
            .order("created_at", { ascending: false });

        // Format shared articles
        const sharedArticles = shared?.map(s => s.blog_posts).filter(Boolean) || [];

        return NextResponse.json({
            success: true,
            data: {
                ...profile,
                projects: projects || [],
                articles: articles || [],
                sharedArticles: sharedArticles,
            },
        });
    } catch (error) {
        console.error("Error loading public profile:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to load public profile",
            },
            { status: 500 },
        );
    }
}
