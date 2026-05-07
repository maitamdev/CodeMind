import { NextRequest, NextResponse } from "next/server";
import {
    queryBuilder,
    queryOneBuilder,
    insert,
    db as supabaseAdmin,
} from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/auth-helpers";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * GET /api/lessons/:lessonId/questions
 * Get all questions for a lesson with status, likes, and answers count.
 */
/**
 * @swagger
 * /api/lessons/[lessonId]/questions:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: API endpoint for /api/lessons/[lessonId]/questions
 *     description: Tự động sinh tài liệu cho GET /api/lessons/[lessonId]/questions. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> },
) {
    try {
        const userId = await requireAuth();
        const { lessonId } = await params;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "ALL";
        const sortBy = searchParams.get("sortBy") || "RECENT";
        const search = searchParams.get("search") || "";

        // Query questions using DB-level status/answers_count
        let questionsQuery = supabaseAdmin!
            .from("lesson_questions")
            .select(
                `
        id,
        title,
        content,
        status,
        answers_count,
        likes_count,
        views_count,
        created_at,
        updated_at,
        users!inner(id, username, full_name, avatar_url, membership_type)
      `,
            )
            .eq("lesson_id", lessonId);

        // Filter by status
        if (status !== "ALL") {
            questionsQuery = questionsQuery.eq("status", status);
        }

        // Search
        if (search) {
            questionsQuery = questionsQuery.or(
                `title.ilike.%${search}%,content.ilike.%${search}%`,
            );
        }

        // Sort
        if (sortBy === "POPULAR") {
            questionsQuery = questionsQuery
                .order("likes_count", { ascending: false })
                .order("created_at", { ascending: false });
        } else {
            questionsQuery = questionsQuery.order("created_at", {
                ascending: false,
            });
        }

        const { data: questionsData, error: questionsError } =
            await questionsQuery;
        if (questionsError) throw questionsError;

        if (!questionsData || questionsData.length === 0) {
    
        // -------------------------------------------------------------------
        // GROQ AI AUTO-REPLY
        // -------------------------------------------------------------------
        try {
            // Find an admin user to act as the AI avatar
            const { data: adminUser } = await supabaseAdmin!
                .from("users")
                .select("id")
                .eq("role", "admin")
                .limit(1)
                .single();

            if (adminUser) {
                // Call Groq
                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `Bạn là CodeMind AI - Trợ lý giảng dạy lập trình thông minh của nền tảng CodeMind. 
Học viên đang hỏi một câu hỏi trong bài học "${lessonData.title || 'Không rõ'}".
Nội dung bài học:
${lessonData.content ? lessonData.content.substring(0, 3000) : 'Không có nội dung'}

Nhiệm vụ của bạn:
1. Trả lời câu hỏi của học viên một cách chính xác, ngắn gọn, dễ hiểu và cực kỳ thân thiện.
2. Luôn xưng hô "mình" và gọi học viên là "bạn".
3. Thêm một số biểu tượng cảm xúc (emoji) cho sinh động.
4. Trình bày code bằng Markdown nếu có.
5. Nếu câu hỏi nằm ngoài phạm vi bài học, hãy cố gắng giải đáp ngắn gọn và hướng dẫn họ tìm hiểu thêm.`
                        },
                        {
                            role: "user",
                            content: `Tiêu đề: ${title}\nNội dung: ${content}`
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_completion_tokens: 1024,
                });

                const aiAnswer = completion.choices[0]?.message?.content;

                if (aiAnswer) {
                    // Save to lesson_answers
                    await insert("lesson_answers", {
                        question_id: newQuestion.id,
                        user_id: adminUser.id,
                        content: aiAnswer,
                        is_accepted: false
                    });
                }
            }
        } catch (aiError) {
            console.error("Groq AI Error:", aiError);
            // Don't throw, we still want to return success for question creation
        }
        // -------------------------------------------------------------------

        return NextResponse.json({
                success: true,
                data: { questions: [] },
            });
        }

        // Get user's liked questions
        const questionIds = questionsData.map((q: any) => q.id);
        const { data: userLikes } = await supabaseAdmin!
            .from("lesson_question_likes")
            .select("question_id")
            .eq("user_id", userId)
            .in("question_id", questionIds);

        const likedQuestionIds = new Set(
            (userLikes || []).map((l: any) => l.question_id),
        );

        const questions = questionsData.map((row: any) => ({
            id: row.id,
            title: row.title,
            content: row.content,
            status: row.status || "OPEN",
            answersCount: row.answers_count || 0,
            likesCount: row.likes_count || 0,
            viewsCount: row.views_count || 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            user: {
                id: row.users.id,
                username: row.users.username,
                fullName: row.users.full_name,
                avatarUrl: row.users.avatar_url,
                membershipType: row.users.membership_type || "FREE",
            },
            isLiked: likedQuestionIds.has(row.id),
        }));

        return NextResponse.json({
            success: true,
            data: { questions },
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * POST /api/lessons/:lessonId/questions
 * Create a new question (requires enrollment).
 */
/**
 * @swagger
 * /api/lessons/[lessonId]/questions:
 *   post:
 *     tags:
 *       - Lessons
 *     summary: API endpoint for /api/lessons/[lessonId]/questions
 *     description: Tự động sinh tài liệu cho POST /api/lessons/[lessonId]/questions. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> },
) {
    try {
        const userId = await requireAuth();
        const { lessonId } = await params;
        const body = await request.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: "Title and content are required" },
                { status: 400 },
            );
        }

        // Single JOIN query to verify lesson exists and get course_id
        const { data: lessonData, error: lessonError } = await supabaseAdmin!
            .from("lessons")
            .select(
                `
        id,
        title,
        content,
        chapters!inner(
          id,
          courses!inner(id)
        )
      `,
            )
            .eq("id", lessonId)
            .single();

        if (lessonError || !lessonData) {
            return NextResponse.json(
                { success: false, message: "Lesson not found" },
                { status: 404 },
            );
        }

        const courseId = (lessonData.chapters as any)?.courses?.id;
        if (!courseId) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 },
            );
        }

        // Check enrollment
        const enrollment = await queryOneBuilder<{ id: string }>(
            "enrollments",
            {
                select: "id",
                filters: {
                    user_id: userId,
                    course_id: courseId,
                    is_active: true,
                },
            },
        );

        if (!enrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You must be enrolled in this course to ask questions",
                },
                { status: 403 },
            );
        }

        // Create question (status defaults to 'OPEN' in DB)
        const [newQuestion] = await insert<{
            id: string;
            lesson_id: string;
            user_id: string;
            title: string;
            content: string;
        }>("lesson_questions", {
            lesson_id: lessonId,
            user_id: userId,
            title,
            content,
        });

        return NextResponse.json({
            success: true,
            data: { questionId: newQuestion.id },
            message: "Question created successfully",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }
        console.error("Error creating question:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
