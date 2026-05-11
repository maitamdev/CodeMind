"use client";

import { Sun, Moon, User, LogOut, Settings, Shield, LayoutDashboard, Search, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { usePathname, useRouter } from "next/navigation";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import AvatarWithProBadge from "./AvatarWithProBadge";
import { getCanonicalProfilePath, normalizeUsername } from "@/lib/profile-url";
import Logo from "./Logo";
import { openCommandPalette } from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const normalizedUsername = normalizeUsername(user?.username);
  const profileHref = getCanonicalProfilePath(normalizedUsername);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    toast.success("Đăng xuất thành công! Hẹn gặp lại bạn.");
    router.push("/");
    router.refresh();
  };

  const displayName = user?.full_name || user?.username || "Học viên";
  const isAdmin = user?.primaryRole === "admin" || user?.roles?.includes("admin");

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between gap-3 px-4 md:px-[28px]">
        <div className="flex items-center gap-3 flex-shrink-0 z-10">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 z-10">
          <button
            onClick={() => openCommandPalette()}
            className="hidden md:inline-flex items-center gap-2 h-9 px-3 border border-border rounded-none bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Mở tìm kiếm nhanh"
            title="Mở tìm kiếm nhanh (⌘K)"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Tìm kiếm</span>
            <kbd className="ml-1 hidden lg:inline-flex items-center gap-0.5 rounded-none border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => openCommandPalette()}
            className="md:hidden p-2 border border-border rounded-none hover:bg-secondary text-foreground transition-colors"
            aria-label="Mở tìm kiếm nhanh"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link href="/messages" className="p-2 border border-border rounded-none hover:bg-secondary text-foreground transition-colors relative" aria-label="Messages">
            <MessageSquare className="h-4 w-4" />
          </Link>

          <NotificationCenter />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 border border-border rounded-none hover:bg-secondary text-foreground transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 border border-border rounded-none hover:bg-secondary transition-colors"
                  >
                    <AvatarWithProBadge
                      avatarUrl={user?.avatar_url}
                      fullName={displayName}
                      size="sm"
                      isPro={user?.membership_type === "PRO"}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 border border-border bg-background p-1 shadow-xl z-50"
                      >
                        <div className="mb-1 border-b border-border px-3 py-2">
                          <p className="flex items-center gap-1 truncate text-sm font-bold text-foreground">
                            {displayName}
                            {isAdmin && <Shield className="h-3.5 w-3.5 text-amber-500" />}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>

                        {isAdmin && (
                          <Link href="/admin" className="mb-1 flex items-center gap-2 border-b border-border px-3 py-2 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/20" onClick={() => setShowUserMenu(false)}>
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link href={profileHref} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary" onClick={() => setShowUserMenu(false)}>
                          <User className="h-4 w-4" />
                          Trang cá nhân
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary" onClick={() => setShowUserMenu(false)}>
                          <Settings className="h-4 w-4" />
                          Cài đặt
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20">
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowLoginModal(true)} className="px-4 py-2 text-sm font-mono font-bold text-foreground hover:bg-secondary border border-border transition-colors">
                    Login
                  </button>
                  <button onClick={() => setShowRegisterModal(true)} className="px-4 py-2 text-sm font-mono font-bold bg-foreground text-background hover:opacity-90 border border-foreground transition-all">
                    Join
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
}
