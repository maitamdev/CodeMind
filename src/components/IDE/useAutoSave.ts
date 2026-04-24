"use client";

import { useState, useEffect, useRef } from "react";
import type { CodeState } from "./useIDEState";

const SAVE_KEY_PREFIX = "ide_playground_";

export function useAutoSave(code: CodeState, lessonId: string, isCodeLoaded: boolean = true) {
    const [status, setStatus] = useState<"saved" | "saving" | "">("");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isCodeLoaded) return;

        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus("saving");

        timerRef.current = setTimeout(async () => {
            try {
                // 1. Save locally first (fallback & instant sync)
                const key = `${SAVE_KEY_PREFIX}code_${lessonId || "scratch"}`;
                localStorage.setItem(key, JSON.stringify(code));
                
                // 2. Save to cloud asynchronously
                await fetch("/api/user/code", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lessonId: lessonId || "scratch",
                        ...code
                    })
                }).catch(() => { /* ignore cloud errors to not spam UI */ });

                setStatus("saved");
                if (statusTimerRef.current)
                    clearTimeout(statusTimerRef.current);
                statusTimerRef.current = setTimeout(() => setStatus(""), 2000);
            } catch {
                setStatus("");
            }
        }, 1500);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
        };
    }, [code, lessonId, isCodeLoaded]);

    return status;
}
