import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/code/execute
 *
 * Executes JavaScript/TypeScript code server-side using Node.js VM.
 * For C++/Python/etc., returns instructions for local setup.
 *
 * Body: { language: string, code: string, stdin?: string }
 */

// Languages that can be executed in-browser or on server
const BROWSER_LANGS = new Set(["javascript", "typescript"]);
const COMPILED_LANGS = new Set(["cpp", "c", "java", "go", "rust", "csharp"]);
const INTERPRETED_LANGS = new Set(["python", "ruby", "php"]);

/**
 * @swagger
 * /api/code/execute:
 *   post:
 *     tags:
 *       - Code
 *     summary: API endpoint for /api/code/execute
 *     description: Tự động sinh tài liệu cho POST /api/code/execute. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { language, code, stdin } = body || {};

        if (!language || !code) {
            return NextResponse.json({ error: "Missing 'language' or 'code' field" }, { status: 400 });
        }

        const langKey = language.toLowerCase();

        // ─── JavaScript/TypeScript: Execute with Node.js VM ───
        if (BROWSER_LANGS.has(langKey)) {
            return executeJavaScript(code);
        }

        // ─── Python: Execute with child process if available ───
        if (langKey === "python") {
            return executePython(code, stdin);
        }

        // ─── C++: Execute with g++ if available ───
        if (langKey === "cpp" || langKey === "c") {
            return executeCpp(code, langKey, stdin);
        }

        // ─── Other compiled/interpreted languages ───
        return NextResponse.json({
            output: "",
            stderr: `Ngôn ngữ "${language}" chưa được hỗ trợ chạy trực tiếp.\nHãy cài đặt compiler/runtime trên máy để chạy.`,
            exitCode: 1,
            language: langKey,
            version: "N/A",
            phase: "info",
        });
    } catch (error: any) {
        console.error("Code execution error:", error);
        return NextResponse.json({
            output: "",
            stderr: `Lỗi server: ${error.message || "Unknown error"}`,
            exitCode: 1,
            language: "unknown",
            version: "N/A",
            phase: "error",
        });
    }
}

// ─── JavaScript execution using Node.js VM ───
async function executeJavaScript(code: string) {
    // Use basic eval with console capture
    const logs: string[] = [];
    const errors: string[] = [];

    try {
        // Create a sandbox with captured console
        const sandbox = {
            console: {
                log: (...args: any[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
                error: (...args: any[]) => errors.push(args.map(a => String(a)).join(" ")),
                warn: (...args: any[]) => logs.push("[warn] " + args.map(a => String(a)).join(" ")),
                info: (...args: any[]) => logs.push("[info] " + args.map(a => String(a)).join(" ")),
            },
            setTimeout: () => {},
            setInterval: () => {},
            Math,
            Date,
            JSON,
            Array,
            Object,
            String,
            Number,
            Boolean,
            Map,
            Set,
            RegExp,
            Error,
            parseInt,
            parseFloat,
            isNaN,
            isFinite,
        };

        // Use Node.js vm module (built-in, no npm needed)
        const vm = require("vm");
        const context = vm.createContext(sandbox);
        const script = new vm.Script(code, { timeout: 5000, filename: "main.js" });
        const result = script.runInContext(context, { timeout: 5000 });

        // If the last expression has a value, show it
        if (result !== undefined && logs.length === 0) {
            logs.push(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
        }

        return NextResponse.json({
            output: logs.join("\n"),
            stderr: errors.join("\n"),
            exitCode: errors.length > 0 ? 1 : 0,
            language: "JavaScript",
            version: process.version,
            phase: "run",
        });
    } catch (err: any) {
        return NextResponse.json({
            output: logs.join("\n"),
            stderr: err.message || String(err),
            exitCode: 1,
            language: "JavaScript",
            version: process.version,
            phase: "run",
        });
    }
}

// ─── Python execution using child_process ───
async function executePython(code: string, stdin?: string) {
    try {
        const { execSync } = require("child_process");
        const fs = require("fs");
        const os = require("os");
        const path = require("path");

        // Write code to temp file
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(tmpDir, `codemind_${Date.now()}.py`);
        fs.writeFileSync(tmpFile, code, "utf-8");

        try {
            const result = execSync(`python "${tmpFile}"`, {
                timeout: 10000,
                maxBuffer: 1024 * 1024,
                input: stdin || undefined,
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "pipe"],
            });

            return NextResponse.json({
                output: result || "",
                stderr: "",
                exitCode: 0,
                language: "Python",
                version: "3.x",
                phase: "run",
            });
        } catch (execErr: any) {
            return NextResponse.json({
                output: execErr.stdout || "",
                stderr: execErr.stderr || execErr.message || "Python execution failed",
                exitCode: execErr.status || 1,
                language: "Python",
                version: "3.x",
                phase: "run",
            });
        } finally {
            try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
        }
    } catch (err: any) {
        return NextResponse.json({
            output: "",
            stderr: `Python không khả dụng trên server.\nLỗi: ${err.message}`,
            exitCode: 1,
            language: "Python",
            version: "N/A",
            phase: "error",
        });
    }
}

// ─── C/C++ execution using g++ ───
async function executeCpp(code: string, lang: string, stdin?: string) {
    try {
        const { execSync } = require("child_process");
        const fs = require("fs");
        const os = require("os");
        const path = require("path");

        const tmpDir = os.tmpdir();
        const ext = lang === "c" ? "c" : "cpp";
        const srcFile = path.join(tmpDir, `codemind_${Date.now()}.${ext}`);
        const outFile = path.join(tmpDir, `codemind_${Date.now()}.exe`);
        fs.writeFileSync(srcFile, code, "utf-8");

        try {
            // Compile
            const compiler = lang === "c" ? "gcc" : "g++";
            execSync(`${compiler} "${srcFile}" -o "${outFile}" -std=${lang === "c" ? "c11" : "c++17"}`, {
                timeout: 15000,
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "pipe"],
            });

            // Run
            const result = execSync(`"${outFile}"`, {
                timeout: 10000,
                maxBuffer: 1024 * 1024,
                input: stdin || undefined,
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "pipe"],
            });

            return NextResponse.json({
                output: result || "",
                stderr: "",
                exitCode: 0,
                language: lang === "c" ? "C" : "C++",
                version: "GCC",
                phase: "run",
            });
        } catch (execErr: any) {
            const isCompileError = execErr.stderr?.includes("error:") && !execErr.stdout;
            return NextResponse.json({
                output: execErr.stdout || "",
                stderr: execErr.stderr || execErr.message || "Compilation/execution failed",
                exitCode: execErr.status || 1,
                language: lang === "c" ? "C" : "C++",
                version: "GCC",
                phase: isCompileError ? "compile" : "run",
            });
        } finally {
            try { fs.unlinkSync(srcFile); } catch { /* ignore */ }
            try { fs.unlinkSync(outFile); } catch { /* ignore */ }
        }
    } catch (err: any) {
        return NextResponse.json({
            output: "",
            stderr: `Compiler (g++) không khả dụng trên server.\nLỗi: ${err.message}`,
            exitCode: 1,
            language: lang === "c" ? "C" : "C++",
            version: "N/A",
            phase: "error",
        });
    }
}
