/**
 * Groq Roadmap Service — Direct Groq API integration for Next.js
 * Replaces the Python FastAPI ai-service entirely.
 */

import Groq from "groq-sdk";

// ─── Config ───
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_MAX_TOKENS = 12000;
const GROQ_TEMPERATURE = 0.7;
const PROMPT_VERSION = "2.0.0";

function getGroqClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error(
            "GROQ_API_KEY chưa được cấu hình. Lấy key miễn phí tại: https://console.groq.com/",
        );
    }
    return new Groq({ apiKey });
}

// ─── System Prompt ───
const ROADMAP_SYSTEM_PROMPT = `You are an expert Tech Career Mentor, Curriculum Architect, and Knowledge Map Designer.

Your job is to generate a dense, accurate, theory-grounded learning roadmap for a specific learner profile.

Return ONLY one valid JSON object. No markdown. No prose outside JSON.

NON-NEGOTIABLE OUTPUT RULES:
1. The root object must contain:
   - "roadmap_title"
   - "roadmap_description"
   - "total_estimated_hours"
   - "sections"
   - "nodes"
   - "edges"
2. "sections" must be a non-empty array. Every section must include:
   - "id", "name", "order", "description"
   - "subsections": non-empty array
3. Every subsection must include:
   - "id", "name", "order", "description"
4. Every node must include:
   - "id"
   - "section_id"
   - "subsection_id" for all learning nodes
   - "type": one of "core", "optional", "project", "alternative"
   - "is_hub": boolean
   - "data": {
       "label",
       "description",
       "estimated_hours",
       "difficulty",
       "prerequisites",
       "learning_outcomes",
       "learning_resources": {
         "keywords",
         "suggested_type"
       }
     }
5. Use roadmap.sh-like structure:
   - Section -> Subsection -> hub node -> detailed lesson nodes -> checkpoint/milestone
6. The graph must be a DAG with NO isolated nodes.
7. Difficulty must progress from beginner -> intermediate -> advanced inside each section when appropriate.
8. Core learning nodes must include meaningful learning outcomes.
9. Project/checkpoint nodes should stay limited; prioritize lessons, theory, and concept coverage.
10. Prefer smaller lesson nodes over giant vague nodes. Split broad topics into teachable pieces.

CONTENT QUALITY RULES:
- Be comprehensive and accurate for the requested target role.
- Cover foundations, internals, practical standards, and ecosystem knowledge.
- Include theoretical concepts, terminology, mental models, and best practices.
- When the learner prefers theory-heavy content, bias learning_resources.suggested_type toward "doc".
- When outputting projects, use them as checkpoints/capstones, not as the majority of nodes.
- Descriptions should explain what the learner studies and why it matters.
- Prerequisites must reference human-readable prior topics, not node IDs.
- Learning outcomes must be concrete and skill-oriented.

EDGE RULES (CRITICAL - DO NOT SKIP):
- The "edges" array is MANDATORY and must NOT be empty.
- Connect section progression from earlier hubs to later hubs.
- Connect hub nodes to detailed lesson nodes inside the same subsection.
- Connect sequential lesson nodes within each subsection.
- Connect lesson clusters to milestone or checkpoint nodes when appropriate.
- Every node must have at least one incoming or outgoing edge, except the very first hub and the final capstone endpoint.
- Each edge must have: "id", "source" (source node id), "target" (target node id).

OUTPUT ORDERING:
- Write "edges" immediately after "nodes" in the JSON output.
- Do NOT place edges at the very end of the JSON — ensure they are generated before reaching any token limit.`;

// ─── Prompt Builder ───

interface BuildPromptParams {
    currentRole: string;
    targetRole: string;
    currentSkills: string[];
    skillLevel: string;
    learningStyle: string[];
    hoursPerWeek: number;
    targetMonths: number;
    preferredLanguage: string;
    focusAreas?: string[];
    audienceType?: string;
    specificJob?: string;
    classLevel?: string;
    major?: string;
    studyYear?: number;
    generationPreferences?: Record<string, string>;
    generationDirectives?: Record<string, any>;
}

function buildAudienceContext(params: BuildPromptParams): string {
    const at = params.audienceType || "worker";

    if (at === "worker") {
        const jobInfo = params.specificJob
            ? ` working as ${params.specificJob}`
            : "";
        return `The learner is a working professional${jobInfo} looking to upskill or change careers. Respect their limited weekly time and prior real-world experience.`;
    }
    if (at === "non-worker")
        return "The learner is not currently employed and wants a structured roadmap from fundamentals upward.";
    if (at === "student") {
        const gradeInfo = params.classLevel
            ? ` in grade ${params.classLevel}`
            : "";
        return `The learner is a high school student${gradeInfo}. Keep explanations foundational, clear, and progressive.`;
    }
    if (at === "university_student") {
        const parts = ["The learner is a university student"];
        if (params.major) parts.push(`majoring in ${params.major}`);
        if (params.studyYear) parts.push(`in year ${params.studyYear}`);
        parts.push(
            "who needs stronger job-ready knowledge without losing theoretical grounding.",
        );
        return parts.join(" ");
    }
    if (at === "recent_graduate") {
        const majorInfo = params.major ? ` in ${params.major}` : "";
        return `The learner recently graduated${majorInfo} and needs practical readiness plus strong conceptual foundations.`;
    }
    return "The learner studies independently for career growth.";
}

function contentBiasInstruction(bias: string): string {
    const m: Record<string, string> = {
        theory_heavy:
            "Bias strongly toward theory, concepts, mental models, terminology, docs, and structured lessons. Keep projects sparse.",
        practice_heavy:
            "Keep theory concise and move faster into applied implementation, checkpoints, and hands-on consolidation.",
        balanced:
            "Balance theoretical grounding with practical application and checkpoints.",
    };
    return m[bias] || m.balanced;
}

function foundationInstruction(coverage: string): string {
    const m: Record<string, string> = {
        full_foundation:
            "Do not skip fundamentals. Build a full conceptual base before advanced tooling.",
        fast_track:
            "Compress fundamentals where safe, but still keep prerequisite links explicit.",
        auto: "Adjust foundation depth based on learner background while preserving coherence.",
    };
    return m[coverage] || m.auto;
}

function resourceHint(bias: string, styles: string[]): string {
    if (bias === "theory_heavy")
        return "Prefer learning_resources.suggested_type='doc' for most core theory nodes. Use 'video' or 'project' only when they better fit the topic.";
    if (styles.includes("documentation"))
        return "Lean toward 'doc' for core nodes unless the topic is best taught visually.";
    if (styles.includes("project"))
        return "Mix 'doc' for theory nodes and 'project' for checkpoints.";
    if (styles.includes("video"))
        return "Use 'video' for explanation-heavy nodes, but keep docs for theory depth.";
    return "Select suggested_type pragmatically per topic.";
}

function defaultDirectives(
    hoursPerWeek: number,
    targetMonths: number,
): Record<string, any> {
    const totalHours = hoursPerWeek * targetMonths * 4;
    if (targetMonths <= 3)
        return {
            available_hours_total: totalHours,
            target_node_range: { min: 45, max: 60 },
            min_sections: 6,
            min_subsections_per_section: 2,
            min_lessons_per_subsection: { min: 3, max: 4 },
            theory_ratio_target: 0.65,
            project_cadence: "checkpoint_every_section_capstone_final",
        };
    if (targetMonths <= 6)
        return {
            available_hours_total: totalHours,
            target_node_range: { min: 70, max: 110 },
            min_sections: 8,
            min_subsections_per_section: 3,
            min_lessons_per_subsection: { min: 4, max: 5 },
            theory_ratio_target: 0.72,
            project_cadence: "checkpoint_every_section_capstone_final",
        };
    return {
        available_hours_total: totalHours,
        target_node_range: { min: 110, max: 150 },
        min_sections: 10,
        min_subsections_per_section: 4,
        min_lessons_per_subsection: { min: 5, max: 6 },
        theory_ratio_target: 0.72,
        project_cadence: "checkpoint_every_section_capstone_final",
    };
}

function buildUserPrompt(params: BuildPromptParams): string {
    const prefs = {
        content_bias: "theory_heavy",
        roadmap_depth: "deep",
        lesson_granularity: "detailed",
        foundation_coverage: "auto",
        ...params.generationPreferences,
    };
    const directives =
        params.generationDirectives ||
        defaultDirectives(params.hoursPerWeek, params.targetMonths);
    const totalHours = directives.available_hours_total;
    const skillsText =
        params.currentSkills.length > 0
            ? params.currentSkills.join(", ")
            : "None";
    const focusText =
        params.focusAreas && params.focusAreas.length > 0
            ? params.focusAreas.join(", ")
            : "Standard path";
    const langInstruction =
        params.preferredLanguage === "vi" ? "Vietnamese" : "English";
    const audienceContext = buildAudienceContext(params);

    return `
GENERATE A LEARNING ROADMAP FOR THIS LEARNER:
- Target role: ${params.targetRole}
- Current context: ${params.currentRole}
- Audience context: ${audienceContext}
- Current level: ${params.skillLevel}
- Known skills: ${skillsText}
- Focus areas to emphasize: ${focusText}
- Available time: ${params.targetMonths} months, ${params.hoursPerWeek} hours/week, about ${totalHours} total hours
- Output language: ${langInstruction}

GENERATION PREFERENCES:
- Content bias: ${prefs.content_bias}
- Roadmap depth: ${prefs.roadmap_depth}
- Lesson granularity: ${prefs.lesson_granularity}
- Foundation coverage: ${prefs.foundation_coverage}

DIRECT STRUCTURE TARGETS:
- Generate between ${directives.target_node_range.min} and ${directives.target_node_range.max} total nodes.
- Generate at least ${directives.min_sections} sections.
- Generate at least ${directives.min_subsections_per_section} subsections per section.
- Generate at least ${directives.min_lessons_per_subsection.min}-${directives.min_lessons_per_subsection.max} lesson nodes per subsection.
- Keep project/checkpoint density aligned with: ${directives.project_cadence}.
- Target theory-heavy lesson ratio around ${directives.theory_ratio_target}.

QUALITY REQUIREMENTS:
- Every section must have a clear conceptual theme and supporting subsections.
- Every subsection must contain a progression from foundations to more advanced lessons when appropriate.
- Use hub nodes for major concepts and smaller lesson nodes beneath them.
- Populate learning outcomes for core nodes.
- Populate prerequisites when needed to preserve learning order.
- Keep project nodes around 10-15% of total nodes, not more.
- Use accurate, industry-relevant sequencing for the target role.
- Avoid generic filler nodes like "Learn more" or "Advanced topics".

INSTRUCTION BIASES:
- ${contentBiasInstruction(prefs.content_bias)}
- ${foundationInstruction(prefs.foundation_coverage)}
- ${resourceHint(prefs.content_bias, params.learningStyle)}

OUTPUT REQUIREMENTS:
- Return JSON only.
- Use "roadmap_description" exactly, not "description" at root.
- Ensure nodes use section_id and subsection_id consistently.
- nodes.section_id must reference an existing sections[].id, not a section name.
- nodes.subsection_id must reference an existing sections[].subsections[].id, not a subsection name.
- Ensure all nodes participate in the graph.
`;
}

// ─── Normalizers ───

function normalizeSuggestedType(v: string): "video" | "doc" | "project" {
    const m: Record<string, "video" | "doc" | "project"> = {
        video: "video",
        videos: "video",
        doc: "doc",
        docs: "doc",
        documentation: "doc",
        document: "doc",
        reading: "doc",
        article: "doc",
        project: "project",
        projects: "project",
        practice: "project",
        "hands-on": "project",
    };
    return m[(v || "").toLowerCase().trim()] || "video";
}

function normalizeDifficulty(
    v: string,
): "beginner" | "intermediate" | "advanced" {
    const m: Record<string, "beginner" | "intermediate" | "advanced"> = {
        beginner: "beginner",
        basic: "beginner",
        easy: "beginner",
        intermediate: "intermediate",
        medium: "intermediate",
        advanced: "advanced",
        expert: "advanced",
        hard: "advanced",
    };
    return m[(v || "").toLowerCase().trim()] || "beginner";
}

function normalizeNodeType(
    v: string,
): "core" | "optional" | "project" | "alternative" {
    const m: Record<string, "core" | "optional" | "project" | "alternative"> = {
        core: "core",
        required: "core",
        essential: "core",
        optional: "optional",
        elective: "optional",
        project: "project",
        practice: "project",
        alternative: "alternative",
        alt: "alternative",
    };
    return m[(v || "").toLowerCase().trim()] || "core";
}

function ensureArray(v: any): any[] {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
}

function normalizeStringList(v: any): string[] {
    return ensureArray(v)
        .map((item: any) => (typeof item === "string" ? item.trim() : String(item).trim()))
        .filter(Boolean);
}

// ─── Edge Synthesizer ───

interface ParsedRoadmap {
    roadmap_title: string;
    roadmap_description: string;
    total_estimated_hours: number;
    sections: any[];
    phases: any[];
    nodes: any[];
    edges: any[];
}

function synthesizeEdges(roadmap: ParsedRoadmap): any[] {
    if (!roadmap.nodes.length || !roadmap.sections.length) return [];
    const edges: any[] = [];
    const edgeSet = new Set<string>();
    let counter = 0;

    function addEdge(source: string, target: string) {
        const key = `${source}->${target}`;
        if (edgeSet.has(key) || source === target) return;
        edgeSet.add(key);
        counter++;
        edges.push({ id: `e-syn-${counter}`, source, target });
    }

    const nodeOrder = new Map<string, number>();
    roadmap.nodes.forEach((n: any, i: number) => nodeOrder.set(n.id, i));

    const sortedSections = [...roadmap.sections].sort(
        (a, b) => (a.order || 0) - (b.order || 0),
    );
    const sectionFirstNodes: (string | null)[] = [];
    const sectionLastNodes: (string | null)[] = [];

    for (const section of sortedSections) {
        const subs = [...(section.subsections || [])].sort(
            (a: any, b: any) => (a.order || 0) - (b.order || 0),
        );
        const sectionNodes = roadmap.nodes.filter(
            (n: any) => n.section_id === section.id,
        );
        if (!sectionNodes.length) {
            sectionFirstNodes.push(null);
            sectionLastNodes.push(null);
            continue;
        }

        let firstInSection: string | null = null;
        let lastInSection: string | null = null;
        let prevSubLast: string | null = null;

        for (const sub of subs) {
            const subNodes = sectionNodes.filter(
                (n: any) => n.subsection_id === sub.id,
            );
            if (!subNodes.length) continue;

            const hubs = subNodes
                .filter((n: any) => n.is_hub)
                .sort(
                    (a: any, b: any) =>
                        (nodeOrder.get(a.id) || 0) - (nodeOrder.get(b.id) || 0),
                );
            const lessons = subNodes
                .filter((n: any) => !n.is_hub && n.type !== "project")
                .sort(
                    (a: any, b: any) =>
                        (nodeOrder.get(a.id) || 0) - (nodeOrder.get(b.id) || 0),
                );
            const projects = subNodes.filter((n: any) => n.type === "project");

            const ordered = [...hubs, ...lessons];
            if (!ordered.length && !projects.length) continue;
            const firstInSub = (ordered[0] || projects[0])?.id;
            if (!firstInSection) firstInSection = firstInSub;
            if (prevSubLast && firstInSub) addEdge(prevSubLast, firstInSub);

            for (const hub of hubs) for (const lesson of lessons) addEdge(hub.id, lesson.id);
            for (let i = 0; i < lessons.length - 1; i++) addEdge(lessons[i].id, lessons[i + 1].id);

            if (projects.length && lessons.length) {
                const last = lessons[lessons.length - 1];
                for (const proj of projects) addEdge(last.id, proj.id);
            }

            if (projects.length) {
                prevSubLast = projects[projects.length - 1].id;
                lastInSection = prevSubLast;
            } else if (lessons.length) {
                prevSubLast = lessons[lessons.length - 1].id;
                lastInSection = prevSubLast;
            } else if (hubs.length) {
                prevSubLast = hubs[hubs.length - 1].id;
                lastInSection = prevSubLast;
            }
        }
        sectionFirstNodes.push(firstInSection);
        sectionLastNodes.push(lastInSection);
    }

    for (let i = 0; i < sectionLastNodes.length - 1; i++) {
        const src = sectionLastNodes[i];
        const tgt = sectionFirstNodes[i + 1];
        if (src && tgt) addEdge(src, tgt);
    }
    return edges;
}

// ─── Roadmap Parser ───

function parseRawRoadmap(raw: any): ParsedRoadmap {
    // Parse sections
    const rawSections = ensureArray(raw.sections || []);
    let sections: any[] = rawSections.map((s: any, i: number) => {
        if (typeof s !== "object" || !s) s = {};
        const sectionId = s.id || `section-${i + 1}`;
        let subsections = ensureArray(s.subsections || []).map(
            (sub: any, j: number) => {
                if (typeof sub !== "object" || !sub) sub = {};
                return {
                    id: sub.id || `${sectionId}-sub-${j + 1}`,
                    name: sub.name || `Subsection ${j + 1}`,
                    order: parseInt(sub.order) || j + 1,
                    description: sub.description || null,
                };
            },
        );
        if (!subsections.length) {
            subsections = [
                {
                    id: `${sectionId}-sub-1`,
                    name: "Core Topics",
                    order: 1,
                    description: null,
                },
            ];
        }
        return {
            id: sectionId,
            name: s.name || `Section ${i + 1}`,
            order: parseInt(s.order) || i + 1,
            description: s.description || null,
            subsections,
        };
    });

    // Fallback: phases -> sections
    const rawPhases = ensureArray(raw.phases || []);
    if (!sections.length && rawPhases.length) {
        sections = rawPhases.map((p: any, i: number) => {
            if (typeof p !== "object" || !p) p = {};
            const id = p.id || `section-${i + 1}`;
            return {
                id,
                name: p.name || `Section ${i + 1}`,
                order: parseInt(p.order) || i + 1,
                description: p.description || null,
                subsections: [
                    { id: `${id}-sub-1`, name: "Core Topics", order: 1, description: null },
                ],
            };
        });
    }

    const phases = (rawPhases.length ? rawPhases : sections).map(
        (p: any, i: number) => ({
            id: p.id || `phase-${i + 1}`,
            name: p.name || `Phase ${i + 1}`,
            order: parseInt(p.order) || i + 1,
        }),
    );

    // Build lookup maps
    const sectionIds = new Set(sections.map((s: any) => s.id));
    const subsectionIdsBySec = new Map<string, Set<string>>();
    for (const sec of sections) {
        const subIds = new Set<string>();
        for (const sub of sec.subsections) subIds.add(sub.id);
        subsectionIdsBySec.set(sec.id, subIds);
    }
    const firstSectionId = sections[0]?.id || "section-1";

    // Parse nodes
    const nodes = ensureArray(raw.nodes || [])
        .filter((n: any) => typeof n === "object" && n)
        .map((n: any, i: number) => {
            const data = typeof n.data === "object" && n.data ? n.data : {};
            const lr =
                typeof data.learning_resources === "object" && data.learning_resources
                    ? data.learning_resources
                    : {};

            let sectionId =
                n.section_id || n.phase_id || n.section || firstSectionId;
            if (!sectionIds.has(sectionId)) sectionId = firstSectionId;

            let subsectionId = n.subsection_id || n.subsection || null;
            const validSubs = subsectionIdsBySec.get(sectionId);
            if (subsectionId && validSubs && !validSubs.has(subsectionId)) {
                // Try to find first subsection
                subsectionId = validSubs.values().next().value || null;
            }
            if (!subsectionId && validSubs && validSubs.size > 0) {
                subsectionId = validSubs.values().next().value;
            }

            return {
                id: n.id || `node-${i + 1}`,
                phase_id: sectionId,
                section_id: sectionId,
                subsection_id: subsectionId,
                type: normalizeNodeType(n.type || "core"),
                is_hub: !!n.is_hub,
                data: {
                    label: data.label || "Unknown Topic",
                    description: data.description || "",
                    estimated_hours: Math.max(1, parseInt(data.estimated_hours) || 5),
                    difficulty: normalizeDifficulty(data.difficulty || "beginner"),
                    prerequisites: normalizeStringList(data.prerequisites),
                    learning_outcomes: normalizeStringList(data.learning_outcomes),
                    learning_resources: {
                        keywords: normalizeStringList(lr.keywords),
                        suggested_type: normalizeSuggestedType(
                            lr.suggested_type || "video",
                        ),
                    },
                },
            };
        });

    // Parse edges
    let edges = ensureArray(raw.edges || [])
        .filter((e: any) => typeof e === "object" && e)
        .map((e: any, i: number) => ({
            id: e.id || `e${i}`,
            source: e.source || "",
            target: e.target || "",
        }))
        .filter((e: any) => e.source && e.target);

    const roadmap: ParsedRoadmap = {
        roadmap_title: raw.roadmap_title || "Learning Roadmap",
        roadmap_description:
            raw.roadmap_description || raw.description || "",
        total_estimated_hours: Math.max(0, parseInt(raw.total_estimated_hours) || 0),
        sections,
        phases,
        nodes,
        edges,
    };

    // Auto-synthesize edges if missing
    if (nodes.length > 0 && edges.length === 0) {
        roadmap.edges = synthesizeEdges(roadmap);
    }

    return roadmap;
}

// ─── Main Generate Function ───

export interface GroqRoadmapResult {
    roadmap: ParsedRoadmap;
    metadata: {
        model: string;
        input_tokens: number;
        output_tokens: number;
        latency_ms: number;
        prompt_version: string;
        personalization_score: number;
        generated_at: string;
    };
}

export async function generateRoadmapWithGroq(
    profile: Record<string, any>,
    generationPreferencesReq?: Record<string, string>,
    generationDirectivesReq?: Record<string, any>,
): Promise<GroqRoadmapResult> {
    const client = getGroqClient();
    const startTime = Date.now();

    let userPrompt = buildUserPrompt({
        currentRole: profile.currentRole || profile.current_role || "",
        targetRole: profile.targetRole || profile.target_role || "",
        currentSkills: profile.currentSkills || profile.current_skills || [],
        skillLevel: profile.skillLevel || profile.skill_level || "beginner",
        learningStyle: profile.learningStyle || profile.learning_style || ["video"],
        hoursPerWeek: profile.hoursPerWeek || profile.hours_per_week || 10,
        targetMonths: profile.targetMonths || profile.target_months || 6,
        preferredLanguage: profile.preferredLanguage || profile.preferred_language || "vi",
        focusAreas: profile.focusAreas || profile.focus_areas || [],
        audienceType: profile.audienceType || profile.audience_type || "worker",
        specificJob: profile.specificJob || profile.specific_job,
        classLevel: profile.classLevel || profile.class_level,
        major: profile.major,
        studyYear: profile.studyYear || profile.study_year,
        generationPreferences: generationPreferencesReq,
        generationDirectives: generationDirectivesReq,
    });

    // Groq JSON mode requires "json" in prompt
    if (!userPrompt.toLowerCase().includes("json")) {
        userPrompt += "\n\nHãy trả về kết quả dưới dạng JSON.";
    }

    const response = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            { role: "system", content: ROADMAP_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: GROQ_TEMPERATURE,
        max_tokens: GROQ_MAX_TOKENS,
    });

    const latencyMs = Date.now() - startTime;
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq API");

    const rawData = JSON.parse(content);
    const roadmap = parseRawRoadmap(rawData);

    // Simple personalization score
    const totalAvailable =
        (profile.hoursPerWeek || 10) * (profile.targetMonths || 6) * 4;
    const estimated = roadmap.total_estimated_hours || 1;
    const timeFit = Math.max(0, 1 - Math.abs(1 - estimated / totalAvailable));
    const structureScore =
        (roadmap.sections.length >= 3 ? 0.4 : 0) +
        (roadmap.edges.length >= roadmap.nodes.length * 0.8 ? 0.3 : 0) +
        (new Set(roadmap.nodes.map((n) => n.type)).size >= 2 ? 0.3 : 0);
    const score = Math.min(
        1,
        Math.max(0, timeFit * 0.4 + 0.3 * 0.3 + structureScore * 0.3),
    );
    const personalizationScore = Math.round(score * 100) / 100;

    return {
        roadmap,
        metadata: {
            model: GROQ_MODEL,
            input_tokens: response.usage?.prompt_tokens || 0,
            output_tokens: response.usage?.completion_tokens || 0,
            latency_ms: latencyMs,
            prompt_version: PROMPT_VERSION,
            personalization_score: personalizationScore,
            generated_at: new Date().toISOString(),
        },
    };
}
