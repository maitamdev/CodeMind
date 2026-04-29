"use client";

import { Sun, Moon, User, LogOut, FileText, Bookmark, Settings, CheckCircle2, Shield, LayoutDashboard, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
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
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside and set mounted
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    toast.success("Đăng xuất thành công! Hẹn gặp lại bạn.");
    router.push('/');
    router.refresh();
  };

  const displayName = user?.full_name || user?.username || "Học viên";
  const isAdmin = user?.primaryRole === 'admin' || user?.roles?.includes('admin');

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-border">
      <div className="mx-auto px-4 md:px-[28px] h-[66px] flex items-center justify-between gap-2 relative">
        {/* Logo Section */}
        <div className="flex items-center gap-3 flex-shrink-0 z-10">
          <Logo size="md" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0 z-10">

          {/* Command Palette Trigger */}
          <button
            onClick={() => openCommandPalette()}
            className="hidden md:inline-flex items-center gap-2 h-9 px-2.5 border border-border rounded-md bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Mở tìm kiếm nhanh"
            title="Mở tìm kiếm nhanh (⌘K)"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Tìm kiếm</span>
            <kbd className="ml-1 hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
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

          {/* Notifications */}
          <NotificationCenter />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-border rounded-none hover:bg-secondary text-foreground transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                      isPro={user?.membership_type === 'PRO'}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-background border border-border shadow-xl z-50 p-1"
                      >
                        <div className="px-3 py-2 border-b border-border mb-1">
                          <p className="text-sm font-bold text-foreground truncate flex items-center gap-1">
                            {displayName}
                            {isAdmin && <Shield className="h-3.5 w-3.5 text-amber-500" />}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">
                              <Shield className="h-2.5 w-2.5" />
                              Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors border-b border-border mb-1"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          href={profileHref}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Trang cá nhân
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Cài đặt
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 text-sm font-mono font-bold text-foreground hover:bg-secondary border border-border transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 text-sm font-mono font-bold bg-foreground text-background hover:opacity-90 border border-foreground transition-all"
                  >
                    Join
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </header>
  );
}
