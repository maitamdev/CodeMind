import { LucideIcon } from "lucide-react";

/* ── Catalog (main listing page) ── */
export interface RoadmapCatalogEntry {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    stats: { courses: number; duration: string; students: string };
    tags: string[];
    groups: string[];
    fit: string;
    badge: string;
}

/* ── Detail (overview page) ── */
export interface RoadmapDetail {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    totalDuration: string;
    totalCourses: number;
    totalStudents: string;
    difficulty: string;
    focusTags: string[];
    outcomes: string[];
    curriculum: {
        phase: string;
        title: string;
        description: string;
        topics: string[];
    }[];
    careerPaths: string[];
    faqs: { question: string; answer: string }[];
}

/* ── Flow (tree viewer) ── */
export interface RoadmapNode {
    id: string;
    title: string;
    description: string;
    type: "core" | "optional" | "beginner" | "alternative";
    status: "available" | "completed" | "current" | "locked";
    duration?: string;
    technologies?: string[];
    difficulty?: "Cơ bản" | "Trung cấp" | "Nâng cao";
    children?: RoadmapNode[];
}

export interface RoadmapFlowData {
    title: string;
    data: RoadmapNode;
}

/* ── Combined export shape per roadmap ── */
export interface RoadmapModule {
    catalog: RoadmapCatalogEntry;
    detail: RoadmapDetail;
    flow: RoadmapFlowData;
}
