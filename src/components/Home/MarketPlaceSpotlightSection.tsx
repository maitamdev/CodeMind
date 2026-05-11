"use client";

import { ArrowRight, BadgeCheck, Clock3, Eye, Sparkles, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { icon: Users, label: "Học viên", value: "12k+" },
  { icon: Star, label: "Đánh giá", value: "4.8/5" },
  { icon: Clock3, label: "Thời lượng", value: "30-90h" },
  { icon: BadgeCheck, label: "Hoàn thành", value: "Dễ theo dõi" },
];

const collections = ["Frontend Roadmap", "Backend Mastery", "AI & Automation", "Interview Prep"];

export default function MarketPlaceSpotlightSection() {
  return (
    <section className="border-b border-border bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <motion.div className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Sparkles className="h-3.5 w-3.5" />
              Marketplace spotlight
            </motion.div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">Course marketplace nên đủ tin cậy để người học quyết định nhanh</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Tăng độ tin cậy bằng rating, students, giảng viên, bộ lọc, và preview ngắn trước khi vào trang chi tiết.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {collections.map((item) => (
                <span key={item} className="border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">{item}</span>
              ))}
            </div>
            <Link href="/courses" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70">
              Mở marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item, index) => (
              <motion.div key={item.label} className="border border-border bg-background p-5 transition-colors hover:bg-secondary/30" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <item.icon className="mb-4 h-5 w-5 text-foreground" />
                <p className="text-lg font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
