"use client";

import { useState, useEffect } from "react";
import { Megaphone, X, Sparkles, Rocket, Zap, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const bulletinEntries = [
    {
        id: 1,
        icon: Rocket,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        title: "Chào mừng đến với CodeMind",
        date: "01/03/2026",
        badge: "Khởi đầu",
        badgeStyle: "bg-blue-100 text-blue-700 border-blue-200",
        content: [
            "Chúng tôi rất vui khi giới thiệu đến bạn nền tảng học tập thông minh CodeMind — nơi kết hợp trí tuệ nhân tạo và IoT để mang đến trải nghiệm học lập trình hiệu quả nhất.",
            "Hệ thống cung cấp các khóa học từ cơ bản đến nâng cao, lộ trình học tập cá nhân hóa, và môi trường thực hành trực tiếp trên trình duyệt.",
        ],
    },
    {
        id: 2,
        icon: Sparkles,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-500/10",
        title: "Tính năng mới: AI Roadmap & Code Playground",
        date: "28/02/2026",
        badge: "Tính năng",
        badgeStyle: "bg-indigo-100 text-indigo-700 border-indigo-200",
        content: [
            "AI Roadmap giúp bạn tạo lộ trình học tập được cá nhân hóa dựa trên mục tiêu và trình độ hiện tại. Hệ thống sẽ đề xuất các khóa học phù hợp và theo dõi tiến trình của bạn.",
            "Code Playground cho phép bạn viết và chạy code trực tiếp trong trình duyệt mà không cần cài đặt bất kỳ phần mềm nào. Hỗ trợ nhiều ngôn ngữ lập trình phổ biến.",
        ],
    },
    {
        id: 3,
        icon: Zap,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-500/10",
        title: "Cập nhật & Tối ưu hệ thống",
        date: "25/02/2026",
        badge: "Tối ưu",
        badgeStyle: "bg-amber-100 text-amber-700 border-amber-200",
        content: [
            "• Cải thiện giao diện trang lộ trình học tập với UI hiện đại.",
            "• Thêm tính năng Roadmap Tree View giúp dễ dàng theo dõi.",
            "• Sửa lỗi video player không tự chuyển bài mượt mà.",
            "• Tối ưu hiệu suất tải trang, nâng cấp trải nghiệm người dùng.",
        ],
    },
];

export default function NewsletterBulletin() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const handleOpen = () => {
        setIsOpen(true);
        setHasUnread(false);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // ESC to close
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Premium Floating Button */}
            <motion.button
                onClick={handleOpen}
                className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-white/80 backdrop-blur-md text-slate-700 hover:text-indigo-600 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer group hover:bg-white"
                aria-label="Mở bảng tin"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Megaphone className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
                
                {hasUnread && (
                    <>
                        <span className="absolute 0 -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white"></span>
                        </span>
                    </>
                )}
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Glassmorphism Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={handleClose}
                        />

                        {/* Premium Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: "spring",
                                duration: 0.5,
                                bounce: 0.15,
                            }}
                            className="relative w-full max-w-[600px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden max-h-[85vh] flex flex-col border border-slate-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header - Gradient & Glossy */}
                            <div className="relative overflow-hidden px-8 pt-8 pb-6 border-b border-slate-100">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-blue-50 to-white pointer-events-none" />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-200">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                                Bản tin mới
                                            </h2>
                                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                                Cập nhật tính năng & thông báo
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all cursor-pointer backdrop-blur-sm"
                                        aria-label="Đóng"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content — Scrollable */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-slate-50/50">
                                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {bulletinEntries.map((entry, index) => {
                                        const Icon = entry.icon;
                                        return (
                                            <motion.article 
                                                key={entry.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                            >
                                                {/* Timeline node */}
                                                <div className={cn(
                                                    "flex items-center justify-center w-9 h-9 rounded-full border-4 border-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
                                                    entry.iconBg, entry.iconColor
                                                )}>
                                                    <Icon className="w-4 h-4" />
                                                </div>

                                                {/* Card */}
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-3 gap-2">
                                                        <span className={cn(
                                                            "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-lg border",
                                                            entry.badgeStyle
                                                        )}>
                                                            {entry.badge}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                                            <CalendarDays className="w-3.5 h-3.5" />
                                                            <time>{entry.date}</time>
                                                        </div>
                                                    </div>
                                                    
                                                    <h3 className="font-bold text-slate-800 text-[16px] leading-snug mb-3">
                                                        {entry.title}
                                                    </h3>
                                                    
                                                    <div className="space-y-2.5 text-slate-600 text-[14px] leading-relaxed">
                                                        {entry.content.map((paragraph, pIdx) => (
                                                            <p key={pIdx}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-4 border-t border-slate-100 bg-white">
                                <p className="text-sm text-slate-400 font-medium text-center flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    CodeMind • Trải nghiệm học tập thế hệ mới
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </>
    );
}
