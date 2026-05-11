"use client";

import { BrainCircuit, CalendarDays, ClipboardList, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  { icon: BrainCircuit, title: "Chẩn đoán hiện tại", desc: "Xác định trình độ, mục tiêu và khoảng trống kỹ năng." },
  { icon: ClipboardList, title: "Roadmap riêng", desc: "Sinh thứ tự học phù hợp theo năng lực và mục tiêu." },
  { icon: CalendarDays, title: "Lịch học nhẹ", desc: "Bám vào lịch cá nhân để giữ nhịp đều đặn." },
  { icon: TrendingUp, title: "Theo dõi tiến bộ", desc: "Hiển thị mốc hoàn thành, streak và next best action." },
];

export default function PersonalizedLearningSection() {
  return (
    <section className="border-b border-border bg-secondary/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <motion.div className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Sparkles className="h-3.5 w-3.5" />
              Học cá nhân hóa
            </motion.div>
            <h2 className="text-2xl font-bold md:text-3xl">Nên có một luồng học thích ứng với từng người dùng</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Đây là một trong những upgrade có giá trị nhất: thay vì tự mò, người học được hướng dẫn đúng chỗ, đúng lúc, đúng tốc độ.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((item, index) => (
              <motion.div key={item.title} className="border border-border bg-background p-5 transition-colors hover:bg-secondary/30" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <item.icon className="h-5 w-5 text-foreground" />
                <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
