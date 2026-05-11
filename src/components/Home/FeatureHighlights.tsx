"use client";

import { BookOpen, BrainCircuit, Rocket, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: BrainCircuit,
    title: "AI học tập cá nhân hóa",
    description: "Gợi ý lộ trình, giải thích lỗi, và hỗ trợ luyện tập theo trình độ của bạn.",
  },
  {
    icon: Rocket,
    title: "Học nhanh hơn với dự án thực tế",
    description: "Mỗi khóa học đi kèm bài tập, sandbox và checklist để hoàn thiện portfolio.",
  },
  {
    icon: ShieldCheck,
    title: "Nền tảng ổn định hơn",
    description: "Các luồng đăng ký, học bài, lưu tiến độ và đánh giá được tối ưu cho trải nghiệm mượt hơn.",
  },
  {
    icon: Trophy,
    title: "Gamification rõ ràng",
    description: "XP, streak, badge và leaderboard giúp duy trì động lực học đều đặn.",
  },
];

const metrics = [
  { label: "AI hỗ trợ", value: "24/7" },
  { label: "Tiến độ", value: "Rõ ràng" },
  { label: "Portfolio", value: "Thực chiến" },
];

const steps = [
  "Khám phá khóa học phù hợp",
  "Học và thực hành ngay trên nền tảng",
  "Hoàn thành bài tập, nhận XP và chứng chỉ",
];

export default function FeatureHighlights() {
  return (
    <section className="border-y border-border bg-secondary/20">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Nâng cấp trải nghiệm
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Thêm các điểm nhấn để nền tảng trông hiện đại và hữu ích hơn
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Mình đã thêm một khối giới thiệu ngắn để làm rõ giá trị cốt lõi của nền tảng: học bằng AI,
              thực hành nhanh, tiến độ rõ ràng và động lực học tập tốt hơn.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metrics.map((item) => (
                <div key={item.label} className="border border-border bg-background p-4 transition-colors hover:bg-secondary/40">
                  <p className="font-mono text-base font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3 }}
                  className="border border-border bg-background p-5"
                >
                  <item.icon className="mb-3 h-5 w-5 text-foreground" />
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-background p-6 md:p-7">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Lộ trình học nhanh
              </h3>
            </div>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center border border-border bg-secondary text-xs font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{step}</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Tối ưu để người mới có thể bắt đầu ngay, không bị quá tải.
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
