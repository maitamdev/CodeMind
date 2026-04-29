import { NextRequest } from "next/server";
import {
    getChatCompletionStream,
    getChatCompletion,
    getOllamaConfig,
} from "@/lib/ollama";

// System prompt for the AI coding assistant — expert-level, code-focused
const SYSTEM_PROMPT = `Bạn là Senior Software Engineer trên nền tảng CodeMind.

NGUYÊN TẮC CỐT LÕI:
1. CHỈ nói về code và kỹ thuật. KHÔNG lan man, KHÔNG nói chuyện phiếm, KHÔNG lặp lại câu hỏi.
2. Trả lời bằng TIẾNG VIỆT. Dùng thuật ngữ kỹ thuật gốc tiếng Anh khi cần (ví dụ: closure, hoisting, middleware).
3. Đi thẳng vào vấn đề. Câu đầu tiên phải là câu trả lời hoặc phân tích trực tiếp.

PHONG CÁCH TRẢ LỜI:
- Phân tích sâu: Giải thích WHY (tại sao) chứ không chỉ WHAT (cái gì). Nêu rõ cơ chế hoạt động bên dưới.
- Code mẫu chất lượng cao: Mọi code snippet phải chạy được, có comment ngắn gọn giải thích logic quan trọng. Dùng code block với language tag chính xác.
- Cấu trúc rõ ràng: Dùng markdown headings (##), bullet points (-), và code blocks. Không viết dạng đoạn văn dài.
- Nếu câu hỏi mơ hồ: Hỏi lại 1 câu ngắn gọn để làm rõ, không đoán.
- Nếu có nhiều cách giải quyết: Liệt kê ưu/nhược điểm từng cách, recommend cách tốt nhất.

CHUYÊN MÔN:
- Debug: Chỉ ra chính xác dòng lỗi, nguyên nhân gốc rễ (root cause), cách fix kèm code.
- Best practices: Clean code, SOLID, design patterns, performance optimization.
- Thuật toán: Phân tích time/space complexity (Big O). So sánh các approach.
- Security: Chỉ ra lỗ hổng cụ thể (XSS, injection, v.v.) nếu phát hiện.

TUYỆT ĐỐI KHÔNG:
- Không mở đầu bằng "Chào bạn", "Tất nhiên rồi", "Vâng, tôi sẽ giúp bạn".
- Không lặp lại đề bài hoặc tóm tắt câu hỏi của người dùng.
- Không thêm lời chúc, lời kết, hay câu hỏi "Bạn cần gì thêm không?".
- Không đưa code chưa hoàn chỉnh hoặc pseudo-code trừ khi được yêu cầu.`;

// Compact prompt for small models
const SYSTEM_PROMPT_LITE = `Senior dev. Answer in Vietnamese. Code only. No fluff. Use markdown code blocks. Explain WHY, not just WHAT.`;

// Detect small models that need reduced params
function isSmallModel(modelId?: string): boolean {
    if (!modelId) return false;
    return /[:\-](0\.5|1|1\.3|1\.5|3)b/i.test(modelId);
}

import { getOpenRouterCompletionStream } from "@/lib/openrouter";

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     tags:
 *       - Ai
 *     summary: API endpoint for /api/ai/chat
 *     description: Tự động sinh tài liệu cho POST /api/ai/chat. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
    try {
        const { messages, codeContext, language, modelId } =
            await request.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "messages array is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // Use compact prompt for small models, full prompt for larger ones
        const smallModel = isSmallModel(modelId);
        const systemPrompt = smallModel ? SYSTEM_PROMPT_LITE : SYSTEM_PROMPT;
        // Larger models: 4096 tokens for longer, higher-quality responses
        const maxTokens = smallModel ? 512 : 4096;

        // Build messages array with system prompt
        const ollamaMessages: Array<{
            role: "user" | "assistant" | "system";
            content: string;
        }> = [{ role: "system", content: systemPrompt }];

        // Add code context if provided
        if (codeContext) {
            const langLabel = language || "code";
            ollamaMessages.push({
                role: "system",
                content: `Học viên đang làm việc với đoạn code ${langLabel} sau:\n\`\`\`${langLabel}\n${codeContext}\n\`\`\``,
            });
        }

        // Add user messages (map from our format to Ollama format)
        for (const msg of messages) {
            if (msg.role === "user" || msg.role === "assistant") {
                ollamaMessages.push({
                    role: msg.role,
                    content: msg.content,
                });
            }
        }

        // Try streaming first
        const encoder = new TextEncoder();

        const toSSE = (content: string, done: boolean, error?: string) =>
            encoder.encode(
                `data: ${JSON.stringify({ content, done, ...(error && { error }) })}\n\n`,
            );

        let stream: ReadableStream<string>;
        let effectiveModelId = modelId;
        const opts = {
            maxTokens,
            temperature: smallModel ? 0.2 : 0.25,
            modelId: effectiveModelId,
        };

        // --- Model Provider Switching ---
        if (effectiveModelId?.includes("/")) {
            // OpenRouter models always have a slash (e.g., meta-llama/llama-3-8b-instruct:free)
            stream = await getOpenRouterCompletionStream(ollamaMessages, opts);
        } else {
            try {
                stream = await getChatCompletionStream(ollamaMessages, opts);
            } catch (streamErr) {
            const errMsg =
                streamErr instanceof Error
                    ? streamErr.message
                    : String(streamErr);
            // Fallback: model not found (404) -> retry with default chat model
            if (errMsg.includes("404") && errMsg.includes("not found")) {
                const { chatModel } = getOllamaConfig();
                effectiveModelId = chatModel;
                try {
                    stream = await getChatCompletionStream(ollamaMessages, {
                        ...opts,
                        modelId: effectiveModelId,
                    });
                } catch (retryErr) {
                    const retryMsg =
                        retryErr instanceof Error
                            ? retryErr.message
                            : String(retryErr);
                    if (
                        retryMsg.includes("405") ||
                        retryMsg.includes("method not allowed")
                    ) {
                        const { content } = await getChatCompletion(
                            ollamaMessages,
                            { ...opts, modelId: effectiveModelId },
                        );
                        stream = new ReadableStream({
                            start(controller) {
                                if (content) controller.enqueue(content);
                                controller.close();
                            },
                        });
                    } else {
                        throw retryErr;
                    }
                }
            } else if (
                errMsg.includes("405") ||
                errMsg.includes("method not allowed")
            ) {
                const { content } = await getChatCompletion(ollamaMessages, opts);
                stream = new ReadableStream({
                    start(controller) {
                        if (content) controller.enqueue(content);
                        controller.close();
                    },
                });
            } else {
                throw streamErr;
            }
        }
        }

        // Convert to SSE (Server-Sent Events) format
        const sseStream = new ReadableStream({
            async start(controller) {
                const reader = stream.getReader();

                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.enqueue(toSSE("", true));
                            controller.close();
                            break;
                        }

                        controller.enqueue(toSSE(value, false));
                    }
                } catch (error) {
                    const message =
                        error instanceof Error ? error.message : "Stream error";
                    controller.enqueue(toSSE("", true, message));
                    controller.close();
                }
            },
        });

        return new Response(sseStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error) {
        // Check if error is AbortError (user triggered Stop or disconnected)
        const isAbort =
            error instanceof Error &&
            (error.name === "AbortError" || error.message.includes("aborted"));

        if (isAbort) {
            console.log("AI Chat: Request was aborted by the client.");
        } else {
            console.error("AI Chat Error:", error);
        }

        const message =
            error instanceof Error ? error.message : "Unknown error";

        if (isAbort) {
            return new Response(null, { status: 499 }); // 499 Client Closed Request
        }

        if (message.includes("timed out")) {
            return new Response(
                JSON.stringify({
                    error: "AI server timed out",
                    details: message,
                }),
                {
                    status: 504,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        if (message.includes("fetch") || message.includes("ECONNREFUSED")) {
            return new Response(
                JSON.stringify({
                    error: "AI server is not reachable",
                    details: message,
                }),
                {
                    status: 503,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        return new Response(
            JSON.stringify({
                error: "Failed to process chat",
                details: message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
