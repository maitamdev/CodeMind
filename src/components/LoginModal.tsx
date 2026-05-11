"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    Check,
    ShieldCheck,
    BookOpen,
    Zap,
} from "lucide-react";
import Modal from "./Modal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister?: () => void;
}

const perks = [
    { icon: ShieldCheck, title: "Bảo mật", desc: "Đăng nhập bằng session an toàn." },
    { icon: BookOpen, title: "Tiếp tục học", desc: "Quay lại đúng tiến độ đang dang dở." },
    { icon: Zap, title: "Nhanh", desc: "Ít bước, tập trung vào hành động chính." },
];

const stats = [
    { label: "Progress", value: "72%" },
    { label: "Streak", value: "7d" },
    { label: "Tools", value: "8+" },
];

export default function LoginModal({
    isOpen,
    onClose,
    onSwitchToRegister,
}: LoginModalProps) {
    const { login, isLoading } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            await login(formData.email, formData.password);
            toast.success("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
            onClose();
            setFormData({ email: "", password: "" });
        } catch (err: any) {
            const errorMessage = err.message || "Đăng nhập thất bại. Vui lòng thử lại.";
            toast.error(errorMessage);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitchToRegister = () => {
        onClose();
        if (onSwitchToRegister) onSwitchToRegister();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl" showCloseButton={true} closeOnBackdropClick={true} className="overflow-hidden rounded-none !max-w-[96vw] !w-[96vw] max-h-[88vh] mx-auto" contentClassName="!p-0">
            <div className="grid min-h-[88vh] lg:grid-cols-[1.45fr_0.95fr]">
                <aside className="relative hidden overflow-hidden bg-neutral-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.45), transparent 22%), radial-gradient(circle at 80% 18%, rgba(59,130,246,0.35), transparent 18%), radial-gradient(circle at 55% 82%, rgba(16,185,129,0.18), transparent 18%)" }} />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400" />
                    <div className="relative z-10">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-none border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-white/75">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI & IoT Learning
                        </div>
                        <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">
                            Đăng nhập để vào đúng chỗ bạn đang học.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                            Quay lại dashboard, tiếp tục bài học, vào Q&A, chat với member và dùng toàn bộ công cụ cá nhân hoá.
                        </p>
                    </div>

                    <div className="relative z-10 rounded-none border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-white/55">
                            <span>$ session preview</span>
                            <span>live</span>
                        </div>
                        <div className="overflow-hidden border border-white/10 bg-[#0b1020] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_-30px_rgba(0,0,0,0.75)]">
                            <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                <div className="ml-3 h-1.5 flex-1 bg-white/10" />
                            </div>
                            <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-cyan-100">
{`const session = {
  user: "you",
  progress: 72,
  focus: "finish roadmap",
  nextAction: "continue learning"
};

console.log(session.nextAction);`}</pre>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-3">
                        {stats.map((item) => (
                            <div key={item.label} className="rounded-none border border-white/10 bg-white/5 p-3 text-center">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                                <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 space-y-3">
                        {perks.map((item) => (
                            <div key={item.title} className="flex items-start gap-3 rounded-none border border-white/10 bg-white/5 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-white/10 bg-white/8">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-white/70">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <section className="bg-background p-5 sm:p-6 lg:p-8 overflow-hidden">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex h-full max-w-md flex-col justify-center overflow-hidden lg:pt-2">
                        <div className="mb-6 hidden border-b border-border pb-4 lg:block">
                            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Continue where you left off</p>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight">Chào mừng trở lại</h2>
                        </div>
                        <div className="mb-8 flex items-center justify-between border-b border-border pb-4 lg:hidden">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Continue where you left off</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight">Chào mừng trở lại</h2>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-border bg-foreground text-background">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-none border border-border bg-foreground text-background">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">AI & IoT Learning</p>
                                <h2 className="text-2xl font-bold tracking-tight">Chào mừng trở lại</h2>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Welcome back</p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Chào mừng trở lại</h2>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                Đăng nhập để tiếp tục hành trình học tập và sản phẩm cá nhân của bạn.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-foreground">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        id="login-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                        className="w-full rounded-none border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label htmlFor="login-password" className="block text-sm font-semibold text-foreground">
                                        Mật khẩu
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPasswordOpen(true)}
                                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="login-password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        data-1p-ignore
                                        data-lpignore="true"
                                        required
                                        className="w-full rounded-none border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <span className={`flex h-4 w-4 items-center justify-center rounded-none border ${rememberMe ? "border-foreground bg-foreground" : "border-border bg-background"}`}>
                                    {rememberMe && <Check className="h-3 w-3 text-background" />}
                                </span>
                                Ghi nhớ đăng nhập
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-foreground bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Đăng nhập</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-border pt-6">
                            <p className="text-center text-sm text-muted-foreground">
                                Chưa có tài khoản?{" "}
                                <button
                                    type="button"
                                    onClick={handleSwitchToRegister}
                                    className="font-semibold text-foreground transition-colors hover:opacity-70"
                                >
                                    Đăng ký ngay
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </section>
            </div>

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </Modal>
    );
}
