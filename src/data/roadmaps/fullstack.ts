import { Database } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "fullstack",
    title: "Full-stack Developer",
    description: "Xây nền tảng toàn diện để tự triển khai sản phẩm từ giao diện đến hệ thống.",
    icon: Database,
    stats: { courses: 15, duration: "12-18 tháng", students: "28k+" },
    tags: ["MERN", "DevOps", "System Design"],
    groups: ["role-based", "web"],
    fit: "Phù hợp nếu bạn muốn hiểu toàn bộ vòng đời xây dựng và phát hành sản phẩm.",
    badge: "TOÀN DIỆN",
};

export const detail: RoadmapDetail = {
    id: "fullstack",
    title: "Lộ trình Full-stack Developer",
    subtitle: "Ghép giao diện, API và vận hành thành một luồng hoàn chỉnh.",
    description: "Roadmap full-stack gom cả front-end lẫn back-end theo thứ tự hợp lý để bạn hiểu sản phẩm từ đầu đến cuối.",
    totalDuration: "12-18 tháng",
    totalCourses: 15,
    totalStudents: "28k+",
    difficulty: "Trung cấp",
    focusTags: ["React", "Node.js", "Database", "Deploy", "System Design"],
    outcomes: [
        "Xây giao diện có state rõ ràng và giao tiếp API ổn định.",
        "Tự dựng backend đủ cho sản phẩm web thực tế.",
        "Hiểu mô hình dữ liệu, auth, deploy và quy trình phát hành.",
        "Có nền tảng để tiếp tục chuyên sâu ở front-end hoặc back-end.",
    ],
    curriculum: [
        { phase: "01", title: "Front-end foundation", description: "Xây lớp giao diện và component model trước khi nối với backend.", topics: ["HTML/CSS", "JavaScript", "React", "State"] },
        { phase: "02", title: "Back-end foundation", description: "Bổ sung API, database và auth để tạo flow hoàn chỉnh.", topics: ["Node.js", "REST", "Database", "JWT"] },
        { phase: "03", title: "Tích hợp và deploy", description: "Kết nối toàn bộ stack và đưa ứng dụng lên môi trường chạy thật.", topics: ["Integration", "Testing", "Deploy", "Monitoring"] },
    ],
    careerPaths: ["Full-stack Developer", "Product Engineer", "Technical Founder", "Software Engineer"],
    faqs: [
        { question: "Có nên học cả hai phía ngay từ đầu?", answer: "Nên ưu tiên một phía làm trục chính rồi mở rộng sang phía còn lại, thay vì học dàn trải cùng lúc." },
        { question: "Roadmap này có phù hợp để đi freelance không?", answer: "Có. Full-stack là hướng phù hợp nếu bạn muốn tự triển khai các sản phẩm nhỏ đến trung bình." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình Full-stack Developer",
    data: {
        id: "fullstack-root", title: "Full-stack Development", description: "Complete web development", type: "core", status: "available",
        children: [
            {
                id: "frontend-basics", title: "Front-end Basics", description: "HTML, CSS, JavaScript fundamentals", type: "core", status: "available", duration: "6 weeks",
                children: [
                    { id: "html-css", title: "HTML & CSS", description: "Web markup and styling", type: "core", status: "available", duration: "3 weeks", technologies: ["HTML5", "CSS3", "Responsive Design"] },
                    { id: "javascript-fundamentals", title: "JavaScript Fundamentals", description: "Programming basics", type: "core", status: "available", duration: "3 weeks", technologies: ["ES6+", "DOM", "Async Programming"] },
                ],
            },
            {
                id: "frontend-advanced", title: "Advanced Front-end", description: "Modern frameworks and tools", type: "core", status: "available",
                children: [
                    { id: "react-framework", title: "React Framework", description: "Component-based development", type: "core", status: "available", duration: "6 weeks", technologies: ["React", "Hooks", "Context", "Redux"] },
                    { id: "build-tools", title: "Build Tools", description: "Development workflow", type: "optional", status: "available", duration: "2 weeks", technologies: ["Webpack", "Babel", "NPM Scripts"] },
                ],
            },
            {
                id: "backend-development", title: "Back-end Development", description: "Server-side programming", type: "core", status: "available",
                children: [
                    { id: "nodejs-backend", title: "Node.js Backend", description: "Server-side JavaScript", type: "core", status: "available", duration: "4 weeks", technologies: ["Node.js", "Express", "REST APIs"] },
                    { id: "database-integration", title: "Database Integration", description: "Data persistence", type: "core", status: "available", duration: "3 weeks", technologies: ["MongoDB", "Mongoose", "Data Modeling"] },
                ],
            },
            {
                id: "deployment-devops", title: "Deployment & DevOps", description: "Production deployment", type: "optional", status: "available",
                children: [
                    { id: "cloud-deployment", title: "Cloud Deployment", description: "Hosting applications", type: "optional", status: "available", duration: "2 weeks", technologies: ["Heroku", "Vercel", "AWS"] },
                    { id: "ci-cd", title: "CI/CD", description: "Continuous integration", type: "optional", status: "available", duration: "2 weeks", technologies: ["GitHub Actions", "Docker", "Testing"] },
                ],
            },
        ],
    },
};
