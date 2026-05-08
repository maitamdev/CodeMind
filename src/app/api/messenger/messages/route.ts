import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/messenger/messages?friendId=...
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const friendId = searchParams.get("friendId");

        if (!friendId) return NextResponse.json({ error: "Missing friendId" }, { status: 400 });

        const userId = decoded.userId;

        const { data, error } = await supabaseAdmin!
            .from("direct_messages")
            .select("*")
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
            .order("created_at", { ascending: true })
            .limit(100);

        if (error) throw error;

        return NextResponse.json({ messages: data || [] });
    } catch (error: any) {
        console.error("Get messages error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}

// POST /api/messenger/messages
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { receiverId, content } = await request.json();
        const senderId = decoded.userId;

        if (!receiverId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        // Insert message
        const { data, error } = await supabaseAdmin!
            .from("direct_messages")
            .insert({
                sender_id: senderId,
                receiver_id: receiverId,
                content: content
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, message: data });
    } catch (error: any) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
