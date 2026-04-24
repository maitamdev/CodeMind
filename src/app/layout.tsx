import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: "CodeMind — Nền tảng học lập trình tích hợp AI",
    description:
        "CodeMind — Nền tảng học lập trình thông minh tích hợp AI. Khóa học chất lượng, IDE trực tuyến, AI Code Assistant và lộ trình học tập cá nhân hóa.",
    keywords: [
        "học lập trình",
        "code online",
        "AI tutor",
        "khóa học lập trình",
        "CodeMind",
        "học code",
        "lập trình web",
        "javascript",
        "python",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </head>
            <body className="antialiased" suppressHydrationWarning={true}>
                <ToastProvider>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            forcedTheme="light"
                            enableSystem={false}
                            enableColorScheme={false}
                        >
                            <LayoutWrapper>{children}</LayoutWrapper>
                        </ThemeProvider>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
