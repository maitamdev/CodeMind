import { NextRequest, NextResponse } from "next/server";

type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    createdAt: string;
};

type ConversationSeed = {
    id: string;
    name: string;
    role: string;
    online: boolean;
    lastSeen: string;
    preview: string;
    unread: number;
    messages: Message[];
};

const conversations: ConversationSeed[] = [
    {
        id: "1",
        name: "Nguyễn Minh Anh",
        role: "Frontend Developer",
        online: true,
        lastSeen: "Đang hoạt động",
        preview: "Mình gửi bạn roadmap React rồi nhé.",
        unread: 2,
        messages: [
            { id: "m1", senderId: "u2", receiverId: "u1", text: "Mình gửi bạn roadmap React rồi nhé.", createdAt: "09:12" },
            { id: "m2", senderId: "u1", receiverId: "u2", text: "Ok mình xem rồi, cảm ơn bạn!", createdAt: "09:14" },
        ],
    },
    {
        id: "2",
        name: "Trần Gia Bảo",
        role: "AI Learner",
        online: false,
        lastSeen: "15 phút trước",
        preview: "Bạn thử làm bài đó theo hướng data first nhé.",
        unread: 0,
        messages: [
            { id: "m1", senderId: "u3", receiverId: "u1", text: "Bạn thử làm bài đó theo hướng data first nhé.", createdAt: "08:50" },
        ],
    },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
        const conversation = conversations.find((item) => item.id === conversationId);
        if (!conversation) {
            return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: conversation });
    }

    return NextResponse.json({ success: true, data: conversations });
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    if (!body?.conversationId || !body?.text) {
        return NextResponse.json({ success: false, message: "Missing conversationId or text" }, { status: 400 });
    }

    const conversation = conversations.find((item) => item.id === body.conversationId);
    if (!conversation) {
        return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
    }

    const message: Message = {
        id: crypto.randomUUID(),
        senderId: body.senderId ?? "me",
        receiverId: body.receiverId ?? "them",
        text: String(body.text),
        createdAt: new Date().toISOString(),
    };

    conversation.messages.push(message);
    conversation.preview = message.text;

    return NextResponse.json({ success: true, data: message });
}
