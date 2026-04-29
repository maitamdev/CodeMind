

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Documentation | CodeMind",
    description: "Tài liệu API Swagger cho CodeMind E-Learning",
};

export default function IndexPage() {
    return (
        <section className="container mx-auto py-10 bg-white dark:bg-slate-900 rounded-lg shadow mt-10 mb-10 h-[calc(100vh-100px)]">
            <h1 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                CodeMind API Documentation
            </h1>
            <div className="bg-white rounded-lg w-full h-full overflow-hidden border">
                <iframe
                    src="/swagger-ui.html"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Swagger UI"
                />
            </div>
        </section>
    );
}
