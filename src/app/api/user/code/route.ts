import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const { user, error: authError } = await checkAuth(request);
        
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const lessonId = url.searchParams.get("lessonId");

        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin!
            .from("user_code_snippets")
            .select("html, css, javascript, cpp")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();

        if (error && error.code !== "PGRST116") { // Ignore 'no rows found' error
            throw error;
        }

        return NextResponse.json({ data: data || null });
    } catch (error) {
        console.error("Error fetching user code:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user, error: authError } = await checkAuth(request);
        
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { lessonId, html, css, javascript, cpp } = body;

        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin!
            .from("user_code_snippets")
            .upsert({
                user_id: user.id,
                lesson_id: lessonId,
                html: html || "",
                css: css || "",
                javascript: javascript || "",
                cpp: cpp || "",
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, lesson_id"
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ data, success: true });
    } catch (error) {
        console.error("Error saving user code:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
