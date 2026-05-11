"use client";

import { CheckCircle2, Clock3, GraduationCap, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";

const checklist = [
  {
    icon: Target,
    title: "Chọn mục tiêu học rõ ràng",
    description: "Người dùng chọn kỹ năng muốn học để hệ thống gợi ý course và roadmap phù hợp.",
  },
  {
    icon: Clock3,
    title: "Lên kế hoạch theo tuần",
    description: "Tự động chia nhỏ lộ trình học để dễ duy trì tiến độ, không bị quá tải.",
  },
  {
    icon: CheckCircle2,
    title: "Hoàn thành bài học & bài tập",
    description: "Tăng tương tác bằng checklist, XP và trạng thái hoàn thành ngay trên dashboard.",
  },
];

const benefits = [
  "Giao diện gọn hơn, dễ hiểu hơn",
  "Thêm điểm nhấn cho trang chủ",
  "Giúp người dùng nhìn thấy lộ trình học ngay từ đầu",
];

const steps = [
  "Chọn mục tiêu học",
  "Xem gợi ý lộ trình",
  "Bắt đầu học ngay",
];

const stats = [
  { label: "Cá nhân hóa", value: "AI" },
  { label: "Thời gian khởi động", value: "30s" },
  { label: "Mục tiêu", value: "Rõ ràng" },
];

export default function LaunchChecklistSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-secondary/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Tính năng mới
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Bổ sung khu vực khởi động nhanh cho người học mới
            </h2>
            <p className="text-muted-foreground leading-7 max-w-xl">
              Mình thêm một khối dẫn dắt trực quan để người dùng mới hiểu ngay: chọn mục tiêu,
              học theo tuần và hoàn thành bài học theo lộ trình rõ ràng.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="border border-border bg-background p-4 transition-colors hover:bg-secondary/40">
                  <p className="font-mono text-base font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="border border-border bg-secondary/10 p-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">0{index + 1}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-border bg-secondary/20 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Lợi ích chính
                </h3>
              </div>
              <ul className="space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {checklist.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-border bg-background p-5 md:p-6"
              >
                <item.icon className="mb-4 h-5 w-5 text-foreground" />
                <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
