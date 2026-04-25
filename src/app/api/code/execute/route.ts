import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/code/execute
 *
 * Executes code in a sandboxed environment using the free Piston API.
 * Supports: JavaScript (Node.js), Python, C++, TypeScript, and more.
 *
 * Body: { language: string, code: string, stdin?: string }
 * Returns: { output: string, stderr: string, exitCode: number, language: string, version: string }
 */

const PISTON_API = "https://emkc.org/api/v2/piston";

// Map our internal language IDs to Piston runtime names & versions
const LANGUAGE_MAP: Record<string, { language: string; version: string; aliases?: string[] }> = {
    javascript: { language: "javascript", version: "18.15.0" },
    typescript: { language: "typescript", version: "5.0.3" },
    python:     { language: "python",     version: "3.10.0" },
    cpp:        { language: "c++",        version: "10.2.0" },
    c:          { language: "c",          version: "10.2.0" },
    java:       { language: "java",       version: "15.0.2" },
    go:         { language: "go",         version: "1.16.2" },
    rust:       { language: "rust",       version: "1.68.2" },
    php:        { language: "php",        version: "8.2.3"  },
    ruby:       { language: "ruby",       version: "3.0.1"  },
    csharp:     { language: "csharp",     version: "6.12.0" },
};

// File extension map for Piston
const FILE_EXT: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    cpp: "cpp",
    c: "c",
    java: "java",
    go: "go",
    rust: "rs",
    php: "php",
    ruby: "rb",
    csharp: "cs",
};

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 },
            );
        }

        const { language, code, stdin } = body || {};

        if (!language || !code) {
            return NextResponse.json(
                { error: "Missing 'language' or 'code' field" },
                { status: 400 },
            );
        }

        const langKey = language.toLowerCase();
        const runtime = LANGUAGE_MAP[langKey];

        if (!runtime) {
            return NextResponse.json(
                {
                    error: `Unsupported language: ${language}`,
                    supported: Object.keys(LANGUAGE_MAP),
                },
                { status: 400 },
            );
        }

        const ext = FILE_EXT[langKey] || "txt";

        // Call Piston API
        const pistonResponse = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: runtime.language,
                version: runtime.version,
                files: [
                    {
                        name: `main.${ext}`,
                        content: code,
                    },
                ],
                stdin: stdin || "",
                run_timeout: 10000, // 10s max
                compile_timeout: 10000,
            }),
        });

        if (!pistonResponse.ok) {
            const errorText = await pistonResponse.text();
            console.error("Piston API error:", errorText);
            return NextResponse.json(
                { error: "Code execution service unavailable", details: errorText },
                { status: 502 },
            );
        }

        const result = await pistonResponse.json();

        // Piston returns { run: { stdout, stderr, code, signal, output }, compile?: {...} }
        const runResult = result.run || {};
        const compileResult = result.compile || {};

        // If compilation failed, return compile errors
        if (compileResult.stderr) {
            return NextResponse.json({
                output: compileResult.stdout || "",
                stderr: compileResult.stderr,
                exitCode: compileResult.code ?? 1,
                language: result.language || runtime.language,
                version: result.version || runtime.version,
                phase: "compile",
            });
        }

        return NextResponse.json({
            output: runResult.stdout || runResult.output || "",
            stderr: runResult.stderr || "",
            exitCode: runResult.code ?? 0,
            language: result.language || runtime.language,
            version: result.version || runtime.version,
            phase: "run",
        });
    } catch (error) {
        console.error("Code execution error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
