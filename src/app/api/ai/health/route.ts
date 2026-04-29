import { NextResponse } from "next/server"
import { checkHealth, getOllamaConfig } from "@/lib/ollama"

/**
 * @swagger
 * /api/ai/health:
 *   get:
 *     tags:
 *       - Ai
 *     summary: API endpoint for /api/ai/health
 *     description: Tự động sinh tài liệu cho GET /api/ai/health. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET() {
  try {
    const config = getOllamaConfig()
    const health = await checkHealth()

    return NextResponse.json({
      status: health.status,
      models: health.models,
      baseUrl: config.baseUrl,
      completionModel: config.completionModel,
      chatModel: config.chatModel,
      tutorModel: config.tutorModel,
      latencyMs: health.latencyMs,
      error: health.error,
    })
  } catch (error) {
    console.error("AI Health Check Error:", error)

    return NextResponse.json({
      status: "error",
      models: [],
      baseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
      completionModel: process.env.GROQ_COMPLETION_MODEL || "llama-3.1-8b-instant",
      chatModel: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
      tutorModel: process.env.GROQ_TUTOR_MODEL || "llama-3.3-70b-versatile",
      latencyMs: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
