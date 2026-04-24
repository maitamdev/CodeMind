import { Smartphone } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "mobile",
    title: "Mobile Developer",
    description: "Phát triển ứng dụng di động đa nền tảng với tư duy sản phẩm rõ ràng.",
    icon: Smartphone,
    stats: { courses: 12, duration: "8-12 tháng", students: "22k+" },
    tags: ["React Native", "iOS", "Android"],
    groups: ["role-based", "mobile"],
    fit: "Phù hợp nếu bạn muốn build app thực tế cho mobile và triển khai đa nền tảng.",
    badge: "THỰC TẾ",
};

export const detail: RoadmapDetail = {
    id: "mobile",
    title: "Lộ trình Mobile Developer",
    subtitle: "Phát triển ứng dụng di động với tư duy sản phẩm thực tế.",
    description: "Roadmap mobile đi từ nền tảng JavaScript/React tới React Native, navigation, networking và release lên store.",
    totalDuration: "8-12 tháng",
    totalCourses: 12,
    totalStudents: "22k+",
    difficulty: "Cơ bản đến trung cấp",
    focusTags: ["React Native", "Navigation", "Networking", "Device APIs"],
    outcomes: [
        "Dựng màn hình, điều hướng và state cho app mobile.",
        "Kết nối backend và xử lý dữ liệu bất đồng bộ trên thiết bị.",
        "Làm việc với camera, lưu trữ cục bộ và notification.",
        "Hiểu quy trình build, test và phát hành ứng dụng.",
    ],
    curriculum: [
        { phase: "01", title: "Nền tảng React cho mobile", description: "Làm chủ component, props, state và layout cho app di động.", topics: ["React basics", "Flex layout", "State", "Hooks"] },
        { phase: "02", title: "React Native core", description: "Bước vào navigation, data flow và giao tiếp với API.", topics: ["React Native", "Navigation", "API", "Async storage"] },
        { phase: "03", title: "Tính năng thiết bị và release", description: "Khai thác capabilities của thiết bị và đóng gói sản phẩm.", topics: ["Camera", "Location", "Build", "Store release"] },
    ],
    careerPaths: ["Mobile Developer", "React Native Developer", "Cross-platform Engineer", "App Product Engineer"],
    faqs: [
        { question: "Học mobile trên Windows có được không?", answer: "Được. Bạn có thể bắt đầu với React Native và emulator, sau đó mới tối ưu workflow theo thiết bị thật." },
        { question: "Roadmap này nghiêng về native hay cross-platform?", answer: "Nghiêng về cross-platform với React Native để bạn vào sản phẩm thực tế nhanh hơn." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình Mobile Developer",
    data: {
        id: "mobile-root", title: "Mobile Development", description: "Cross-platform mobile apps", type: "core", status: "available",
        children: [
            {
                id: "programming-basics", title: "Programming Basics", description: "Core programming concepts", type: "core", status: "available", duration: "4 weeks",
                children: [
                    { id: "javascript-mobile", title: "JavaScript for Mobile", description: "JS programming fundamentals", type: "core", status: "available", duration: "2 weeks", technologies: ["JavaScript", "ES6+", "Async/Await"] },
                    { id: "react-basics", title: "React Basics", description: "Component-based development", type: "core", status: "available", duration: "2 weeks", technologies: ["React", "JSX", "Props", "State"] },
                ],
            },
            {
                id: "react-native", title: "React Native", description: "Cross-platform framework", type: "core", status: "available",
                children: [
                    { id: "rn-fundamentals", title: "React Native Fundamentals", description: "Mobile app development", type: "core", status: "available", duration: "4 weeks", technologies: ["React Native", "Expo", "Components"] },
                    { id: "navigation", title: "Navigation", description: "App navigation patterns", type: "core", status: "available", duration: "2 weeks", technologies: ["React Navigation", "Stack", "Tab", "Drawer"] },
                ],
            },
            {
                id: "mobile-features", title: "Mobile Features", description: "Advanced mobile capabilities", type: "optional", status: "available",
                children: [
                    { id: "device-features", title: "Device Features", description: "Camera, GPS, sensors", type: "optional", status: "available", duration: "3 weeks", technologies: ["Camera", "Location", "AsyncStorage"] },
                    { id: "api-integration", title: "API Integration", description: "Backend communication", type: "optional", status: "available", duration: "2 weeks", technologies: ["REST APIs", "GraphQL", "Authentication"] },
                ],
            },
        ],
    },
};
