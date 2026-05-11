"use client";

/* ══════════════════════════════════════════════════════════════
   CV Builder – Main Orchestrator Component
   ══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import type { CVData, CVSectionType } from "@/types/cv";
import { createCVFromTemplate, CV_TEMPLATES } from "@/lib/cv-templates";

import { cvReducer, loadCVFromStorage, saveCVToStorage } from "./cv-reducer";
import { CVTemplateSelector } from "./CVTemplateSelector";
import { CVEditorLayout } from "./CVEditorLayout";

const CV_TIPS = [
    "Chọn template phù hợp ngành nghề trước rồi mới chỉnh nội dung.",
    "Xuất PDF khi đã rà lại tên, email, kỹ năng và mục tiêu nghề nghiệp.",
    "Dùng AI suggestion để viết bullet súc tích và ATS-friendly hơn.",
];

export type CVBuilderView = "templates" | "editor";

export function CVBuilder() {
    const [view, setView] = useState<CVBuilderView>("templates");
    const [cvData, dispatch] = useReducer(cvReducer, null as unknown as CVData);
    const [isLoaded, setIsLoaded] = useState(false);
    const tips = useMemo(() => CV_TIPS, []);

    /* ── Load saved CV from localStorage on mount ─────────── */
    useEffect(() => {
        const saved = loadCVFromStorage();
        if (saved) {
            dispatch({ type: "LOAD_FROM_JSON", data: saved });
            setView("editor");
        }
        setIsLoaded(true);
    }, []);

    /* ── Save to localStorage on every change ─────────────── */
    useEffect(() => {
        if (cvData && isLoaded) {
            saveCVToStorage(cvData);
        }
    }, [cvData, isLoaded]);

    /* ── Handlers ─────────────────────────────────────────── */
    const handleSelectTemplate = useCallback((templateId: string) => {
        const template = CV_TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;
        const data = createCVFromTemplate(template);
        dispatch({ type: "SET_TEMPLATE", templateId, data });
        setView("editor");
    }, []);

    const handleBackToTemplates = useCallback(() => {
        setView("templates");
    }, []);

    const handleNewCV = useCallback(() => {
        setView("templates");
    }, []);

    /* ── Render ────────────────────────────────────────────── */
    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
                    Đang tải...
                </div>
            </div>
        );
    }

    if (view === "templates" || !cvData) {
        return <CVTemplateSelector onSelect={handleSelectTemplate} />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-mono uppercase tracking-[0.24em] text-slate-500">CV Builder Pro</p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900">Tạo CV nhanh hơn, đẹp hơn và dễ tối ưu hơn</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Chọn template, chỉnh nội dung, dùng AI gợi ý và xuất PDF trong một luồng làm việc gọn hơn.
                            </p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[480px]">
                            {tips.map((tip, index) => (
                                <div key={tip} className="border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400">0{index + 1}</span>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <CVEditorLayout
                    cvData={cvData}
                    dispatch={dispatch}
                    onBackToTemplates={handleBackToTemplates}
                    onNewCV={handleNewCV}
                />
            </div>
        </div>
    );
}
