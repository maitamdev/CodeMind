"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Eye, EyeOff, Lock, Mail, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    const { login, isLoading } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            toast.success("Đăng nhập thành công");
            router.push(redirectTo);
        } catch (error: any) {
            toast.error(error?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative overflow-hidden border-r border-border bg-secondary/10 px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
                    <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-primary/15 blur-[120px]" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-foreground/10 blur-[120px]" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-10 py-6 lg:py-10">
                        <div className="max-w-xl space-y-6">
                            <span className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                                Secure access
                            </span>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                    Đăng nhập để tiếp tục học nhanh hơn
                                </h1>
                                <p className="max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                                    Quay lại đúng chỗ đang học, tiếp tục tiến độ, xem gợi ý cá nhân hóa và mở các công cụ hỗ trợ chỉ với một lần đăng nhập.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: ShieldCheck, title: "Bảo mật", desc: "Session flow + CSRF đã sẵn sàng." },
                                    { icon: BookOpen, title: "Tiếp tục nhanh", desc: "Dashboard, roadmap và courses chờ sẵn." },
                                    { icon: CheckCircle2, title: "Lưu tiến độ", desc: "Không mất ngữ cảnh học tập." },
                                    { icon: Zap, title: "Tối ưu thao tác", desc: "Ít bước hơn, đi vào việc chính nhanh hơn." },
                                ].map((item) => (
                                    <div key={item.title} className="border border-border bg-background p-5 transition-colors hover:bg-secondary/30">
                                        <item.icon className="h-5 w-5 text-foreground" />
                                        <h2 className="mt-4 text-sm font-semibold">{item.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                { label: "Nội dung", value: "Courses" },
                                { label: "Tiến độ", value: "Dashboard" },
                                { label: "Hỗ trợ", value: "AI / Tools" },
                            ].map((item) => (
                                <div key={item.label} className="border border-border bg-background p-4">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                    <div className="w-full max-w-lg rounded-[32px] border border-border bg-background p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Welcome back</p>
                                <h2 className="mt-2 text-2xl font-bold tracking-tight">Đăng nhập vào tài khoản</h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Truy cập dashboard, lịch học, tiến độ và các công cụ cá nhân.
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/30">
                                <Lock className="h-5 w-5" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Email</label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-semibold">Mật khẩu</label>
                                    <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                        className="w-full border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                                {!isLoading && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Hoặc</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <button className="inline-flex w-full items-center justify-center gap-2 border border-border bg-secondary/20 px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary">
                            <Sparkles className="h-4 w-4" />
                            Đăng nhập bằng tài khoản liên kết
                        </button>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Chưa có tài khoản?{" "}
                            <Link href="/auth/register" className="font-semibold text-foreground hover:opacity-70">
                                Tạo ngay
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
