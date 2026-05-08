import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/messenger/friends
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const userId = decoded.userId;

        // Fetch friendships
        const { data: friendships, error } = await supabaseAdmin!
            .from("friendships")
            .select(`
                id, status, user_id_1, user_id_2,
                user1:user_id_1 (id, full_name, username, avatar_url),
                user2:user_id_2 (id, full_name, username, avatar_url)
            `)
            .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

        if (error) throw error;

        // Process data
        const friends: any[] = [];
        const pendingRequests: any[] = [];

        (friendships || []).forEach((f: any) => {
            const isUser1 = f.user_id_1 === userId;
            const otherUser = isUser1 ? f.user2 : f.user1;
            
            const formattedUser = {
                id: otherUser.id,
                full_name: otherUser.full_name,
                username: otherUser.username,
                avatar_url: otherUser.avatar_url
            };

            if (f.status === 'accepted') {
                friends.push({ friendshipId: f.id, user: formattedUser });
            } else if (f.status === 'pending_user1' || f.status === 'pending_user2') {
                const isOutgoing = (isUser1 && f.status === 'pending_user1') || (!isUser1 && f.status === 'pending_user2');
                
                if (!isOutgoing) {
                    // Only show incoming requests in the requests tab
                    pendingRequests.push({
                        friendshipId: f.id,
                        user: formattedUser,
                        isOutgoing: false
                    });
                }
            }
        });

        return NextResponse.json({ friends, pendingRequests });
    } catch (error: any) {
        console.error("Get friends error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}

// POST /api/messenger/friends - Send request
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { targetUserId } = await request.json();
        const userId = decoded.userId;

        if (userId === targetUserId) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

        const isUser1 = userId < targetUserId;
        const user1 = isUser1 ? userId : targetUserId;
        const user2 = isUser1 ? targetUserId : userId;
        const pendingStatus = isUser1 ? 'pending_user1' : 'pending_user2';

        const { error } = await supabaseAdmin!
            .from("friendships")
            .upsert({
                user_id_1: user1,
                user_id_2: user2,
                status: pendingStatus,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id_1,user_id_2' });

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Đã gửi lời mời" });
    } catch (error: any) {
        console.error("Add friend error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}

// PUT /api/messenger/friends - Accept request
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { targetUserId } = await request.json();
        const userId = decoded.userId;

        const isUser1 = userId < targetUserId;
        const user1 = isUser1 ? userId : targetUserId;
        const user2 = isUser1 ? targetUserId : userId;

        const { error } = await supabaseAdmin!
            .from("friendships")
            .update({ status: 'accepted', updated_at: new Date().toISOString() })
            .eq("user_id_1", user1)
            .eq("user_id_2", user2);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Đã chấp nhận kết bạn" });
    } catch (error: any) {
        console.error("Accept friend error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}

// DELETE /api/messenger/friends - Remove friend / Reject request
export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { targetUserId } = await request.json();
        const userId = decoded.userId;

        const user1 = userId < targetUserId ? userId : targetUserId;
        const user2 = userId < targetUserId ? targetUserId : userId;

        const { error } = await supabaseAdmin!
            .from("friendships")
            .delete()
            .eq("user_id_1", user1)
            .eq("user_id_2", user2);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Remove friend error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
