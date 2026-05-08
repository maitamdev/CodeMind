import { Metadata } from "next";
import MessengerClient from "@/components/Messenger/MessengerClient";

export const metadata: Metadata = {
    title: "Messenger | CodeMind",
    description: "Nhắn tin và kết nối với bạn bè trên CodeMind",
};

export default function MessengerPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-66px)] bg-[var(--ide-bg)]">
            <MessengerClient />
        </div>
    );
}
