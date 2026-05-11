"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search, Send, Sparkles, MessageCircle, Users, Paperclip, Phone, Video } from "lucide-react";

type Conversation = {
    id: string;
    name: string;
    role: string;
    online: boolean;
    lastSeen: string;
    preview: string;
    unread: number;
    messages: { id: string; sender: "me" | "them"; text: string; time: string }[];
};

const seedConversations: Conversation[] = [
    {
        id: "1",
        name: "Nguyễn Minh Anh",
        role: "Frontend Developer",
        online: true,
        lastSeen: "Đang hoạt động",
        preview: "Mình gửi bạn roadmap React rồi nhé.",
        unread: 2,
        messages: [
            { id: "m1", sender: "them", text: "Mình gửi bạn roadmap React rồi nhé.", time: "09:12" },
            { id: "m2", sender: "me", text: "Ok mình xem rồi, cảm ơn bạn!", time: "09:14" },
            { id: "m3", sender: "them", text: "Nếu cần mình review CV luôn cũng được.", time: "09:18" },
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
            { id: "m1", sender: "them", text: "Bạn thử làm bài đó theo hướng data first nhé.", time: "08:50" },
            { id: "m2", sender: "me", text: "Ừ, mình đang chỉnh lại flow đây.", time: "08:55" },
        ],
    },
    {
        id: "3",
        name: "Phạm Thu Hằng",
        role: "Mentor",
        online: true,
        lastSeen: "Đang hoạt động",
        preview: "Mai mình review portfolio cho bạn.",
        unread: 1,
        messages: [
            { id: "m1", sender: "them", text: "Mai mình review portfolio cho bạn.", time: "Hôm qua" },
            { id: "m2", sender: "me", text: "Tuyệt quá, mình sẽ chuẩn bị trước.", time: "Hôm qua" },
        ],
    },
];

export default function MessagesPage() {
    const [conversations, setConversations] = useState(seedConversations);
    const [activeId, setActiveId] = useState(seedConversations[0].id);
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState("");

    const activeConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
        [activeId, conversations],
    );

    const filteredConversations = conversations.filter((conversation) =>
        [conversation.name, conversation.role, conversation.preview]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
    );

    const sendMessage = () => {
        if (!draft.trim() || !activeConversation) return;

        const nextMessage = {
            id: crypto.randomUUID(),
            sender: "me" as const,
            text: draft.trim(),
            time: "Vừa xong",
        };

        setConversations((prev) =>
            prev.map((conversation) =>
                conversation.id === activeConversation.id
                    ? {
                          ...conversation,
                          preview: draft.trim(),
                          messages: [...conversation.messages, nextMessage],
                          unread: 0,
                      }
                    : conversation,
            ),
        );
        setDraft("");
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="border-b border-border bg-secondary/10">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <div>
                            <span className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                                Member messaging
                            </span>
                            <h1 className="mt-4 text-3xl font-bold md:text-4xl">Nhắn tin giữa các thành viên như một messenger thật sự</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                                Khu vực này cho phép member trao đổi nhanh, giữ ngữ cảnh hội thoại và quay lại đoạn chat còn dang dở.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { label: "Bạn bè", value: conversations.length, icon: Users },
                                { label: "Đang online", value: conversations.filter((c) => c.online).length, icon: MessageCircle },
                                { label: "Chưa đọc", value: conversations.reduce((sum, c) => sum + c.unread, 0), icon: ArrowRight },
                            ].map((item) => (
                                <div key={item.label} className="border border-border bg-background p-4">
                                    <item.icon className="h-5 w-5 text-foreground" />
                                    <p className="mt-3 text-2xl font-bold">{item.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:px-10 lg:grid-cols-[360px_1fr] lg:px-16 xl:px-[90px] 2xl:px-16">
                <aside className="rounded-3xl border border-border bg-background p-4 shadow-sm">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm người hoặc nội dung..."
                            className="w-full border border-border bg-background py-3 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                        />
                    </div>

                    <div className="mt-4 space-y-2">
                        {filteredConversations.map((conversation) => {
                            const active = conversation.id === activeConversation?.id;
                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => setActiveId(conversation.id)}
                                    className={`flex w-full items-center gap-3 border px-3 py-3 text-left transition-colors ${active ? "border-foreground bg-secondary/40" : "border-border hover:bg-secondary/20"}`}
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary font-semibold">
                                        {conversation.name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-semibold">{conversation.name}</p>
                                            {conversation.unread > 0 && (
                                                <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
                                                    {conversation.unread}
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">{conversation.role}</p>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.preview}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="flex min-h-[72vh] flex-col rounded-3xl border border-border bg-background shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                        <div>
                            <h2 className="text-lg font-semibold">{activeConversation?.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {activeConversation?.online ? "Đang online" : activeConversation?.lastSeen}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="border border-border p-2 transition-colors hover:bg-secondary/30"><Phone className="h-4 w-4" /></button>
                            <button className="border border-border p-2 transition-colors hover:bg-secondary/30"><Video className="h-4 w-4" /></button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                        {activeConversation?.messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] rounded-2xl border px-4 py-3 text-sm leading-6 ${message.sender === "me" ? "border-foreground bg-foreground text-background" : "border-border bg-secondary/20 text-foreground"}`}>
                                    <p>{message.text}</p>
                                    <p className={`mt-2 text-[10px] ${message.sender === "me" ? "text-background/70" : "text-muted-foreground"}`}>
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border p-4">
                        <div className="flex items-end gap-3">
                            <button className="mb-1 border border-border p-2 transition-colors hover:bg-secondary/30">
                                <Paperclip className="h-4 w-4" />
                            </button>
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                rows={3}
                                className="min-h-[72px] flex-1 resize-none border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                            />
                            <button
                                onClick={sendMessage}
                                className="inline-flex h-12 items-center gap-2 border border-foreground bg-foreground px-5 text-sm font-medium text-background transition-colors hover:opacity-90"
                            >
                                Gửi
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}
