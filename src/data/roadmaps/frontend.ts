import { Layout } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "frontend",
    title: "Front-end Developer",
    description: "Tập trung vào giao diện, trải nghiệm người dùng và các công nghệ web hiện đại.",
    icon: Layout,
    stats: { courses: 8, duration: "8-12 tháng", students: "45k+" },
    tags: ["React", "Next.js", "Tailwind"],
    groups: ["role-based", "web"],
    fit: "Phù hợp nếu bạn muốn đi từ HTML/CSS đến SPA, SSR và UI system.",
    badge: "PHỔ BIẾN",
};

export const detail: RoadmapDetail = {
    id: "frontend",
    title: "Lộ trình Front-end Developer",
    subtitle: "Xây nền tảng vững cho giao diện web hiện đại.",
    description: "Roadmap này đi từ nền tảng web, JavaScript, package manager đến framework UI hiện đại và workflow phát triển thực tế.",
    totalDuration: "8-12 tháng",
    totalCourses: 8,
    totalStudents: "45k+",
    difficulty: "Cơ bản đến trung cấp",
    focusTags: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    outcomes: [
        "Nắm cách web hoạt động, HTTP, DNS và browser rendering.",
        "Viết giao diện responsive với HTML, CSS và hệ thống component.",
        "Làm việc với JavaScript hiện đại, state và API bất đồng bộ.",
        "Tiếp cận React, Next.js và quy trình build/deploy cơ bản.",
    ],
    curriculum: [
        { phase: "01", title: "Nền tảng web", description: "Bắt đầu từ internet, HTTP, browser và cấu trúc HTML semantic.", topics: ["Internet", "HTTP", "Browser", "HTML semantics"] },
        { phase: "02", title: "Ngôn ngữ giao diện", description: "Làm chủ CSS layout, responsive patterns và JavaScript core.", topics: ["CSS layout", "Responsive", "DOM", "ES6+"] },
        { phase: "03", title: "Framework và workflow", description: "Bước vào React ecosystem, package manager và tooling cơ bản.", topics: ["npm", "Tailwind", "React", "Next.js"] },
    ],
    careerPaths: ["Front-end Developer", "UI Engineer", "React Developer", "Full-stack Developer"],
    faqs: [
        { question: "Không có nền tảng CNTT có bắt đầu được không?", answer: "Có. Roadmap này đi từ kiến thức nền rất cơ bản trước khi tiến vào framework." },
        { question: "Bao lâu thì có thể đi làm?", answer: "Nếu học đều 2-3 giờ mỗi ngày, một chu kỳ 6-8 tháng có thể đủ để đạt mức junior cho phần front-end cơ bản." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình Front-end Developer",
    data: {
        id: "frontend-root",
        title: "Front-end Development",
        description: "Web Development",
        type: "core",
        status: "available",
        children: [
            {
                id: "internet", title: "Internet", description: "How does the internet work?", type: "core", status: "completed", duration: "1 week",
                children: [
                    { id: "how-internet-works", title: "How does the internet work?", description: "Understanding the fundamentals of internet", type: "beginner", status: "completed", duration: "2 days" },
                    { id: "what-is-http", title: "What is HTTP?", description: "HTTP protocol basics", type: "beginner", status: "completed", duration: "1 day" },
                    { id: "domain-name", title: "What is Domain Name?", description: "Domain names and DNS", type: "beginner", status: "completed", duration: "1 day" },
                    { id: "hosting", title: "What is hosting?", description: "Web hosting concepts", type: "beginner", status: "current", duration: "1 day" },
                    { id: "dns", title: "DNS and how it works?", description: "Domain Name System", type: "beginner", status: "available", duration: "2 days" },
                    { id: "browsers", title: "Browsers and how they work?", description: "Web browsers fundamentals", type: "beginner", status: "available", duration: "1 day" },
                ],
            },
            {
                id: "html-css-js", title: "HTML, CSS & JavaScript", description: "Core web technologies", type: "core", status: "current",
                children: [
                    { id: "html", title: "HTML", description: "HyperText Markup Language", type: "core", status: "completed", duration: "2 weeks", technologies: ["HTML5", "Semantic HTML"] },
                    { id: "css", title: "CSS", description: "Cascading Style Sheets", type: "core", status: "completed", duration: "3 weeks", technologies: ["CSS3", "Flexbox", "Grid"] },
                    { id: "javascript", title: "JavaScript", description: "Programming language for web", type: "core", status: "current", duration: "4 weeks", technologies: ["ES6+", "DOM", "Async/Await"] },
                ],
            },
            {
                id: "package-managers", title: "Package Managers", description: "Dependency management", type: "optional", status: "available",
                children: [
                    { id: "npm", title: "npm", description: "Node Package Manager", type: "optional", status: "available", duration: "1 week", technologies: ["npm", "package.json"] },
                    { id: "yarn", title: "yarn", description: "Alternative package manager", type: "alternative", status: "available", duration: "1 week", technologies: ["yarn", "yarn.lock"] },
                ],
            },
            {
                id: "version-control", title: "Version Control", description: "Git and GitHub", type: "core", status: "available",
                children: [
                    { id: "git-basics", title: "Git Basics", description: "Version control fundamentals", type: "core", status: "available", duration: "1 week", technologies: ["Git", "GitHub"] },
                ],
            },
            {
                id: "css-frameworks", title: "CSS Frameworks", description: "CSS libraries and frameworks", type: "optional", status: "available",
                children: [
                    { id: "tailwind", title: "Tailwind CSS", description: "Utility-first CSS framework", type: "optional", status: "available", duration: "2 weeks", technologies: ["Tailwind CSS", "Utility classes"] },
                    { id: "bootstrap", title: "Bootstrap", description: "Popular CSS framework", type: "alternative", status: "available", duration: "2 weeks", technologies: ["Bootstrap", "Components"] },
                ],
            },
            {
                id: "javascript-frameworks", title: "JavaScript Frameworks", description: "Modern JS frameworks", type: "core", status: "available",
                children: [
                    { id: "react", title: "React", description: "Component-based UI library", type: "core", status: "available", duration: "6 weeks", technologies: ["React", "JSX", "Hooks", "Context"] },
                    { id: "vue", title: "Vue.js", description: "Progressive JS framework", type: "alternative", status: "available", duration: "5 weeks", technologies: ["Vue.js", "Vue CLI", "Composition API"] },
                    { id: "angular", title: "Angular", description: "Full-featured framework", type: "alternative", status: "available", duration: "8 weeks", technologies: ["Angular", "TypeScript", "RxJS"] },
                ],
            },
        ],
    },
};
