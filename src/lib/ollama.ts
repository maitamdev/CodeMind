// Groq AI Client for CodeMind Platform
// Uses Groq Cloud API for fast LLM inference (replaces local Ollama)

import type {
    OllamaGenerateRequest,
    OllamaGenerateResponse,
    OllamaChatRequest,
    OllamaChatResponse,
    OllamaTagsResponse,
    OllamaToolDefinition,
    OllamaToolCall,
} from "@/types/ai";
import {
    DEFAULT_OLLAMA_CHAT_MODEL,
    DEFAULT_OLLAMA_COMPLETION_MODEL,
    DEFAULT_OLLAMA_TUTOR_MODEL,
} from "@/lib/ai-models";

// ===== Configuration =====

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

// Model aliases (mapped from legacy env vars)
const CHAT_MODEL =
    process.env.GROQ_CHAT_MODEL || process.env.OLLAMA_CHAT_MODEL || DEFAULT_OLLAMA_CHAT_MODEL;
const COMPLETION_MODEL =
    process.env.GROQ_COMPLETION_MODEL || process.env.OLLAMA_COMPLETION_MODEL || DEFAULT_OLLAMA_COMPLETION_MODEL;
const TUTOR_MODEL =
    process.env.GROQ_TUTOR_MODEL || process.env.OLLAMA_TUTOR_MODEL || DEFAULT_OLLAMA_TUTOR_MODEL;

// Timeouts
const COMPLETION_TIMEOUT_MS = 30000;
const CHAT_TIMEOUT_MS = 60000;
const CHAT_INITIAL_TIMEOUT_MS = 30000;
const CHAT_ACTIVITY_TIMEOUT_MS = 15000;
const HEALTH_TIMEOUT_MS = 10000;

// Legacy compat
const OLLAMA_BASE_URL = GROQ_BASE_URL;

// ===== Helper Functions =====

function createTimeoutController(timeoutMs: number) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    return { controller, clear: () => clearTimeout(timeout) };
}

async function groqFetch<T>(
    endpoint: string,
    body: Record<string, unknown>,
    timeoutMs: number,
    retries: number = 1,
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const { controller, clear } = createTimeoutController(timeoutMs);

        try {
            const response = await fetch(`${GROQ_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clear();

            if (!response.ok) {
                const errorText = await response.text().catch(() => "Unknown error");
                throw new Error(`Groq API error ${response.status}: ${errorText}`);
            }

            return (await response.json()) as T;
        } catch (error) {
            clear();
            lastError = error instanceof Error ? error : new Error(String(error));

            if (lastError.name === "AbortError") {
                lastError = new Error(`Groq request timed out after ${timeoutMs}ms`);
            }

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
            }
        }
    }

    throw lastError || new Error("Groq request failed");
}

// ===== FIM (Fill-in-Middle) Format =====

export function buildFIMPrompt(prefix: string, suffix: string): string {
    return `Complete the following code. Only output the code that fills the gap, nothing else.\n\nCode before:\n${prefix}\n\nCode after:\n${suffix}\n\nCompletion:`;
}

// ===== Public API =====

/**
 * Code completion using Groq
 */
export async function getCodeCompletion(
    prefix: string,
    suffix: string,
    options?: { maxTokens?: number; temperature?: number },
): Promise<{ completion: string; durationMs: number }> {
    const prompt = buildFIMPrompt(prefix, suffix);
    const start = Date.now();

    const response = await groqFetch<{
        choices: Array<{ message: { content: string } }>;
    }>(
        "/chat/completions",
        {
            model: COMPLETION_MODEL,
            messages: [
                {
                    role: "system",
                    content: "Code completion engine. Output ONLY the missing code. No explanations. No markdown. No comments. Match the surrounding code style exactly.",
                },
                { role: "user", content: prompt },
            ],
            max_tokens: options?.maxTokens ?? 128,
            temperature: options?.temperature ?? 0.2,
            top_p: 0.9,
            stream: false,
        },
        COMPLETION_TIMEOUT_MS,
        1,
    );

    return {
        completion: response.choices?.[0]?.message?.content?.trim() || "",
        durationMs: Date.now() - start,
    };
}

/**
 * Chat completion (non-streaming)
 */
export async function getChatCompletion(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options?: { maxTokens?: number; temperature?: number; modelId?: string },
): Promise<{ content: string; durationMs: number }> {
    const start = Date.now();

    const response = await groqFetch<{
        choices: Array<{ message: { content: string } }>;
    }>(
        "/chat/completions",
        {
            model: options?.modelId || CHAT_MODEL,
            messages,
            max_tokens: options?.maxTokens ?? 1024,
            temperature: options?.temperature ?? 0.3,
            top_p: 0.9,
            stream: false,
        },
        CHAT_TIMEOUT_MS,
        1,
    );

    return {
        content: response.choices?.[0]?.message?.content || "",
        durationMs: Date.now() - start,
    };
}

export interface ChatWithToolsResult {
    content: string;
    toolCalls: OllamaToolCall[] | null;
    durationMs: number;
}

/**
 * Parse tool calls from text content (for models that output JSON in content)
 */
function parseToolCallsFromText(content: string): OllamaToolCall[] {
    if (!content || typeof content !== "string") return [];

    const toToolCall = (parsed: {
        name?: string;
        arguments?: Record<string, unknown>;
    }) => {
        if (parsed?.name && typeof parsed.name === "string") {
            return {
                type: "function" as const,
                function: {
                    name: parsed.name,
                    arguments: parsed.arguments && typeof parsed.arguments === "object" ? parsed.arguments : {},
                },
            };
        }
        return null;
    };

    const results: OllamaToolCall[] = [];

    const tryParse = (raw: string): boolean => {
        const trimmed = raw.trim();
        if (!trimmed) return false;
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                for (const item of parsed) {
                    const tc = toToolCall(item);
                    if (tc) results.push(tc);
                }
            } else {
                const tc = toToolCall(parsed);
                if (tc) results.push(tc);
            }
            return results.length > 0;
        } catch {
            return false;
        }
    };

    const blockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (blockMatch && tryParse(blockMatch[1])) return results;

    const nameIdx = content.search(/"name"\s*:\s*"/);
    if (nameIdx !== -1) {
        const start = content.lastIndexOf("{", nameIdx);
        if (start !== -1) {
            let depth = 0;
            for (let i = start; i < content.length; i++) {
                if (content[i] === "{") depth++;
                else if (content[i] === "}") {
                    depth--;
                    if (depth === 0) {
                        if (tryParse(content.slice(start, i + 1))) return results;
                        break;
                    }
                }
            }
        }
    }

    return results;
}

/**
 * Chat completion with tools (non-streaming, for agent)
 */
export async function getChatCompletionWithTools(
    messages: Array<
        | { role: "user" | "assistant" | "system"; content: string }
        | { role: "assistant"; content?: string; tool_calls?: OllamaToolCall[] }
        | { role: "tool"; tool_name: string; content: string }
    >,
    tools: OllamaToolDefinition[],
    options?: { maxTokens?: number; temperature?: number; modelId?: string },
): Promise<ChatWithToolsResult> {
    const start = Date.now();

    // Convert tools to OpenAI format for Groq
    const groqTools = tools.map((t) => ({
        type: "function" as const,
        function: {
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
        },
    }));

    const response = await groqFetch<{
        choices: Array<{
            message: {
                content?: string;
                tool_calls?: Array<{
                    id: string;
                    type: string;
                    function: { name: string; arguments: string };
                }>;
            };
        }>;
    }>(
        "/chat/completions",
        {
            model: options?.modelId || CHAT_MODEL,
            messages,
            max_tokens: options?.maxTokens ?? 2048,
            temperature: options?.temperature ?? 0.3,
            top_p: 0.9,
            stream: false,
            tools: groqTools,
            tool_choice: "auto",
        },
        CHAT_TIMEOUT_MS,
        1,
    );

    const msg = response.choices?.[0]?.message;
    const content = msg?.content || "";

    let toolCalls: OllamaToolCall[] | null = null;
    if (msg?.tool_calls && msg.tool_calls.length > 0) {
        toolCalls = msg.tool_calls.map((tc) => ({
            type: "function" as const,
            function: {
                name: tc.function.name,
                arguments: (() => {
                    try {
                        return JSON.parse(tc.function.arguments);
                    } catch {
                        return {};
                    }
                })(),
            },
        }));
    }

    if (!toolCalls && content) {
        const parsed = parseToolCallsFromText(content);
        if (parsed.length > 0) toolCalls = parsed;
    }

    return { content, toolCalls, durationMs: Date.now() - start };
}

export type ToolsStreamChunk =
    | { type: "chunk"; content: string }
    | { type: "done"; content: string; toolCalls: OllamaToolCall[] | null };

/**
 * Chat completion with tools - STREAMING version
 */
export async function getChatCompletionWithToolsStream(
    messages: Array<
        | { role: "user" | "assistant" | "system"; content: string }
        | { role: "assistant"; content?: string; tool_calls?: OllamaToolCall[] }
        | { role: "tool"; tool_name: string; content: string }
    >,
    tools: OllamaToolDefinition[],
    options?: { maxTokens?: number; temperature?: number; modelId?: string },
): Promise<ReadableStream<ToolsStreamChunk>> {
    const groqTools = tools.map((t) => ({
        type: "function" as const,
        function: {
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
        },
    }));

    const { controller: fetchController, clear: clearInitial } =
        createTimeoutController(CHAT_INITIAL_TIMEOUT_MS);

    let response: Response;
    try {
        response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: options?.modelId || CHAT_MODEL,
                messages,
                max_tokens: options?.maxTokens ?? 2048,
                temperature: options?.temperature ?? 0.3,
                stream: true,
                tools: groqTools,
                tool_choice: "auto",
            }),
            signal: fetchController.signal,
        });
    } catch (fetchErr) {
        clearInitial();
        if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
            throw new Error(`Groq request timed out after ${CHAT_INITIAL_TIMEOUT_MS}ms`);
        }
        throw fetchErr;
    }

    clearInitial();

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Groq streaming error ${response.status}: ${errorText}`);
    }

    if (!response.body) throw new Error("No response body for streaming");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let totalContent = "";

    return new ReadableStream<ToolsStreamChunk>({
        async pull(streamController) {
            try {
                const chunkTimeout = setTimeout(() => {
                    reader.cancel();
                    streamController.error(new Error("Stream inactivity timeout"));
                }, CHAT_ACTIVITY_TIMEOUT_MS);

                const { done, value } = await reader.read();
                clearTimeout(chunkTimeout);

                if (done) {
                    const toolCalls = parseToolCallsFromText(totalContent);
                    streamController.enqueue({
                        type: "done",
                        content: totalContent,
                        toolCalls: toolCalls.length > 0 ? toolCalls : null,
                    });
                    streamController.close();
                    return;
                }

                const text = decoder.decode(value, { stream: true });
                buffer += text;
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith("data: ")) continue;
                    const data = trimmed.slice(6);
                    if (data === "[DONE]") {
                        const toolCalls = parseToolCallsFromText(totalContent);
                        streamController.enqueue({
                            type: "done",
                            content: totalContent,
                            toolCalls: toolCalls.length > 0 ? toolCalls : null,
                        });
                        streamController.close();
                        return;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta;
                        if (delta?.content) {
                            totalContent += delta.content;
                            streamController.enqueue({ type: "chunk", content: delta.content });
                        }
                    } catch { /* skip malformed */ }
                }
            } catch (error) {
                streamController.error(error);
            }
        },
        cancel() { reader.cancel(); },
    });
}

/**
 * Chat completion with streaming
 */
export async function getChatCompletionStream(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options?: { maxTokens?: number; temperature?: number; modelId?: string },
): Promise<ReadableStream<string>> {
    const { controller: fetchController, clear: clearInitial } =
        createTimeoutController(CHAT_INITIAL_TIMEOUT_MS);

    let response: Response;
    try {
        response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: options?.modelId || CHAT_MODEL,
                messages,
                max_tokens: options?.maxTokens ?? 1024,
                temperature: options?.temperature ?? 0.3,
                stream: true,
            }),
            signal: fetchController.signal,
        });
    } catch (fetchErr) {
        clearInitial();
        if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
            throw new Error(`Groq request timed out after ${CHAT_INITIAL_TIMEOUT_MS}ms`);
        }
        throw fetchErr;
    }

    clearInitial();

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Groq streaming error ${response.status}: ${errorText}`);
    }

    if (!response.body) throw new Error("No response body for streaming");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    return new ReadableStream<string>({
        async pull(streamController) {
            try {
                const chunkTimeout = setTimeout(() => {
                    reader.cancel();
                    streamController.close();
                }, CHAT_ACTIVITY_TIMEOUT_MS);

                const { done, value } = await reader.read();
                clearTimeout(chunkTimeout);

                if (done) {
                    streamController.close();
                    return;
                }

                const text = decoder.decode(value, { stream: true });
                buffer += text;
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith("data: ")) continue;
                    const data = trimmed.slice(6);
                    if (data === "[DONE]") {
                        streamController.close();
                        return;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) streamController.enqueue(content);
                    } catch { /* skip malformed */ }
                }
            } catch (error) {
                streamController.error(error);
            }
        },
        cancel() { reader.cancel(); },
    });
}

/**
 * Health check - verify Groq API is reachable
 */
export async function checkHealth(): Promise<{
    status: "connected" | "disconnected" | "error";
    models: string[];
    latencyMs: number;
    error?: string;
}> {
    const start = Date.now();

    try {
        const { controller, clear } = createTimeoutController(HEALTH_TIMEOUT_MS);
        const response = await fetch(`${GROQ_BASE_URL}/models`, {
            method: "GET",
            headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
            signal: controller.signal,
        });
        clear();

        if (!response.ok) throw new Error(`Groq API error ${response.status}`);

        const data = (await response.json()) as { data?: Array<{ id: string }> };
        const models = data.data?.map((m) => m.id) || [];

        return { status: "connected", models, latencyMs: Date.now() - start };
    } catch (error) {
        return {
            status: "disconnected",
            models: [],
            latencyMs: Date.now() - start,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get configuration info
 */
export function getOllamaConfig() {
    return {
        baseUrl: GROQ_BASE_URL,
        completionModel: COMPLETION_MODEL,
        chatModel: CHAT_MODEL,
        tutorModel: TUTOR_MODEL,
    };
}
