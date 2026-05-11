"use client";

import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Sparkles, TrendingUp, Trophy, Target, MessageSquare, BrainCircuit, LayoutGrid, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { label: "XP tuần này", value: "1,240", icon: Flame, tone: "text-orange-500" },
  { label: "Bài đã hoàn thành", value: "18", icon: CheckCircle2, tone: "text-emerald-500" },
  { label: "Streak", value: "7 ngày", icon: TrendingUp, tone: "text-cyan-500" },
  { label: "Chứng chỉ", value: "3", icon: Trophy, tone: "text-violet-500" },
];

const continueLearning = [
  { title: "React Patterns", progress: 72, href: "/courses/react-patterns", meta: "Còn 4 bài học", tag: "Hot" },
  { title: "Backend API Design", progress: 48, href: "/courses/backend-api-design", meta: "3 bài thực hành", tag: "New" },
  { title: "Git & GitHub Mastery", progress: 91, href: "/courses/git-github-mastery", meta: "Sắp hoàn thành", tag: "Finish" },
];

const quickActions = [
  { title: "Tạo kế hoạch học", href: "/tools/study-planner", desc: "Sinh roadmap ngắn gọn theo mục tiêu.", icon: BrainCircuit },
  { title: "Kiểm tra CV", href: "/tools/ats-analyzer", desc: "So sánh CV với job description.", icon: LayoutGrid },
  { title: "Chat với member", href: "/messages", desc: "Trao đổi nhanh, giữ ngữ cảnh hội thoại.", icon: MessageSquare },
  { title: "Khám phá tools", href: "/tools", desc: "Vào bộ công cụ hỗ trợ học và career.", icon: Zap },
];

const nextActions = [
  { title: "Làm bài tập còn dang dở", href: "/qa", desc: "Vào ngay các câu hỏi và bài tập cần xử lý." },
  { title: "Xem roadmap phù hợp", href: "/roadmap", desc: "Tìm bước tiếp theo thay vì học lan man." },
  { title: "Khám phá khóa học mới", href: "/courses", desc: "Ưu tiên nội dung hợp với tiến độ hiện tại." },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <motion.div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Sparkles className="h-3.5 w-3.5" />
                Learning command center
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">Tổng quan học tập cá nhân của bạn</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  Một nơi để xem tiến độ, tiếp tục học, nhận gợi ý tiếp theo và điều hướng nhanh tới các tác vụ quan trọng.
                </p>
              </div>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90">
              Đi học tiếp
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:bg-secondary/30 hover:shadow-lg">
                <item.icon className={`h-5 w-5 ${item.tone}`} />
                <p className="mt-4 text-2xl font-bold">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Continue learning</h2>
                  <p className="text-sm text-muted-foreground">Tiếp tục đúng chỗ bạn đang học.</p>
                </div>
                <div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  Cập nhật mới nhất
                </div>
              </div>
              <div className="grid gap-4">
                {continueLearning.map((item) => (
                  <div key={item.title} className="border border-border bg-background p-5 transition-colors hover:bg-secondary/20">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <span className="border border-border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item.tag}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
                      </div>
                      <Link href={item.href} className="text-sm font-medium text-foreground hover:opacity-70">Tiếp tục</Link>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden border border-border bg-secondary">
                      <div className="h-full bg-foreground" style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{item.progress}% hoàn thành</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-background p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Quick actions</h2>
                  <p className="text-sm text-muted-foreground">Đi tới các tính năng hay dùng nhất.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickActions.map((item) => (
                  <Link key={item.title} href={item.href} className="group border border-border p-4 transition-colors hover:bg-secondary/30">
                    <item.icon className="h-5 w-5 text-foreground" />
                    <p className="mt-3 font-medium group-hover:opacity-80">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-background p-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <h2 className="text-xl font-semibold">Next actions</h2>
              </div>
              <div className="mt-4 space-y-3">
                {nextActions.map((item) => (
                  <Link key={item.title} href={item.href} className="block border border-border p-4 transition-colors hover:bg-secondary/30">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-border bg-secondary/20 p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Smart tip</p>
              <p className="mt-3 text-sm leading-7 text-foreground">
                Nên ưu tiên bài học còn dở, sau đó quay lại quiz hoặc Q&A để củng cố kiến thức. Dashboard này là nơi điều hướng nhanh, không phải chỉ là trang xem số liệu.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/qa" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                  Vào Q&A
                </Link>
                <Link href="/roadmap" className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                  Xem roadmap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
