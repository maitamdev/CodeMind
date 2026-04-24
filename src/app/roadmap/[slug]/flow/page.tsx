"use client";

import { notFound } from "next/navigation";
import RoadmapTreeView from "@/components/RoadmapTreeView";
import PageLoading from "@/components/PageLoading";
import { use, useEffect, useState, useCallback } from "react";
import { roadmapFlows } from "@/data/roadmaps";

export default function RoadmapFlowPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const roadmap = roadmapFlows[slug];

    if (!roadmap) {
        notFound();
    }

    const [progress, setProgress] = useState<Record<string, string>>({});
    const [isProgressLoaded, setIsProgressLoaded] = useState(false);

    // Load saved progress from Supabase on mount
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const response = await fetch(`/api/roadmap/${slug}/progress`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setProgress(result.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load roadmap progress:", err);
            } finally {
                setIsProgressLoaded(true);
            }
        };

        void loadProgress();
    }, [slug]);

    // Save progress to Supabase
    const handleProgressUpdate = useCallback(
        async (nodeId: string, status: string) => {
            try {
                await fetch(`/api/roadmap/${slug}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ node_id: nodeId, status }),
                });
            } catch (err) {
                console.error("Failed to save roadmap progress:", err);
            }
        },
        [slug],
    );

    // Wait for progress to load before rendering
    if (!isProgressLoaded) {
        return <PageLoading message="Đang tải lộ trình..." />;
    }

    return (
        <RoadmapTreeView
            roadmapId={slug}
            roadmapTitle={roadmap.title}
            roadmapData={roadmap.data}
            initialProgress={progress}
            onProgressUpdate={handleProgressUpdate}
        />
    );
}
