/**
 * OpenRouter AI Client for CodeMind Platform
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export async function getOpenRouterCompletionStream(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options?: { maxTokens?: number; temperature?: number; modelId?: string }
): Promise<ReadableStream<string>> {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://codemind.edu.vn", // Thay bằng domain của bạn nếu có
            "X-Title": "CodeMind E-Learning",
        },
        body: JSON.stringify({
            model: options?.modelId || "meta-llama/llama-3-8b-instruct:free",
            messages,
            max_tokens: options?.maxTokens || 2048,
            temperature: options?.temperature || 0.3,
            stream: true,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
    }

    if (!response.body) throw new Error("No response body from OpenRouter");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    
    return new ReadableStream<string>({
        async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
                controller.close();
                return;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;
                
                const data = trimmed.slice(6);
                if (data === "[DONE]") {
                    controller.close();
                    return;
                }

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(content);
                    }
                } catch (e) {
                    // Skip malformed JSON
                }
            }
        },
        cancel() {
            reader.cancel();
        }
    });
}

/**
 * Chat completion with tools for OpenRouter - STREAMING version
 */
export async function getOpenRouterChatWithToolsStream(
    messages: Array<any>,
    tools: any[],
    options?: { maxTokens?: number; temperature?: number; modelId?: string }
): Promise<ReadableStream<{ type: "chunk" | "done"; content: string; toolCalls: any[] | null }>> {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://codemind.edu.vn",
            "X-Title": "CodeMind E-Learning",
        },
        body: JSON.stringify({
            model: options?.modelId || "meta-llama/llama-3-8b-instruct:free",
            messages,
            tools: tools.map(t => ({
                type: "function",
                function: {
                    name: t.function.name,
                    description: t.function.description,
                    parameters: t.function.parameters,
                }
            })),
            tool_choice: "auto",
            max_tokens: options?.maxTokens || 2048,
            temperature: options?.temperature || 0.2,
            stream: true,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter Agent error ${response.status}: ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let totalContent = "";
    let finalToolCalls: any[] = [];

    return new ReadableStream({
        async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
                // Parse tool calls from total content if not sent as structured data
                if (finalToolCalls.length === 0 && totalContent.includes('"name":')) {
                    // Simple manual parsing fallback for models that don't support native tool calls well
                    try {
                        const match = totalContent.match(/\{"name":\s*"edit_code"[\s\S]*?\}/);
                        if (match) {
                            const parsed = JSON.parse(match[0]);
                            finalToolCalls.push({
                                type: "function",
                                function: { name: parsed.name, arguments: parsed.arguments }
                            });
                        }
                    } catch (e) {}
                }
                controller.enqueue({ type: "done", content: totalContent, toolCalls: finalToolCalls.length > 0 ? finalToolCalls : null });
                controller.close();
                return;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;
                const data = trimmed.slice(6);
                if (data === "[DONE]") continue;

                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta;
                    
                    if (delta?.content) {
                        totalContent += delta.content;
                        controller.enqueue({ type: "chunk", content: delta.content, toolCalls: null });
                    }
                    
                    if (delta?.tool_calls) {
                        for (const tc of delta.tool_calls) {
                            if (tc.function) {
                                // Simple accumulation for streaming tool calls
                                let existing = finalToolCalls.find(f => f.index === tc.index);
                                if (!existing) {
                                    existing = { index: tc.index, type: "function", function: { name: tc.function.name, arguments: "" } };
                                    finalToolCalls.push(existing);
                                }
                                if (tc.function.arguments) {
                                    existing.function.arguments += tc.function.arguments;
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        },
        cancel() { reader.cancel(); }
    });
}
