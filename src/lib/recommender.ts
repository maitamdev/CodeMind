import { db as supabaseAdmin } from "@/lib/db";
import { removeVietnameseTones } from "@/lib/string-utils";

/**
 * Content-based course recommender (TF-IDF + cosine similarity).
 *
 * - Builds a sparse TF-IDF index over published courses' text fields
 *   (title, short_description, description, level, category).
 * - Computes cosine similarity between course vectors on demand.
 * - Caches the index in-memory for `INDEX_TTL_MS` to avoid recomputation
 *   on every request.
 *
 * The implementation is dependency-free and runs comfortably for the
 * scale of CodeMind (≤ a few thousand courses).
 */

export interface CourseDoc {
    id: string;
    slug: string;
    title: string;
    shortDescription: string | null;
    level: string | null;
    thumbnailUrl: string | null;
    isFree: boolean;
    rating: number;
    students: number;
    instructorName: string | null;
}

interface IndexedCourse extends CourseDoc {
    vector: Map<string, number>; // term -> tf-idf weight
    norm: number;
}

interface CourseIndex {
    builtAt: number;
    courses: IndexedCourse[];
    byId: Map<string, IndexedCourse>;
    bySlug: Map<string, IndexedCourse>;
}

const INDEX_TTL_MS = 5 * 60 * 1000; // 5 minutes

const STOPWORDS = new Set<string>([
    // Vietnamese
    "va", "la", "cua", "cho", "voi", "trong", "den", "tu", "khi", "mot", "cac",
    "nhung", "duoc", "co", "khong", "ban", "se", "da", "rang", "neu", "nay",
    "do", "ay", "thi", "ma", "hay", "nen", "boi", "vi", "nhu", "tai", "ra",
    "len", "vao", "ve", "cung", "gi", "sao", "nao", "ai", "the", "hoi",
    // English
    "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "for",
    "with", "by", "is", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "do", "does", "did", "this", "that", "these", "those",
    "you", "your", "we", "our", "they", "their", "it", "its", "as", "at",
    "from", "into", "about",
]);

function tokenize(text: string): string[] {
    if (!text) return [];
    const normalized = removeVietnameseTones(text)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}+#.\s-]/gu, " ");
    return normalized
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(
            (t) =>
                t.length >= 2 &&
                t.length <= 32 &&
                !STOPWORDS.has(t) &&
                !/^\d+$/.test(t),
        );
}

function buildDoc(course: CourseDoc): string {
    const parts = [
        course.title,
        course.title, // weight title higher
        course.shortDescription ?? "",
        course.level ?? "",
        course.instructorName ?? "",
    ];
    return parts.join(" ");
}

let cachedIndex: CourseIndex | null = null;
let inflight: Promise<CourseIndex> | null = null;

async function loadCourseDocs(): Promise<CourseDoc[]> {
    if (!supabaseAdmin) return [];
    const { data, error } = await supabaseAdmin
        .from("courses")
        .select(
            "id, slug, title, short_description, level, thumbnail_url, is_free, rating, total_students, instructor_id, is_published",
        )
        .eq("is_published", true);

    if (error || !data) return [];

    // Resolve instructor names (best-effort, non-blocking on failure)
    const instructorIds = Array.from(
        new Set(
            data
                .map((c) => c.instructor_id as string | null)
                .filter((v): v is string => !!v),
        ),
    );

    const instructorMap = new Map<string, string>();
    if (instructorIds.length > 0) {
        const { data: instructors } = await supabaseAdmin
            .from("users")
            .select("id, full_name, username")
            .in("id", instructorIds);
        for (const u of instructors ?? []) {
            instructorMap.set(
                u.id as string,
                ((u.full_name as string | null) ??
                    (u.username as string | null) ??
                    null) as string,
            );
        }
    }

    return data.map((c) => ({
        id: c.id as string,
        slug: c.slug as string,
        title: c.title as string,
        shortDescription: (c.short_description as string | null) ?? null,
        level: (c.level as string | null) ?? null,
        thumbnailUrl: (c.thumbnail_url as string | null) ?? null,
        isFree: !!c.is_free,
        rating: Number(c.rating ?? 0),
        students: Number(c.total_students ?? 0),
        instructorName: c.instructor_id
            ? instructorMap.get(c.instructor_id as string) ?? null
            : null,
    }));
}

async function buildIndex(): Promise<CourseIndex> {
    const docs = await loadCourseDocs();

    // 1) Term frequencies + document frequencies
    const tfList: Array<Map<string, number>> = [];
    const df = new Map<string, number>();

    for (const doc of docs) {
        const tokens = tokenize(buildDoc(doc));
        const tf = new Map<string, number>();
        for (const t of tokens) {
            tf.set(t, (tf.get(t) ?? 0) + 1);
        }
        for (const term of tf.keys()) {
            df.set(term, (df.get(term) ?? 0) + 1);
        }
        tfList.push(tf);
    }

    const N = Math.max(docs.length, 1);

    // 2) TF-IDF + L2 norm
    const indexed: IndexedCourse[] = docs.map((doc, i) => {
        const tf = tfList[i];
        const vector = new Map<string, number>();
        let normSquared = 0;
        for (const [term, freq] of tf) {
            const dfTerm = df.get(term) ?? 1;
            const idf = Math.log((N + 1) / (dfTerm + 1)) + 1;
            const weight = freq * idf;
            vector.set(term, weight);
            normSquared += weight * weight;
        }
        return {
            ...doc,
            vector,
            norm: Math.sqrt(normSquared) || 1,
        };
    });

    const byId = new Map<string, IndexedCourse>();
    const bySlug = new Map<string, IndexedCourse>();
    for (const c of indexed) {
        byId.set(c.id, c);
        bySlug.set(c.slug, c);
    }

    return {
        builtAt: Date.now(),
        courses: indexed,
        byId,
        bySlug,
    };
}

async function getIndex(): Promise<CourseIndex> {
    if (cachedIndex && Date.now() - cachedIndex.builtAt < INDEX_TTL_MS) {
        return cachedIndex;
    }
    if (inflight) return inflight;
    inflight = buildIndex()
        .then((idx) => {
            cachedIndex = idx;
            return idx;
        })
        .finally(() => {
            inflight = null;
        });
    return inflight;
}

function cosine(
    a: Map<string, number>,
    aNorm: number,
    b: Map<string, number>,
    bNorm: number,
): number {
    if (aNorm === 0 || bNorm === 0) return 0;
    // Iterate over the smaller vector for efficiency
    const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
    let dot = 0;
    for (const [term, w] of smaller) {
        const w2 = larger.get(term);
        if (w2) dot += w * w2;
    }
    return dot / (aNorm * bNorm);
}

export interface RecommendationItem {
    id: string;
    slug: string;
    title: string;
    shortDescription: string | null;
    level: string | null;
    thumbnailUrl: string | null;
    isFree: boolean;
    rating: number;
    students: number;
    instructorName: string | null;
    score: number;
}

function toItem(course: IndexedCourse, score: number): RecommendationItem {
    return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        shortDescription: course.shortDescription,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl,
        isFree: course.isFree,
        rating: course.rating,
        students: course.students,
        instructorName: course.instructorName,
        score,
    };
}

/**
 * Recommend courses similar to a given course (by id or slug).
 */
export async function recommendSimilarCourses(opts: {
    courseId?: string;
    courseSlug?: string;
    limit?: number;
}): Promise<RecommendationItem[]> {
    const limit = Math.min(Math.max(opts.limit ?? 6, 1), 20);
    const idx = await getIndex();

    const seed = opts.courseId
        ? idx.byId.get(opts.courseId)
        : opts.courseSlug
          ? idx.bySlug.get(opts.courseSlug)
          : undefined;

    if (!seed) return [];

    const scored: Array<{ course: IndexedCourse; score: number }> = [];
    for (const c of idx.courses) {
        if (c.id === seed.id) continue;
        const score = cosine(seed.vector, seed.norm, c.vector, c.norm);
        if (score > 0) scored.push({ course: c, score });
    }

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => toItem(s.course, s.score));
}

/**
 * Recommend courses to a user given a list of course IDs they engaged with.
 * Builds a centroid vector and ranks unseen courses by cosine.
 */
export async function recommendForUser(opts: {
    enrolledCourseIds: string[];
    limit?: number;
}): Promise<RecommendationItem[]> {
    const limit = Math.min(Math.max(opts.limit ?? 6, 1), 20);
    const idx = await getIndex();

    if (opts.enrolledCourseIds.length === 0) {
        // Fallback: most popular among published
        return idx.courses
            .slice()
            .sort((a, b) => b.students - a.students || b.rating - a.rating)
            .slice(0, limit)
            .map((c) => toItem(c, 0));
    }

    const enrolledSet = new Set(opts.enrolledCourseIds);
    const seeds = opts.enrolledCourseIds
        .map((id) => idx.byId.get(id))
        .filter((c): c is IndexedCourse => !!c);

    if (seeds.length === 0) return [];

    // Build centroid (sum of vectors, normalized)
    const centroid = new Map<string, number>();
    for (const s of seeds) {
        for (const [term, w] of s.vector) {
            centroid.set(term, (centroid.get(term) ?? 0) + w);
        }
    }
    let normSq = 0;
    for (const w of centroid.values()) normSq += w * w;
    const centroidNorm = Math.sqrt(normSq) || 1;

    const scored: Array<{ course: IndexedCourse; score: number }> = [];
    for (const c of idx.courses) {
        if (enrolledSet.has(c.id)) continue;
        const score = cosine(centroid, centroidNorm, c.vector, c.norm);
        if (score > 0) scored.push({ course: c, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => toItem(s.course, s.score));
}

/** Test/diagnostic helper to force-rebuild the in-memory index. */
export function invalidateRecommenderCache() {
    cachedIndex = null;
}
