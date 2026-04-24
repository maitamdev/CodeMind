import { Target } from "lucide-react";
import type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData } from "./types";

export const catalog: RoadmapCatalogEntry = {
    id: "python",
    title: "Python Developer",
    description: "Từ cú pháp cơ bản đến ứng dụng thực tế: web, data, automation và AI/ML.",
    icon: Target,
    stats: { courses: 12, duration: "8-14 tháng", students: "52k+" },
    tags: ["Python", "Django", "Data Science", "AI/ML"],
    groups: ["role-based", "python"],
    fit: "Phù hợp nếu bạn muốn một ngôn ngữ đa năng cho backend, data và trí tuệ nhân tạo.",
    badge: "ĐA NĂNG",
};

export const detail: RoadmapDetail = {
    id: "python",
    title: "Lộ trình Python Developer",
    subtitle: "Từ cú pháp cơ bản đến ứng dụng thực tế trong web, data và AI.",
    description: "Roadmap này đi từ nền tảng lập trình Python, qua các thư viện core, framework web, đến data science và machine learning cơ bản.",
    totalDuration: "8-14 tháng",
    totalCourses: 12,
    totalStudents: "52k+",
    difficulty: "Cơ bản đến nâng cao",
    focusTags: ["Python", "Django", "FastAPI", "Pandas", "NumPy", "ML"],
    outcomes: [
        "Nắm vững cú pháp Python, OOP và các thư viện standard library.",
        "Xây dựng web backend với Django hoặc FastAPI.",
        "Xử lý và phân tích dữ liệu với Pandas, NumPy và Matplotlib.",
        "Tiếp cận machine learning cơ bản với Scikit-learn và TensorFlow.",
    ],
    curriculum: [
        { phase: "01", title: "Nền tảng Python", description: "Bắt đầu từ cú pháp, kiểu dữ liệu, vòng lặp, hàm và OOP.", topics: ["Syntax", "Data Types", "Functions", "OOP"] },
        { phase: "02", title: "Web Backend & API", description: "Xây dựng REST API và ứng dụng web với Django/FastAPI.", topics: ["Django", "FastAPI", "REST API", "Database"] },
        { phase: "03", title: "Data Science & AI/ML", description: "Phân tích dữ liệu, trực quan hóa và xây dựng mô hình ML cơ bản.", topics: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"] },
    ],
    careerPaths: ["Python Developer", "Backend Developer", "Data Analyst", "Data Scientist", "ML Engineer"],
    faqs: [
        { question: "Python có phù hợp cho người mới bắt đầu?", answer: "Rất phù hợp. Python có cú pháp rõ ràng, dễ đọc và là một trong những ngôn ngữ tốt nhất để bắt đầu học lập trình." },
        { question: "Nên học Django hay FastAPI trước?", answer: "Django nếu bạn muốn framework toàn diện (full-featured). FastAPI nếu bạn muốn tập trung vào API hiệu năng cao và kiến trúc microservice." },
        { question: "Bao lâu để có thể làm Data Science?", answer: "Nếu đã vững Python cơ bản, khoảng 3-4 tháng tập trung vào Pandas, NumPy và Scikit-learn là đủ để bắt đầu với các dự án data science thực tế." },
    ],
};

export const flow: RoadmapFlowData = {
    title: "Lộ trình Python Developer",
    data: {
        id: "python-root", title: "Python Development", description: "From basics to web, data & AI", type: "core", status: "available",
        children: [
            {
                id: "python-fundamentals", title: "Python Fundamentals", description: "Core language concepts", type: "core", status: "available", duration: "4 weeks",
                children: [
                    { id: "python-syntax", title: "Syntax & Data Types", description: "Variables, strings, numbers, lists, dicts, sets, tuples", type: "core", status: "available", duration: "1 week", technologies: ["Variables", "Strings", "Lists", "Dicts"] },
                    { id: "python-control-flow", title: "Control Flow", description: "if/else, for, while, comprehensions", type: "core", status: "available", duration: "1 week", technologies: ["Conditionals", "Loops", "Comprehensions"] },
                    { id: "python-functions", title: "Functions & Modules", description: "def, lambda, args/kwargs, imports", type: "core", status: "available", duration: "1 week", technologies: ["Functions", "Lambda", "Modules", "Packages"] },
                    { id: "python-oop", title: "OOP in Python", description: "Classes, inheritance, magic methods, decorators", type: "core", status: "available", duration: "1 week", technologies: ["Classes", "Inheritance", "Decorators", "Dunder Methods"] },
                ],
            },
            {
                id: "python-intermediate", title: "Intermediate Python", description: "Advanced language features", type: "core", status: "available",
                children: [
                    { id: "python-file-io", title: "File I/O & Error Handling", description: "File operations, exceptions, context managers", type: "core", status: "available", duration: "1 week", technologies: ["File I/O", "try/except", "with statement"] },
                    { id: "python-iterators", title: "Iterators & Generators", description: "yield, iter, generator expressions", type: "core", status: "available", duration: "1 week", technologies: ["Iterators", "Generators", "yield"] },
                    { id: "python-concurrency", title: "Concurrency", description: "Threading, multiprocessing, asyncio", type: "optional", status: "available", duration: "2 weeks", technologies: ["Threading", "asyncio", "Multiprocessing"] },
                    { id: "python-testing", title: "Testing", description: "unittest, pytest, mocking", type: "optional", status: "available", duration: "1 week", technologies: ["pytest", "unittest", "Mocking"] },
                ],
            },
            {
                id: "python-package-env", title: "Package & Environment", description: "Virtual environments and package management", type: "core", status: "available",
                children: [
                    { id: "python-venv", title: "Virtual Environments", description: "venv, virtualenv, conda", type: "core", status: "available", duration: "3 days", technologies: ["venv", "virtualenv", "conda"] },
                    { id: "python-pip", title: "pip & Package Management", description: "pip, requirements.txt, pyproject.toml", type: "core", status: "available", duration: "3 days", technologies: ["pip", "requirements.txt", "PyPI"] },
                    { id: "python-poetry", title: "Poetry", description: "Modern dependency management", type: "alternative", status: "available", duration: "2 days", technologies: ["Poetry", "pyproject.toml"] },
                ],
            },
            {
                id: "python-web", title: "Web Development", description: "Backend frameworks and APIs", type: "core", status: "available",
                children: [
                    { id: "python-django", title: "Django", description: "Full-featured web framework", type: "core", status: "available", duration: "4 weeks", technologies: ["Django", "ORM", "Templates", "Admin"] },
                    { id: "python-fastapi", title: "FastAPI", description: "Modern async API framework", type: "core", status: "available", duration: "3 weeks", technologies: ["FastAPI", "Pydantic", "Swagger", "async"] },
                    { id: "python-flask", title: "Flask", description: "Lightweight web framework", type: "alternative", status: "available", duration: "2 weeks", technologies: ["Flask", "Jinja2", "Blueprints"] },
                    { id: "python-rest-api", title: "REST API Design", description: "API design patterns and best practices", type: "core", status: "available", duration: "2 weeks", technologies: ["REST", "Authentication", "Pagination", "Versioning"] },
                ],
            },
            {
                id: "python-database", title: "Database & ORM", description: "Data persistence with Python", type: "core", status: "available",
                children: [
                    { id: "python-sqlalchemy", title: "SQLAlchemy", description: "Python SQL toolkit and ORM", type: "core", status: "available", duration: "2 weeks", technologies: ["SQLAlchemy", "Alembic", "Migrations"] },
                    { id: "python-sql", title: "SQL with Python", description: "Working with relational databases", type: "core", status: "available", duration: "2 weeks", technologies: ["PostgreSQL", "MySQL", "sqlite3"] },
                    { id: "python-nosql", title: "NoSQL with Python", description: "MongoDB, Redis with Python drivers", type: "optional", status: "available", duration: "1 week", technologies: ["PyMongo", "Redis-py"] },
                ],
            },
            {
                id: "python-data-science", title: "Data Science", description: "Data analysis and visualization", type: "core", status: "available",
                children: [
                    { id: "python-numpy", title: "NumPy", description: "Numerical computing with arrays", type: "core", status: "available", duration: "2 weeks", technologies: ["NumPy", "Arrays", "Linear Algebra"] },
                    { id: "python-pandas", title: "Pandas", description: "Data manipulation and analysis", type: "core", status: "available", duration: "3 weeks", technologies: ["DataFrame", "Series", "Groupby", "Merge"] },
                    { id: "python-matplotlib", title: "Matplotlib & Seaborn", description: "Data visualization", type: "core", status: "available", duration: "2 weeks", technologies: ["Matplotlib", "Seaborn", "Plotly"] },
                    { id: "python-jupyter", title: "Jupyter Notebooks", description: "Interactive computing", type: "optional", status: "available", duration: "3 days", technologies: ["Jupyter", "IPython", "Notebooks"] },
                ],
            },
            {
                id: "python-ml", title: "Machine Learning", description: "ML fundamentals with Python", type: "optional", status: "available",
                children: [
                    { id: "python-sklearn", title: "Scikit-learn", description: "Classical ML algorithms", type: "core", status: "available", duration: "4 weeks", technologies: ["Classification", "Regression", "Clustering", "Pipelines"] },
                    { id: "python-tensorflow", title: "TensorFlow / Keras", description: "Deep learning framework", type: "alternative", status: "available", duration: "4 weeks", technologies: ["TensorFlow", "Keras", "Neural Networks"] },
                    { id: "python-pytorch", title: "PyTorch", description: "Research-oriented deep learning", type: "alternative", status: "available", duration: "4 weeks", technologies: ["PyTorch", "Tensors", "Autograd"] },
                ],
            },
            {
                id: "python-automation", title: "Automation & Scripting", description: "Automate tasks with Python", type: "optional", status: "available",
                children: [
                    { id: "python-web-scraping", title: "Web Scraping", description: "Extracting data from websites", type: "optional", status: "available", duration: "2 weeks", technologies: ["BeautifulSoup", "Scrapy", "Selenium"] },
                    { id: "python-task-automation", title: "Task Automation", description: "Automating repetitive tasks", type: "optional", status: "available", duration: "1 week", technologies: ["os", "shutil", "subprocess", "schedule"] },
                ],
            },
        ],
    },
};
