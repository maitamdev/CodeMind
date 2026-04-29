import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
    buildRoadmapGenerationDirectives,
    normalizeGenerationPreferences,
    toGenerationDirectivesRequest,
    toGenerationPreferencesRequest,
} from "@/lib/ai-roadmap-generation";
import { generateRoadmapWithGroq } from "@/lib/groq-roadmap-service";
import type { UserProfile } from "@/types/ai-roadmap";

interface GenerateRequest {
    profile: UserProfile;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate user
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized - No token" },
                { status: 401 },
            );
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized - Invalid token" },
                { status: 401 },
            );
        }

        const userId = payload.userId;

        // 2. Parse request body
        const body: GenerateRequest = await request.json();
        const { profile } = body;

        if (!profile) {
            return NextResponse.json(
                { success: false, error: "Profile is required" },
                { status: 400 },
            );
        }

        const generationPreferences = normalizeGenerationPreferences(
            profile.generationPreferences,
        );
        const generationDirectives = buildRoadmapGenerationDirectives({
            hoursPerWeek: profile.hoursPerWeek,
            targetMonths: profile.targetMonths,
            generationPreferences,
        });
        const generationPreferencesRequest =
            toGenerationPreferencesRequest(generationPreferences);
        const generationDirectivesRequest =
            toGenerationDirectivesRequest(generationDirectives);

        // 3. Save user profile to database (optional - continue even if fails)
        let savedProfile = null;
        try {
            const { data: profileData, error: profileError } =
                await supabaseAdmin!
                    .from("user_ai_profiles")
                    .insert({
                        user_id: userId,
                        current_job_role: profile.currentRole, // Map camelCase to snake_case
                        target_role: profile.targetRole,
                        current_skills: profile.currentSkills,
                        skill_level: profile.skillLevel,
                        learning_style: profile.learningStyle,
                        hours_per_week: profile.hoursPerWeek,
                        target_months: profile.targetMonths,
                        preferred_language: profile.preferredLanguage,
                        focus_areas: profile.focusAreas || [],
                    })
                    .select()
                    .single();

            if (!profileError && profileData) {
                savedProfile = profileData;
            } else {
                // Table might not exist yet - this is OK, continue without saving
                console.warn(
                    "Profile save skipped (table may not exist):",
                    profileError?.message || "Unknown error",
                );
            }
        } catch (err: any) {
            // Non-critical error - continue without saving profile
            console.warn(
                "Profile save error (non-critical):",
                err?.message || err,
            );
        }

        // 4. Call Groq directly (no FastAPI needed!)
        const startTime = Date.now();
        let aiResult;

        try {
            aiResult = await generateRoadmapWithGroq(
                profile,
                generationPreferencesRequest as any,
                generationDirectivesRequest as any,
            );
        } catch (groqError: any) {
            console.error("Groq API error:", groqError);

            const message = groqError?.message || String(groqError);

            // Handle specific Groq errors
            if (message.includes("rate_limit") || message.includes("429")) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Groq API rate limit exceeded. Vui lòng đợi 1 phút và thử lại. (Free tier: 30 requests/phút)",
                    },
                    { status: 429 },
                );
            }
            if (
                message.includes("invalid_api_key") ||
                message.includes("401") ||
                message.includes("GROQ_API_KEY")
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Groq API key không hợp lệ. Vui lòng kiểm tra GROQ_API_KEY trong .env.local. Lấy API key miễn phí tại: https://console.groq.com/",
                    },
                    { status: 401 },
                );
            }
            if (message.includes("connection") || message.includes("503")) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Không thể kết nối đến Groq API. Vui lòng kiểm tra kết nối internet.",
                    },
                    { status: 503 },
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: `Lỗi tạo roadmap: ${message.substring(0, 200)}`,
                },
                { status: 500 },
            );
        }

        const totalLatency = Date.now() - startTime;
        const { roadmap: aiRoadmap, metadata: aiMetadata } = aiResult;

        // 5. Save generated roadmap to database
        let savedRoadmap = null;
        try {
            const { data: roadmapData, error: roadmapError } =
                await supabaseAdmin!
                    .from("ai_generated_roadmaps")
                    .insert({
                        user_id: userId,
                        profile_id: savedProfile?.id || null,
                        title: aiRoadmap.roadmap_title,
                        description: aiRoadmap.roadmap_description,
                        total_estimated_hours: aiRoadmap.total_estimated_hours,
                        sections: aiRoadmap.sections || [],
                        phases: aiRoadmap.phases,
                        nodes: aiRoadmap.nodes,
                        edges: aiRoadmap.edges,
                        generation_metadata: {
                            ...aiMetadata,
                            total_latency_ms: totalLatency,
                            generation_input: {
                                audience_type: profile.audienceType || "worker",
                                target_role: profile.targetRole,
                                current_role: profile.currentRole,
                                focus_areas: profile.focusAreas || [],
                                generation_preferences:
                                    generationPreferencesRequest,
                                generation_directives:
                                    generationDirectivesRequest,
                            },
                        },
                        is_active: true,
                    })
                    .select()
                    .single();

            if (roadmapError) {
                console.error("Error saving roadmap:", roadmapError);

                // If table doesn't exist, return roadmap data anyway
                if (
                    roadmapError.code === "PGRST204" ||
                    roadmapError.message?.includes("does not exist") ||
                    roadmapError.message?.includes("schema cache")
                ) {
                    console.warn(
                        "Roadmap table does not exist. Returning roadmap without saving.",
                    );
                    return NextResponse.json({
                        success: true,
                        data: {
                            id: `temp-${Date.now()}`,
                            ...aiRoadmap,
                            metadata: {
                                ...aiMetadata,
                                total_latency_ms: totalLatency,
                            },
                        },
                        warning:
                            "Roadmap generated successfully but not saved to database.",
                    });
                }

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Failed to save roadmap to database: " +
                            roadmapError.message,
                    },
                    { status: 500 },
                );
            }

            savedRoadmap = roadmapData;
            console.log("Roadmap saved successfully with ID:", savedRoadmap.id);
        } catch (err: any) {
            console.error("Unexpected error saving roadmap:", err);
            // Return roadmap anyway if it was generated successfully
            return NextResponse.json({
                success: true,
                data: {
                    id: `temp-${Date.now()}`,
                    ...aiRoadmap,
                    metadata: {
                        ...aiMetadata,
                        total_latency_ms: totalLatency,
                    },
                },
                warning:
                    "Roadmap generated but database save failed: " +
                    (err?.message || "Unknown error"),
            });
        }

        // 6. Return success response
        if (!savedRoadmap) {
            console.warn("Roadmap was not saved but no error was thrown");
            return NextResponse.json({
                success: true,
                data: {
                    id: `temp-${Date.now()}`,
                    ...aiRoadmap,
                    metadata: {
                        ...aiMetadata,
                        total_latency_ms: totalLatency,
                    },
                },
                warning: "Roadmap generated but not saved to database.",
            });
        }

        console.log("Returning roadmap with ID:", savedRoadmap.id);
        return NextResponse.json({
            success: true,
            data: {
                id: savedRoadmap.id,
                ...aiRoadmap,
                metadata: {
                    ...aiMetadata,
                    total_latency_ms: totalLatency,
                },
            },
        });
    } catch (error: any) {
        console.error("Generate roadmap error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Internal server error",
            },
            { status: 500 },
        );
    }
}
