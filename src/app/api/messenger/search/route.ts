import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";

        if (!query || query.length < 2) {
            return NextResponse.json({ users: [] });
        }

        // Search users by full_name or username
        const { data, error } = await supabaseAdmin!
            .from("users")
            .select("id, full_name, username, avatar_url")
            .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
            .neq("id", decoded.userId)
            .limit(10);

        if (error) throw error;

        return NextResponse.json({ users: data || [] });
    } catch (error: any) {
        console.error("Search users error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
