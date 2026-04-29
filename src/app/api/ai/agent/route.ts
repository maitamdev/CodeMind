import { NextRequest, NextResponse } from "next/server";
import {
    getChatCompletionWithTools,
    getChatCompletionWithToolsStream,
} from "@/lib/ollama";
import { PLAYGROUND_TOOLS } from "@/lib/agent-tools";

const AGENT_SYSTEM_PROMPT = `Bạn là AI Code Agent trên CodeMind. Bạn CÓ QUYỀN đọc và sửa code trực tiếp trong Playground.

CÔNG CỤ:
- edit_code(tab, content): Ghi đè toàn bộ nội dung một tab. tab = "html" | "css" | "javascript". content = source code đầy đủ.

QUY TRÌNH XỬ LÝ:
1. Phân tích code hiện tại và yêu cầu của người dùng.
2. Nếu cần sửa code: Giải thích ngắn gọn thay đổi (2-3 dòng), sau đó gọi tool. KHÔNG giải thích dài dòng trước khi hành động.
3. Nếu chỉ cần giải thích: Trả lời bằng văn bản thuần, đi thẳng vào vấn đề.

GỌI TOOL — JSON thuần, KHÔNG markdown, KHÔNG text trước/sau:
{"name":"edit_code","arguments":{"tab":"html","content":"<!DOCTYPE html>..."}}

QUY TẮC:
- Trả lời bằng TIẾNG VIỆT. Dùng thuật ngữ kỹ thuật gốc tiếng Anh.
- content trong edit_code phải là SOURCE CODE ĐẦY ĐỦ của tab, không viết tắt, không dùng "// ...phần còn lại".
- Giữ nguyên các phần code không liên quan đến yêu cầu.
- KHÔNG mở đầu bằng lời chào. KHÔNG kết thúc bằng câu hỏi. KHÔNG lặp lại yêu cầu.
- Khi giải thích code: chỉ ra WHY chứ không chỉ WHAT. Nêu root cause nếu debug.`;

import { getOpenRouterChatWithToolsStream } from "@/lib/openrouter";

/**
 * @swagger
 * /api/ai/agent:
 *   post:
 *     tags:
 *       - Ai
 *     summary: API endpoint for /api/ai/agent
 *     description: Tự động sinh tài liệu cho POST /api/ai/agent. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, code, modelId } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "messages array is required" },
                { status: 400 },
            );
        }

        // Build Ollama messages
        const ollamaMessages: Array<
            | { role: "user" | "assistant" | "system"; content: string }
            | {
                  role: "assistant";
                  content?: string;
                  tool_calls?: Array<{
                      type: "function";
                      function: {
                          index?: number;
                          name: string;
                          arguments?: string | Record<string, unknown>;
                      };
                  }>;
              }
            | { role: "tool"; tool_name: string; content: string }
        > = [{ role: "system", content: AGENT_SYSTEM_PROMPT }];

        // Inject current code so model can edit directly
        if (code && typeof code === "object") {
            const codeCtx = `[CODE HIỆN TẠI TRONG PLAYGROUND - dùng edit_code để sửa]
HTML:
\`\`\`
${String(code.html || "").slice(0, 3000)}
\`\`\`
CSS:
\`\`\`
${String(code.css || "").slice(0, 2000)}
\`\`\`
JavaScript:
\`\`\`
${String(code.javascript || "").slice(0, 3000)}
\`\`\``;
            ollamaMessages.push({ role: "system", content: codeCtx });
        }

        // Map incoming messages
        for (const msg of messages) {
            if (msg.role === "user" && msg.content) {
                ollamaMessages.push({ role: "user", content: msg.content });
            } else if (msg.role === "assistant") {
                if (msg.tool_calls && msg.tool_calls.length > 0) {
                    ollamaMessages.push({
                        role: "assistant",
                        content: msg.content || "",
                        tool_calls: msg.tool_calls,
                    });
                } else if (msg.content) {
                    ollamaMessages.push({
                        role: "assistant",
                        content: msg.content,
                    });
                }
            } else if (msg.role === "tool" && msg.tool_name && msg.content) {
                ollamaMessages.push({
                    role: "tool",
                    tool_name: msg.tool_name,
                    content: msg.content,
                });
            }
        }

        const agentModel = modelId || "llama-3.3-70b-versatile";

        const opts = {
            modelId: agentModel,
            maxTokens: 2048,
            temperature: 0.2,
        };

        // --- Model Provider Switching ---
        let stream: ReadableStream<any>;
        
        if (agentModel.includes("/")) {
            stream = await getOpenRouterChatWithToolsStream(
                ollamaMessages,
                PLAYGROUND_TOOLS,
                opts,
            );
        } else {
            try {
                stream = await getChatCompletionWithToolsStream(
                    ollamaMessages,
                    PLAYGROUND_TOOLS,
                    opts,
                );
            } catch (streamErr) {
            const errMsg =
                streamErr instanceof Error
                    ? streamErr.message
                    : String(streamErr);
            if (
                errMsg.includes("405") ||
                errMsg.includes("method not allowed") ||
                errMsg.includes("fetch")
            ) {
                const result = await getChatCompletionWithTools(
                    ollamaMessages,
                    PLAYGROUND_TOOLS,
                    opts,
                );
                return Response.json({
                    content: result.content,
                    toolCalls: result.toolCalls,
                    durationMs: result.durationMs,
                });
            }
            throw streamErr;
        }
        }

        const encoder = new TextEncoder();
        const toSSE = (obj: object) =>
            encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

        const sseStream = new ReadableStream({
            async start(controller) {
                const reader = stream.getReader();
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (value.type === "chunk") {
                            controller.enqueue(
                                toSSE({
                                    content: value.content,
                                    done: false,
                                }),
                            );
                        } else if (value.type === "done") {
                            controller.enqueue(
                                toSSE({
                                    content: value.content,
                                    toolCalls: value.toolCalls,
                                    done: true,
                                }),
                            );
                            break;
                        }
                    }
                } catch (error) {
                    const msg =
                        error instanceof Error
                            ? error.message
                            : "Stream error";
                    controller.enqueue(
                        toSSE({ content: "", done: true, error: msg }),
                    );
                }
                controller.close();
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
        console.error("AI Agent Error:", error);
        const message =
            error instanceof Error ? error.message : "Unknown error";

        const isAbort =
            error instanceof Error && error.name === "AbortError";

        if (message.includes("timed out") || isAbort) {
            return Response.json(
                {
                    error: "AI model đang tải, vui lòng thử lại sau vài giây",
                    details: message,
                },
                { status: 504 },
            );
        }
        if (message.includes("fetch") || message.includes("ECONNREFUSED")) {
            return Response.json(
                { error: "AI server is not reachable", details: message },
                { status: 503 },
            );
        }

        return Response.json(
            { error: "Failed to process agent request", details: message },
            { status: 500 },
        );
    }
}
