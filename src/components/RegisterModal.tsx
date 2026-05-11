"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    UserCircle,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    Check,
    Sparkles,
    ShieldCheck,
    BadgeCheck,
    Star,
} from "lucide-react";
import Modal from "./Modal";
import RecoveryKeysModal from "./RecoveryKeysModal";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

const highlights = [
    { icon: ShieldCheck, title: "Hồ sơ riêng", desc: "Lưu dashboard, profile và message inbox." },
    { icon: BadgeCheck, title: "Công cụ mạnh", desc: "CV, planner, analyzer và workflow cá nhân." },
    { icon: Star, title: "Cá nhân hoá", desc: "Recommendation và tiến độ học riêng của bạn." },
];

export default function RegisterModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: RegisterModalProps) {
    const { register, isLoading } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        full_name: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recoveryKeys, setRecoveryKeys] = useState<string[]>([]);
    const [showRecoveryKeysModal, setShowRecoveryKeysModal] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);

        if (!formData.full_name || formData.full_name.trim().length < 2) return toast.error("Họ tên phải có ít nhất 2 ký tự");
        if (!formData.username || formData.username.trim().length < 3) return toast.error("Tên đăng nhập phải có ít nhất 3 ký tự");
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) return toast.error("Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới");
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Email không hợp lệ");
        if (formData.password.length < 8) return toast.error("Mật khẩu phải có ít nhất 8 ký tự");
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) return toast.error("Mật khẩu phải chứa chữ hoa, chữ thường và số");
        if (formData.password !== formData.confirmPassword) return toast.error("Mật khẩu xác nhận không khớp");
        if (!agreedTerms) return toast.error("Vui lòng đồng ý với điều khoản dịch vụ");

        try {
            const response = await register({
                email: formData.email,
                password: formData.password,
                username: formData.username,
                full_name: formData.full_name,
            });

            setSuccess(true);

            if (response?.data?.recoveryKeys && Array.isArray(response.data.recoveryKeys)) {
                setRecoveryKeys(response.data.recoveryKeys);
                setShowRecoveryKeysModal(true);
            } else {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                setTimeout(() => {
                    setFormData({ email: "", password: "", confirmPassword: "", username: "", full_name: "" });
                    setSuccess(false);
                    onClose();
                    onSwitchToLogin?.();
                }, 1500);
            }
        } catch (err: any) {
            toast.error(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitchToLogin = () => {
        onClose();
        onSwitchToLogin?.();
    };

    const handleRecoveryKeysModalClose = () => {
        setShowRecoveryKeysModal(false);
        setRecoveryKeys([]);
        setFormData({ email: "", password: "", confirmPassword: "", username: "", full_name: "" });
        setSuccess(false);
        onClose();
        onSwitchToLogin?.();
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
                            Join the platform
                        </div>
                        <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">Tạo tài khoản để mở toàn bộ tính năng</h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                            Từ CV Builder, Study Planner, ATS Analyzer đến chat và dashboard cá nhân — mọi thứ sẽ theo bạn trong một tài khoản.
                        </p>
                    </div>

                    <div className="relative z-10 rounded-none border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-white/55">
                            <span>$ onboarding preview</span>
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
{`const account = {
  profile: true,
  tools: ["cv", "planner", "chat"],
  ready: true
};

console.log("welcome", account.ready);`}</pre>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-3">
                        {[
                            { label: "Profile", value: "Ready" },
                            { label: "Tools", value: "8+" },
                            { label: "Speed", value: "Fast" },
                        ].map((item) => (
                            <div key={item.label} className="rounded-none border border-white/10 bg-white/5 p-3 text-center">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                                <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 space-y-3">
                        {highlights.map((item) => (
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
                            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Join now</p>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight">Đăng ký tài khoản mới</h2>
                        </div>
                        <div className="mb-8 flex items-center justify-between border-b border-border pb-4 lg:hidden">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Join now</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight">Đăng ký tài khoản mới</h2>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-border bg-foreground text-background">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Create account</p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Đăng ký tài khoản mới</h2>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">Chỉ vài bước là có ngay profile, dashboard và bộ công cụ cá nhân.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Họ và tên</label>
                                    <div className="relative">
                                        <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.full_name} onChange={handleChange} name="full_name" className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="Nguyễn Văn A" />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Username</label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.username} onChange={handleChange} name="username" className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="nguyenvana" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">Email</label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input value={formData.email} onChange={handleChange} name="email" type="email" className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="example@email.com" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.password} onChange={handleChange} name="password" type={showPassword ? "text" : "password"} className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input value={formData.confirmPassword} onChange={handleChange} name="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                                    </div>
                                </div>
                            </div>

                            <PasswordStrengthMeter password={formData.password} />

                            <button type="button" onClick={() => setAgreedTerms(!agreedTerms)} className="flex items-start gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                                <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border ${agreedTerms ? "border-foreground bg-foreground" : "border-border bg-background"}`}>
                                    {agreedTerms && <Check className="h-3 w-3 text-background" />}
                                </span>
                                <span>
                                    Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật.
                                </span>
                            </button>

                            <button disabled={isLoading || success} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                                {isLoading ? "Đang xử lý..." : success ? "Đã tạo tài khoản" : "Tạo tài khoản"}
                                {!isLoading && !success && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Đã có tài khoản?{" "}
                            <button type="button" onClick={handleSwitchToLogin} className="font-semibold text-foreground transition-colors hover:opacity-70">
                                Đăng nhập
                            </button>
                        </p>
                    </motion.div>
                </section>
            </div>

            <RecoveryKeysModal isOpen={showRecoveryKeysModal} onClose={handleRecoveryKeysModalClose} recoveryKeys={recoveryKeys} />
        </Modal>
    );
}
