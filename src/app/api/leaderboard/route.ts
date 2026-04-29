import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";

type Period = "all" | "week" | "month";

function parsePeriod(value: string | null): Period {
    if (value === "week" || value === "month") return value;
    return "all";
}

function periodCutoff(period: Period): string | null {
    if (period === "all") return null;
    const days = period === "week" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return cutoff.toISOString().split("T")[0];
}

/**
 * GET /api/leaderboard?period=all|week|month&limit=50
 *
 * Returns top users by total_xp.
 *
 * NOTE: We currently only track cumulative `total_xp` in `user_gamification`
 * (no per-day XP log), so "week" / "month" filters use the user's
 * `last_activity_date` to scope to "active learners in the last N days"
 * and rank them by cumulative XP. When an `xp_history` table is added,
 * this endpoint should switch to summing XP within the period.
 */
/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     summary: API endpoint for /api/leaderboard
 *     description: Tự động sinh tài liệu cho GET /api/leaderboard. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json(
                { success: false, message: "Database not available" },
                { status: 503 },
            );
        }

        const { searchParams } = new URL(request.url);
        const period = parsePeriod(searchParams.get("period"));
        const limit = Math.min(
            Math.max(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 1),
            100,
        );

        let query = supabaseAdmin
            .from("user_gamification")
            .select(
                "user_id, total_xp, level, current_streak, longest_streak, last_activity_date",
            )
            .order("total_xp", { ascending: false })
            .limit(limit);

        const cutoff = periodCutoff(period);
        if (cutoff) {
            query = query.gte("last_activity_date", cutoff);
        }

        const { data: gamification, error } = await query;

        if (error) {
            console.error("[Leaderboard] gamification error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to load leaderboard" },
                { status: 500 },
            );
        }

        const rows = gamification ?? [];

        if (rows.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        const userIds = rows.map((r) => r.user_id);

        const { data: users } = await supabaseAdmin
            .from("users")
            .select("id, username, full_name, avatar_url")
            .in("id", userIds);

        const userMap = new Map<
            string,
            {
                id: string;
                username: string | null;
                full_name: string | null;
                avatar_url: string | null;
            }
        >();
        for (const u of users ?? []) {
            userMap.set(u.id as string, {
                id: u.id as string,
                username: (u.username as string | null) ?? null,
                full_name: (u.full_name as string | null) ?? null,
                avatar_url: (u.avatar_url as string | null) ?? null,
            });
        }

        const data = rows.map((r, idx) => {
            const user = userMap.get(r.user_id);
            return {
                rank: idx + 1,
                userId: r.user_id,
                username: user?.username ?? null,
                fullName: user?.full_name ?? user?.username ?? "Học viên",
                avatarUrl: user?.avatar_url ?? null,
                totalXp: r.total_xp ?? 0,
                level: r.level ?? 1,
                currentStreak: r.current_streak ?? 0,
                longestStreak: r.longest_streak ?? 0,
                lastActivityDate: r.last_activity_date ?? null,
            };
        });

        return NextResponse.json(
            { success: true, period, data },
            {
                headers: {
                    "Cache-Control":
                        "public, max-age=60, stale-while-revalidate=300",
                },
            },
        );
    } catch (error) {
        console.error("[Leaderboard] unexpected error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
