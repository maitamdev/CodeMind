"use client";

import { ArrowRight, BookOpenText, CheckCircle2, Medal, Sparkles, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const journey = [
  {
    icon: Target,
    title: "Xác định mục tiêu",
    description: "Chọn kỹ năng, lĩnh vực, hoặc nghề nghiệp bạn muốn theo đuổi.",
  },
  {
    icon: BookOpenText,
    title: "Học theo lộ trình",
    description: "Hệ thống đưa ra checklist và thứ tự bài học tối ưu để tránh học lan man.",
  },
  {
    icon: TrendingUp,
    title: "Theo dõi tiến bộ",
    description: "Progress, streak, XP và badge luôn hiển thị rõ để bạn thấy mình đang tiến lên.",
  },
  {
    icon: Medal,
    title: "Hoàn thành và công nhận",
    description: "Chứng chỉ, thành tích, và hồ sơ cá nhân giúp kết quả học tập có giá trị thực tế.",
  },
];

const upgrades = [
  "Rút ngắn thời gian tìm nội dung phù hợp",
  "Tăng tỷ lệ hoàn thành khóa học",
  "Giữ nhịp học đều hơn",
  "Đưa kết quả học vào hồ sơ và chứng chỉ",
];

export default function LearningJourneySection() {
  return (
    <section className="border-b border-border bg-secondary/10">
      <div className="px-4 py-16 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Luồng sản phẩm nên có
            </motion.div>
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Một nền tảng học tốt phải dẫn dắt người dùng từ bước đầu đến kết quả cuối
            </h2>
            <p className="max-w-2xl text-muted-foreground leading-7">
              Nếu chỉ có danh sách khóa học thì chưa đủ. Nên có luồng học tập rõ ràng, dashboard tiến độ,
              và hành động tiếp theo được gợi ý tự động để người học không bị đứng lại.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {journey.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border border-border bg-background p-5 transition-colors hover:bg-secondary/30"
                >
                  <item.icon className="mb-4 h-5 w-5 text-foreground" />
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-background p-6 md:p-7">
            <div className="mb-5 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Tác động lên sản phẩm
              </h3>
            </div>

            <div className="space-y-3">
              {upgrades.map((item) => (
                <div key={item} className="flex items-start gap-3 border border-border bg-secondary/20 p-4">
                  <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-border bg-background p-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                Gợi ý tiếp theo
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Nên bổ sung widget "Continue learning", danh sách việc cần làm hôm nay và đề xuất bài học kế tiếp
                ngay trong dashboard cá nhân.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
              >
                Xem hồ sơ học tập
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Đi tới dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
