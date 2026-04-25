"use client";

import { ToastProvider } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    BookOpen,
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronLeft,
    Menu as MenuIcon,
    Home,
    Shield,
    Users,
    FileText,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";
import PageLoading from "@/components/PageLoading";
import Logo from "@/components/Logo";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check authentication
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/auth/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (!mounted || isLoading) {
        return (
            <PageLoading message="Đang kiểm tra quyền truy cập..." bg="dark" />
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    const userRole = user?.role?.toLowerCase();
    const hasAccess =
        userRole === "admin" ||
        userRole === "instructor" ||
        userRole === "teacher";

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30">
                            <Shield className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-mono font-bold text-white mb-2 tracking-tight">
                        ACCESS_DENIED
                    </h2>
                    <p className="text-neutral-400 text-sm font-mono mb-6">
                        Bạn không có quyền truy cập trang admin.
                        <br />
                        Chỉ admin và instructor mới có thể sử dụng.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-2.5 bg-white text-black font-mono font-bold text-sm hover:bg-neutral-200 transition"
                    >
                        ← Quay Lại Trang Chủ
                    </button>
                </div>
            </div>
        );
    }

    const navigationItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            id: "lessons",
            label: "Quản Lý Bài Học",
            href: "/admin/lessons",
            icon: BookOpen,
        },
        {
            id: "settings",
            label: "Cài Đặt Hệ Thống",
            href: "/admin/settings",
            icon: Settings,
        },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#0a0a0a] flex">
                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-0 h-screen bg-[#0f0f0f] border-r border-neutral-800 transition-all duration-300 z-40 ${
                        sidebarOpen ? "w-64" : "w-[68px]"
                    }`}
                >
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
                        {sidebarOpen && (
                            <Link
                                href="/"
                                className="flex items-center gap-2 flex-1"
                            >
                                <Logo size="sm" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <MenuIcon className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {sidebarOpen && (
                            <p className="px-3 pb-2 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
                                Navigation
                            </p>
                        )}
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
                                        active
                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold"
                                            : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent"
                                    } ${sidebarOpen ? "" : "justify-center"}`}
                                    title={sidebarOpen ? undefined : item.label}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {sidebarOpen && (
                                        <span className="text-sm font-mono">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-neutral-800 p-3 space-y-2">
                        {sidebarOpen && (
                            <div className="px-3 py-2 bg-neutral-800/30 border border-neutral-800 mb-2">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono font-bold text-neutral-200 truncate">
                                            {user?.full_name}
                                        </p>
                                        <p className="text-[10px] font-mono text-amber-500/80 uppercase tracking-wider">
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Link
                            href="/"
                            className={`w-full flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 transition ${
                                sidebarOpen ? "" : "justify-center"
                            }`}
                        >
                            <Home className="w-4 h-4 flex-shrink-0" />
                            {sidebarOpen && (
                                <span className="text-sm font-mono">
                                    Về Trang Chủ
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-red-500/70 hover:text-red-400 hover:bg-red-950/20 transition ${
                                sidebarOpen ? "" : "justify-center"
                            }`}
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            {sidebarOpen && (
                                <span className="text-sm font-mono">
                                    Đăng xuất
                                </span>
                            )}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[68px]"} flex flex-col`}
                >
                    {/* Top Bar */}
                    <div className="sticky top-0 z-50 h-12 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-neutral-800 flex items-center justify-between px-6 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-bold text-amber-500/60 uppercase tracking-widest">
                                {navigationItems.find((item) =>
                                    isActive(item.href),
                                )?.label || "Admin"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-neutral-600">
                                {user?.email}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">
                                <Shield className="h-2.5 w-2.5" />
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-6">{children}</div>
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
