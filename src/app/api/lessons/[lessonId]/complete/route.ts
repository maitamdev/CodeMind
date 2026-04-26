import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, update } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "") as { userId: string };
    const userId = decoded.userId;
    const { lessonId } = await params;

    // Get course_id from lesson → chapter
    const lesson = await queryOneBuilder<{ chapter_id: string }>(
      "lessons",
      { select: "chapter_id", filters: { id: lessonId } }
    );

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 }
      );
    }

    const chapter = await queryOneBuilder<{ course_id: string }>(
      "chapters",
      { select: "course_id", filters: { id: lesson.chapter_id } }
    );

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: "Chapter not found" },
        { status: 404 }
      );
    }

    const courseId = chapter.course_id;

    // Check enrollment
    const enrollment = await queryOneBuilder<{ id: string }>(
      "enrollments",
      { select: "id", filters: { user_id: userId, course_id: courseId } }
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "User is not enrolled in this course" },
        { status: 404 }
      );
    }

    // Upsert lesson_progress (insert or update on conflict)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Database not available" },
        { status: 500 }
      );
    }

    const { error: upsertError } = await supabaseAdmin
      .from("lesson_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          enrollment_id: enrollment.id,
          is_completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );

    if (upsertError) {
      console.error("Upsert lesson_progress error:", upsertError);
      return NextResponse.json(
        { success: false, message: "Failed to save progress" },
        { status: 500 }
      );
    }

    // Count total lessons & completed lessons for this course (simple queries)
    const { data: allLessons } = await supabaseAdmin
      .from("lessons")
      .select("id")
      .in("chapter_id", 
        (await supabaseAdmin.from("chapters").select("id").eq("course_id", courseId)).data?.map((c: any) => c.id) || []
      );

    const totalCount = allLessons?.length || 1;

    const { data: completedRows } = await supabaseAdmin
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("is_completed", true)
      .in("lesson_id", allLessons?.map((l: any) => l.id) || []);

    const completedCount = completedRows?.length || 0;
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    // Update enrollment progress
    try {
      await update(
        "enrollments",
        { user_id: userId, course_id: courseId },
        { progress_percentage: progressPercentage, last_lesson_id: lessonId } as any
      );
    } catch (enrollUpdateErr) {
      console.warn("Failed to update enrollment progress:", enrollUpdateErr);
      // Non-critical, don't fail the request
    }

    return NextResponse.json({
      success: true,
      message: "Lesson marked as completed",
      data: {
        progress: progressPercentage,
        completedCount,
        totalLessons: totalCount,
      }
    });

  } catch (error: any) {
    console.error("Error marking lesson as completed:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
