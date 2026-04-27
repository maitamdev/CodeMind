import crypto from "crypto";

/**
 * CodeMind Certificate codes
 *
 * Format: `CM.<payload>.<sig>`
 *   - payload = base64url(`${userId}:${courseId}`)
 *   - sig     = first 12 chars of HMAC-SHA256(payload, secret), hex
 *
 * The code is fully deterministic for a given (userId, courseId) pair,
 * so we don't need to persist certificates in the database — they can
 * be re-derived and re-verified at any time.
 */

const PREFIX = "CM";
const SIG_LEN = 12;

function getSecret(): string {
    const secret =
        process.env.CERTIFICATE_SECRET ||
        process.env.JWT_SECRET ||
        "codemind-certificate-fallback-secret";
    return secret;
}

function toBase64Url(input: string): string {
    return Buffer.from(input, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return Buffer.from(padded + padding, "base64").toString("utf8");
}

function sign(payload: string): string {
    return crypto
        .createHmac("sha256", getSecret())
        .update(payload)
        .digest("hex")
        .slice(0, SIG_LEN);
}

export interface CertificatePayload {
    userId: string;
    courseId: string;
}

export function buildCertificateCode({
    userId,
    courseId,
}: CertificatePayload): string {
    if (!userId || !courseId) {
        throw new Error("userId and courseId are required");
    }
    const payload = toBase64Url(`${userId}:${courseId}`);
    const sig = sign(payload);
    return `${PREFIX}.${payload}.${sig}`;
}

export function parseCertificateCode(
    code: string,
): CertificatePayload | null {
    if (!code || typeof code !== "string") return null;
    const trimmed = code.trim();
    const parts = trimmed.split(".");
    if (parts.length !== 3) return null;
    const [prefix, payload, sig] = parts;
    if (prefix !== PREFIX) return null;
    if (!payload || !sig) return null;

    let expectedSig: string;
    try {
        expectedSig = sign(payload);
    } catch {
        return null;
    }
    if (expectedSig.length !== sig.length) return null;
    let mismatch = 0;
    for (let i = 0; i < expectedSig.length; i++) {
        mismatch |= expectedSig.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    if (mismatch !== 0) return null;

    let decoded: string;
    try {
        decoded = fromBase64Url(payload);
    } catch {
        return null;
    }
    const [userId, courseId] = decoded.split(":");
    if (!userId || !courseId) return null;
    return { userId, courseId };
}

/**
 * Returns a public URL where the certificate can be verified.
 * Falls back to relative path if no base is configured.
 */
export function getCertificateVerifyUrl(code: string, baseUrl?: string): string {
    const path = `/certificates/${encodeURIComponent(code)}`;
    if (baseUrl) {
        try {
            return new URL(path, baseUrl).toString();
        } catch {
            return path;
        }
    }
    return path;
}
