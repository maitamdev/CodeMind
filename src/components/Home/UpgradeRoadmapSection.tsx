"use client";

import { ArrowRight, CheckCircle2, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const upgrades = [
  {
    icon: LayoutGrid,
    title: "Bố cục rõ ràng hơn",
    description: "Tách nội dung thành từng khối dễ đọc để người dùng hiểu giá trị ngay từ trang chủ.",
  },
  {
    icon: Wand2,
    title: "Thêm tính năng mới",
    description: "Preview lộ trình học nhanh giúp nền tảng trông hữu ích hơn và dẫn dắt người dùng tốt hơn.",
  },
  {
    icon: CheckCircle2,
    title: "Định hướng hoàn thiện",
    description: "Tối ưu theo hướng mượt, sạch và hiện đại thay vì nhồi quá nhiều thông tin cùng lúc.",
  },
];

const upgradeMilestones = [
  "Hero có search nhanh và CTA rõ ràng",
  "Courses có tìm kiếm + lọc nhanh",
  "Checklist khởi động giúp người mới dễ bắt đầu",
  "Roadmap nâng cấp để định hướng phát triển tiếp theo",
];

const roadmapSteps = [
  "Tối ưu hero + search flow",
  "Làm mới section khóa học",
  "Hoàn thiện trải nghiệm mobile",
];

export default function UpgradeRoadmapSection() {
  return (
    <section className="border-y border-border bg-secondary/10">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[90px] 2xl:px-16 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="mb-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Nâng cấp giao diện
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Mình đã thêm một lớp nội dung mới để trang chủ xịn hơn
            </h2>
            <p className="max-w-2xl text-muted-foreground leading-7">
              Phần này giúp người xem thấy ngay dự án đang được cải thiện theo hướng rõ ràng,
              hiện đại và tập trung vào trải nghiệm học tập thực tế.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {roadmapSteps.map((step, index) => (
                <div key={step} className="border border-border bg-background p-4 transition-colors hover:bg-secondary/40">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
              >
                Xem khóa học
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Xem roadmap
              </Link>
            </div>

            <div className="mt-8 border border-border bg-background p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Những gì đã được cải thiện
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {upgradeMilestones.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 h-2 w-2 shrink-0 bg-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:pl-4">
            {upgrades.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-border bg-background p-5"
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
