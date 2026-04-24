/**
 * ═══════════════════════════════════════════
 *  Roadmap Data Registry
 *  Mỗi roadmap nằm trong file riêng.
 *  Thêm roadmap mới: tạo file → import → thêm vào registry.
 * ═══════════════════════════════════════════
 */

import * as frontend from "./frontend";
import * as backend from "./backend";
import * as fullstack from "./fullstack";
import * as mobile from "./mobile";
import * as devops from "./devops";
import * as python from "./python";

import type {
    RoadmapCatalogEntry,
    RoadmapDetail,
    RoadmapFlowData,
} from "./types";

export type { RoadmapCatalogEntry, RoadmapDetail, RoadmapFlowData, RoadmapNode } from "./types";

/* ── Registry object keyed by slug ── */
const registry = { frontend, backend, fullstack, mobile, devops, python } as const;

type Slug = keyof typeof registry;

/* ── Derived lookups ── */
export const roadmapCatalog: RoadmapCatalogEntry[] = Object.values(registry).map((m) => m.catalog);

export const roadmapDetails: Record<string, RoadmapDetail> = Object.fromEntries(
    Object.entries(registry).map(([key, m]) => [key, m.detail]),
);

export const roadmapFlows: Record<string, RoadmapFlowData> = Object.fromEntries(
    Object.entries(registry).map(([key, m]) => [key, m.flow]),
);

/* ── Icon lookup (for detail page) ── */
export const roadmapIcons: Record<string, RoadmapCatalogEntry["icon"]> = Object.fromEntries(
    Object.entries(registry).map(([key, m]) => [key, m.catalog.icon]),
);

/* ── Utility: get all unique group IDs ── */
export const allGroupIds: string[] = [
    ...new Set(roadmapCatalog.flatMap((r) => r.groups)),
];
