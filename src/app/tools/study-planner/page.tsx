import { Metadata } from "next";
import { StudyPlannerTool } from "@/components/tools/study-planner/StudyPlannerTool";

export const metadata: Metadata = {
    title: "Study Planner AI - CodeMind",
    description:
        "Tạo kế hoạch học tập cá nhân hóa theo mục tiêu, thời gian và kỹ năng cần tập trung.",
};

export default function StudyPlannerPage() {
    return <StudyPlannerTool />;
}
