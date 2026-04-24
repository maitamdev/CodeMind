import { Cloud } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "devops",
    title: "DevOps Engineer",
    description: "Kết nối phát triển phần mềm với triển khai, giám sát và tự động hóa hạ tầng.",
    icon: Cloud,
    stats: { courses: 14, duration: "10-15 tháng", students: "18k+" },
    tags: ["AWS", "Docker", "Kubernetes"],
    groups: ["role-based", "devops"],
    fit: "Phù hợp nếu bạn muốn làm chủ CI/CD, cloud và độ ổn định của hệ thống.",
    badge: "HẠ TẦNG",
};

export const detail: RoadmapDetail = {
    id: "devops",
    title: "Lộ trình DevOps Engineer",
    subtitle: "Kết nối phát triển phần mềm với vận hành hệ thống.",
    description: "Roadmap này tập trung vào Linux, container, CI/CD, cloud và giám sát hệ thống để xây nền tảng DevOps thực chiến.",
    totalDuration: "10-15 tháng",
    totalCourses: 14,
    totalStudents: "18k+",
    difficulty: "Trung cấp đến nâng cao",
    focusTags: ["Linux", "Docker", "CI/CD", "Cloud", "Monitoring"],
    outcomes: [
        "Làm chủ command line, Linux và khái niệm hệ thống cốt lõi.",
        "Dùng container và pipeline để tự động hóa vòng đời phát hành.",
        "Tiếp cận cloud, orchestration và giám sát production.",
        "Phối hợp tốt giữa team development và vận hành.",
    ],
    curriculum: [
        { phase: "01", title: "System basics", description: "Bắt đầu từ Linux, shell và các khái niệm mạng căn bản.", topics: ["Linux", "Shell", "Networking", "Processes"] },
        { phase: "02", title: "Container và pipeline", description: "Dùng Docker và CI/CD để đóng gói, kiểm thử và phát hành.", topics: ["Docker", "Registry", "CI/CD", "Secrets"] },
        { phase: "03", title: "Cloud và quan sát hệ thống", description: "Làm việc với cloud resource, monitoring và scaling.", topics: ["AWS", "Terraform", "Kubernetes", "Monitoring"] },
    ],
    careerPaths: ["DevOps Engineer", "Platform Engineer", "SRE", "Cloud Engineer"],
    faqs: [
        { question: "DevOps có cần biết code không?", answer: "Có. Mức độ không nhất thiết sâu như product engineer, nhưng bạn cần đủ để viết script, hiểu pipeline và đọc flow ứng dụng." },
        { question: "Nên học cloud trước hay Docker trước?", answer: "Docker và Linux trước sẽ giúp bạn tiếp cận cloud và orchestration dễ hơn nhiều." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình DevOps Engineer",
    data: {
        id: "devops-root", title: "DevOps Engineering", description: "Infrastructure and deployment", type: "core", status: "available",
        children: [
            {
                id: "linux-basics", title: "Linux Basics", description: "Operating system fundamentals", type: "core", status: "available", duration: "3 weeks",
                children: [
                    { id: "command-line", title: "Command Line", description: "Terminal and shell commands", type: "core", status: "available", duration: "1 week", technologies: ["Bash", "Terminal", "File System"] },
                    { id: "system-admin", title: "System Administration", description: "Server management", type: "core", status: "available", duration: "2 weeks", technologies: ["Ubuntu", "Permissions", "Processes"] },
                ],
            },
            {
                id: "version-control", title: "Version Control", description: "Git and collaboration", type: "core", status: "available",
                children: [
                    { id: "git-advanced", title: "Advanced Git", description: "Git workflows and tools", type: "core", status: "available", duration: "2 weeks", technologies: ["Git", "GitHub", "Branching Strategies"] },
                ],
            },
            {
                id: "cloud-platforms", title: "Cloud Platforms", description: "Cloud infrastructure", type: "core", status: "available",
                children: [
                    { id: "aws-services", title: "AWS Services", description: "Amazon Web Services", type: "core", status: "available", duration: "4 weeks", technologies: ["EC2", "S3", "RDS", "Lambda"] },
                    { id: "docker-containers", title: "Docker & Containers", description: "Containerization", type: "core", status: "available", duration: "3 weeks", technologies: ["Docker", "Docker Compose", "Images"] },
                ],
            },
            {
                id: "ci-cd-pipelines", title: "CI/CD Pipelines", description: "Automated deployment", type: "core", status: "available",
                children: [
                    { id: "jenkins-github", title: "Jenkins & GitHub Actions", description: "CI/CD tools", type: "core", status: "available", duration: "3 weeks", technologies: ["Jenkins", "GitHub Actions", "Pipelines"] },
                    { id: "monitoring", title: "Monitoring & Logging", description: "System monitoring", type: "optional", status: "available", duration: "2 weeks", technologies: ["Prometheus", "Grafana", "ELK Stack"] },
                ],
            },
        ],
    },
};
