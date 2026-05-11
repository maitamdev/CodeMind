"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Eye, EyeOff, Lock, Mail, Sparkles, User, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const toast = useToast();
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await register({
                full_name: formData.full_name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            setSuccess(true);
            toast.success("Đăng ký thành công, bạn có thể đăng nhập ngay.");
            setTimeout(() => router.push("/auth/login"), 1000);
        } catch (error: any) {
            toast.error(error?.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="grid min-h-screen lg:grid-cols-[1fr_0.95fr]">
                <section className="relative overflow-hidden border-r border-border bg-secondary/10 px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
                    <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-foreground/10 blur-[120px]" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-10 py-6 lg:py-10">
                        <div className="max-w-xl space-y-6">
                            <span className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                                Create account
                            </span>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                    Tạo tài khoản để mở toàn bộ hệ sinh thái
                                </h1>
                                <p className="max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                                    Tài khoản mới giúp bạn lưu tiến độ, tạo CV, dùng tools, chat với member và nhận recommendation cá nhân hóa.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: BadgeCheck, title: "Hồ sơ cá nhân", desc: "Profile, stats và progress được giữ lại." },
                                    { icon: CheckCircle2, title: "Công cụ đi kèm", desc: "CV, planner, analyzer và more." },
                                    { icon: UserCircle, title: "Không gian riêng", desc: "Dashboard và message inbox của bạn." },
                                    { icon: Sparkles, title: "Nhanh hơn", desc: "Onboard ít bước, vào dùng ngay." },
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
                                { label: "CV", value: "Builder" },
                                { label: "Kế hoạch", value: "Planner" },
                                { label: "Phản hồi", value: "Q&A" },
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
                    <div className="w-full max-w-xl rounded-[32px] border border-border bg-background p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Start here</p>
                                <h2 className="mt-2 text-2xl font-bold tracking-tight">Đăng ký tài khoản mới</h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Chỉ vài bước là có ngay profile, dashboard và bộ công cụ cá nhân.
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/30">
                                <User className="h-5 w-5" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Họ và tên</label>
                                    <div className="relative">
                                        <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.full_name} onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))} className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="Nguyễn Văn A" />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Username</label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="nguyenvana" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Email</label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} type="email" className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="name@example.com" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} type={showPassword ? "text" : "password"} className="w-full border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.confirmPassword} onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))} type={showConfirmPassword ? "text" : "password"} className="w-full border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                    </div>
                                </div>
                            </div>

                            <button disabled={isLoading || success} className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                                {isLoading ? "Đang xử lý..." : success ? "Đã tạo tài khoản" : "Tạo tài khoản"}
                                {!isLoading && !success && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Đã có tài khoản?{" "}
                            <Link href="/auth/login" className="font-semibold text-foreground hover:opacity-70">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
