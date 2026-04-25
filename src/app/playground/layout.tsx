import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Code Playground — CodeMind",
    description: "IDE-style code editor with live preview and AI assistant",
};

export default function PlaygroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0c0c0c]">
            {children}
        </div>
    );
}
