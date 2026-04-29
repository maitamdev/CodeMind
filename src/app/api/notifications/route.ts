import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth-helpers";
import { db as supabaseAdmin } from "@/lib/db";

export type NotificationKind =
    | "answer"
    | "streak"
    | "course-complete"
    | "course-update"
    | "system";

export interface NotificationItem {
    id: string;
    kind: NotificationKind;
    title: string;
    message: string;
    href: string | null;
    createdAt: string;
    actor?: {
        name: string;
        avatarUrl: string | null;
    } | null;
    metadata?: Record<string, unknown>;
}

const MAX_ITEMS = 30;

/**
 * GET /api/notifications
 *
 * Synthesizes a notification feed for the current user from existing
 * data sources (no dedicated `notifications` table required):
 *
 *  - "answer"          : recent replies to user's lesson questions
 *  - "course-complete" : courses the user finished in the last 30 days
 *  - "streak"          : reminder if last_activity_date >= 1 day ago
 *
 * The feed is sorted by `createdAt` desc and capped at MAX_ITEMS.
 */
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: API endpoint for /api/notifications
 *     description: Tự động sinh tài liệu cho GET /api/notifications. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET() {
    try {
        const userId = await getAuthUserId();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ success: true, data: [] });
        }

        const items: NotificationItem[] = [];
        const now = new Date();
        const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString();

        // 1) Answers to user's own lesson questions (last 30 days)
        const { data: myQuestions } = await supabaseAdmin
            .from("lesson_questions")
            .select("id, content, lesson_id")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);

        const myQuestionIds = (myQuestions ?? []).map(
            (q) => q.id as string,
        );

        if (myQuestionIds.length > 0) {
            const { data: answers } = await supabaseAdmin
                .from("lesson_answers")
                .select(
                    "id, question_id, content, created_at, user_id, users!inner(id, full_name, username, avatar_url)",
                )
                .in("question_id", myQuestionIds)
                .neq("user_id", userId) // skip own answers
                .gte("created_at", thirtyDaysAgo)
                .order("created_at", { ascending: false })
                .limit(20);

            for (const a of answers ?? []) {
                const usersField = a.users as unknown;
                const u = (Array.isArray(usersField)
                    ? usersField[0]
                    : usersField) as
                    | {
                          full_name: string | null;
                          username: string | null;
                          avatar_url: string | null;
                      }
                    | null;
                const name =
                    u?.full_name || u?.username || "Một thành viên";
                const snippet =
                    typeof a.content === "string"
                        ? a.content.replace(/\s+/g, " ").slice(0, 100)
                        : "";

                items.push({
                    id: `answer:${a.id}`,
                    kind: "answer",
                    title: `${name} đã trả lời câu hỏi của bạn`,
                    message: snippet,
                    href: `/qa`,
                    createdAt: a.created_at as string,
                    actor: {
                        name,
                        avatarUrl:
                            (u?.avatar_url as string | null) ?? null,
                    },
                });
            }
        }

        // 2) Course completions in last 30 days
        const { data: completions } = await supabaseAdmin
            .from("enrollments")
            .select(
                "id, course_id, completed_at, courses!inner(slug, title, thumbnail_url)",
            )
            .eq("user_id", userId)
            .not("completed_at", "is", null)
            .gte("completed_at", thirtyDaysAgo)
            .order("completed_at", { ascending: false })
            .limit(10);

        for (const e of completions ?? []) {
            const coursesField = e.courses as unknown;
            const course = (Array.isArray(coursesField)
                ? coursesField[0]
                : coursesField) as
                | {
                      slug: string;
                      title: string;
                      thumbnail_url: string | null;
                  }
                | null;
            if (!course) continue;
            items.push({
                id: `complete:${e.id}`,
                kind: "course-complete",
                title: "Bạn đã hoàn thành khóa học",
                message: course.title,
                href: `/courses/${course.slug}`,
                createdAt: e.completed_at as string,
                actor: null,
            });
        }

        // 3) Streak reminder
        const { data: gamification } = await supabaseAdmin
            .from("user_gamification")
            .select("current_streak, last_activity_date")
            .eq("user_id", userId)
            .maybeSingle();

        if (gamification) {
            const lastDate = gamification.last_activity_date as
                | string
                | null;
            const todayStr = now.toISOString().split("T")[0];
            const yesterday = new Date(
                now.getTime() - 24 * 60 * 60 * 1000,
            )
                .toISOString()
                .split("T")[0];
            const streak =
                (gamification.current_streak as number | null) ?? 0;

            if (lastDate && lastDate === yesterday && streak > 0) {
                items.push({
                    id: `streak:${todayStr}`,
                    kind: "streak",
                    title: `🔥 Đừng để mất chuỗi ${streak} ngày!`,
                    message:
                        "Học một bài hôm nay để giữ chuỗi streak của bạn.",
                    href: "/courses",
                    createdAt: now.toISOString(),
                });
            } else if (
                lastDate &&
                lastDate < yesterday &&
                streak > 0
            ) {
                // Streak just broke today
                items.push({
                    id: `streak-broken:${todayStr}`,
                    kind: "streak",
                    title: "Chuỗi streak đã bị gián đoạn",
                    message:
                        "Bắt đầu lại hôm nay — mọi hành trình đều có thể bắt đầu từ ngày 1.",
                    href: "/courses",
                    createdAt: now.toISOString(),
                });
            }
        }

        // Sort + cap
        items.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );

        return NextResponse.json(
            { success: true, data: items.slice(0, MAX_ITEMS) },
            {
                headers: {
                    "Cache-Control": "private, max-age=30",
                },
            },
        );
    } catch (error) {
        console.error("[Notifications] error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
