import { Server } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "backend",
    title: "Back-end Developer",
    description: "Đi sâu vào API, dữ liệu, xác thực và vận hành dịch vụ phía server.",
    icon: Server,
    stats: { courses: 10, duration: "10-15 tháng", students: "32k+" },
    tags: ["Node.js", "MySQL", "Microservices"],
    groups: ["role-based", "web"],
    fit: "Phù hợp nếu bạn thích logic hệ thống, hiệu năng và làm việc với dữ liệu.",
    badge: "NỀN TẢNG",
};

export const detail: RoadmapDetail = {
    id: "backend",
    title: "Lộ trình Back-end Developer",
    subtitle: "Đi sâu vào API, dữ liệu và kiến trúc dịch vụ.",
    description: "Roadmap này tập trung vào ngôn ngữ server-side, database, API, xác thực và nền tảng system design.",
    totalDuration: "10-15 tháng",
    totalCourses: 10,
    totalStudents: "32k+",
    difficulty: "Trung cấp",
    focusTags: ["Node.js", "Database", "REST", "Auth", "System Design"],
    outcomes: [
        "Hiểu cách dữ liệu được lưu trữ, truy vấn và tối ưu.",
        "Thiết kế API, xác thực người dùng và bảo vệ đầu vào.",
        "Nắm các khối backend nền tảng như cache, queue và scaling.",
        "Bước đầu tiếp cận vận hành dịch vụ ở môi trường production.",
    ],
    curriculum: [
        { phase: "01", title: "Ngôn ngữ và runtime", description: "Chọn ngôn ngữ chính và làm chủ flow xử lý trên server.", topics: ["Node.js", "Java", "Python", "Go"] },
        { phase: "02", title: "Database và API", description: "Làm việc với SQL/NoSQL và thiết kế RESTful API.", topics: ["SQL", "MongoDB", "REST", "Validation"] },
        { phase: "03", title: "Auth và hệ thống", description: "Xây lớp xác thực, phân quyền và nền tảng mở rộng hệ thống.", topics: ["JWT", "OAuth", "Caching", "Microservices"] },
    ],
    careerPaths: ["Back-end Developer", "Platform Engineer", "API Engineer", "System Architect"],
    faqs: [
        { question: "Có nên học Node.js đầu tiên không?", answer: "Nếu bạn muốn kết nối nhanh với full-stack hoặc đã biết JavaScript thì Node.js là điểm bắt đầu rất hợp lý." },
        { question: "Backend cần giỏi thuật toán tới mức nào?", answer: "Mức nền tảng là đủ để bắt đầu. Điều quan trọng hơn giai đoạn đầu là hiểu dữ liệu, API và mô hình hệ thống." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình Back-end Developer",
    data: {
        id: "backend-root", title: "Back-end Development", description: "Server-side Development", type: "core", status: "available",
        children: [
            {
                id: "internet-basics", title: "Internet Basics", description: "Understanding web fundamentals", type: "core", status: "completed", duration: "1 week",
                children: [
                    { id: "how-internet-works-backend", title: "How does internet work?", description: "Network fundamentals", type: "beginner", status: "completed", duration: "2 days" },
                    { id: "http-https", title: "HTTP/HTTPS", description: "Web protocols", type: "beginner", status: "completed", duration: "1 day" },
                ],
            },
            {
                id: "programming-language", title: "Programming Language", description: "Choose your language", type: "core", status: "current",
                children: [
                    { id: "nodejs", title: "Node.js", description: "JavaScript runtime", type: "core", status: "current", duration: "4 weeks", technologies: ["Node.js", "npm", "Express"] },
                    { id: "python", title: "Python", description: "Versatile programming language", type: "alternative", status: "available", duration: "4 weeks", technologies: ["Python", "Django", "Flask"] },
                    { id: "php", title: "PHP", description: "Web development language", type: "alternative", status: "available", duration: "4 weeks", technologies: ["PHP", "Laravel", "Composer"] },
                    { id: "java", title: "Java", description: "Enterprise-grade language", type: "alternative", status: "available", duration: "6 weeks", technologies: ["Java", "Spring Boot", "Maven"] },
                ],
            },
            {
                id: "database", title: "Database", description: "Data storage and management", type: "core", status: "available",
                children: [
                    {
                        id: "sql-databases", title: "SQL Databases", description: "Relational databases", type: "core", status: "available", duration: "3 weeks",
                        children: [
                            { id: "mysql", title: "MySQL", description: "Popular relational database", type: "core", status: "available", duration: "2 weeks", technologies: ["MySQL", "SQL", "Indexes"] },
                            { id: "postgresql", title: "PostgreSQL", description: "Advanced open source database", type: "alternative", status: "available", duration: "2 weeks", technologies: ["PostgreSQL", "Advanced SQL"] },
                        ],
                    },
                    {
                        id: "nosql-databases", title: "NoSQL Databases", description: "Non-relational databases", type: "optional", status: "available", duration: "2 weeks",
                        children: [
                            { id: "mongodb", title: "MongoDB", description: "Document database", type: "optional", status: "available", duration: "2 weeks", technologies: ["MongoDB", "Documents", "Aggregation"] },
                            { id: "redis", title: "Redis", description: "In-memory data structure store", type: "optional", status: "available", duration: "1 week", technologies: ["Redis", "Caching", "Pub/Sub"] },
                        ],
                    },
                ],
            },
            {
                id: "api-development", title: "API Development", description: "Building web APIs", type: "core", status: "available",
                children: [
                    { id: "rest-api", title: "REST API", description: "Representational State Transfer", type: "core", status: "available", duration: "3 weeks", technologies: ["REST", "HTTP Methods", "Status Codes"] },
                    { id: "graphql", title: "GraphQL", description: "Query language for APIs", type: "optional", status: "available", duration: "2 weeks", technologies: ["GraphQL", "Queries", "Mutations"] },
                ],
            },
            {
                id: "authentication", title: "Authentication & Security", description: "User authentication and security", type: "core", status: "available",
                children: [
                    { id: "jwt", title: "JWT Authentication", description: "JSON Web Tokens", type: "core", status: "available", duration: "1 week", technologies: ["JWT", "OAuth", "Sessions"] },
                    { id: "security", title: "Security Best Practices", description: "Application security", type: "core", status: "available", duration: "2 weeks", technologies: ["HTTPS", "CORS", "Input Validation"] },
                ],
            },
        ],
    },
};
