import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Messages - CodeMind",
    description: "Nhắn tin giữa các thành viên trong nền tảng.",
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
