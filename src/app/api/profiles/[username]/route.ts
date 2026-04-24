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

        return NextResponse.json({
            success: true,
            data: {
                ...profile,
                projects: projects || [],
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
