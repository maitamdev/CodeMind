"use client";

import { ArrowRight, Clock3, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const continueItems = [
  {
    title: "Tiếp tục JavaScript nâng cao",
    progress: 68,
    subtitle: "Hoàn thành 12/18 bài học",
    href: "/learn/javascript-advanced",
  },
  {
    title: "Ôn tập React Patterns",
    progress: 42,
    subtitle: "3 bài tập chưa hoàn tất",
    href: "/learn/react-patterns",
  },
  {
    title: "Roadmap Frontend",
    progress: 81,
    subtitle: "Còn 2 mốc nữa để hoàn thành",
    href: "/roadmap/frontend",
  },
];

export default function ContinueLearningSection() {
  return (
    <section className="border-b border-border bg-secondary/10">
      <div className="px-4 py-16 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 md:py-20">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Continue learning
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Bật lại nhịp học bằng những việc còn dang dở
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground leading-7">
              Đây là section rất nên có để người dùng quay lại nhanh: xem bài học đang học, tiến độ hiện tại,
              và nút bấm để đi đúng chỗ ngay lập tức.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
            <Clock3 className="h-4 w-4" />
            Gợi ý từ trạng thái học tập
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {continueItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-border bg-background p-5 transition-colors hover:bg-secondary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <PlayCircle className="h-5 w-5 text-foreground" />
              </div>

              <div className="mt-5 h-2 w-full overflow-hidden border border-border bg-secondary">
                <div className="h-full bg-foreground" style={{ width: `${item.progress}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{item.progress}%</span>
                <span>Đang học</span>
              </div>

              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:opacity-70"
              >
                Tiếp tục ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
