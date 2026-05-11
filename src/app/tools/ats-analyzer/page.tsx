import { Metadata } from "next";
import { ATSAnalyzerTool } from "@/components/tools/ats-analyzer/ATSAnalyzerTool";

export const metadata: Metadata = {
    title: "ATS CV Analyzer - CodeMind",
    description:
        "Phân tích mức độ phù hợp giữa CV và mô tả công việc, gợi ý cách tối ưu CV nhanh hơn.",
};

export default function ATSAnalyzerPage() {
    return <ATSAnalyzerTool />;
}
