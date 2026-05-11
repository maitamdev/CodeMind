"use client";

import { ArrowRight, BadgeCheck, Sparkles, Target, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const ctas = [
  { title: "Bắt đầu học ngay", href: "/courses", icon: Target },
  { title: "Tạo roadmap AI", href: "/roadmap/generate", icon: Sparkles },
  { title: "Vào dashboard", href: "/dashboard", icon: Trophy },
];

export default function HomepageCTASection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <motion.div className="mb-4 inline-flex items-center gap-2 border border-border bg-secondary/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <BadgeCheck className="h-3.5 w-3.5" />
              CTA thông minh
            </motion.div>
            <h2 className="text-2xl font-bold md:text-3xl">Đưa người học vào đúng hành động tiếp theo</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              CTA nên xuất hiện ở nhiều điểm chạm: hero, cuối trang chủ, dashboard, course detail và cả roadmap để giảm ma sát chuyển đổi.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Link key={cta.title} href={cta.href} className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90">
                <cta.icon className="h-4 w-4" />
                {cta.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
