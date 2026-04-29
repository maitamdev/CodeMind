import { NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/ollama";

const SYSTEM_PROMPT = `Bạn là một AI Tutor xuất sắc về IT/Lập trình.
Nhiệm vụ của bạn là giải thích một chủ đề (node) trong lộ trình học tập.

ĐẦU RA BẮT BUỘC (Trả về ĐÚNG chuẩn JSON, không có text dư thừa):
{
  "description": "Giải thích ngắn gọn, dễ hiểu về chủ đề này (khoảng 3-4 câu).",
  "related_concepts": ["Khái niệm 1", "Khái niệm 2", "Khái niệm 3"],
  "free_resources": [
    {
      "type": "article", // hoặc "video", "course"
      "title": "Tên tài liệu",
      "url": "Đường link thực tế (ví dụ link MDN, YouTube, v.v)",
      "source": "Nguồn (VD: MDN, YouTube, FreeCodeCamp)"
    }
  ],
  "ai_tutor_content": "Lời khuyên từ AI Tutor: Nên học phần này như thế nào, lỗi sai phổ biến người học hay mắc phải là gì?",
  "premium_resources": []
}

Hãy viết bằng Tiếng Việt. Đảm bảo URL là thực tế hoặc format chuẩn. Nếu không tìm được URL, hãy đưa ra đường link tìm kiếm Google hoặc YouTube.`;

/**
 * @swagger
 * /api/roadmap/node-detail:
 *   post:
 *     tags:
 *       - Roadmap AI
 *     summary: Tạo chi tiết cho một Node (bài học) bằng AI
 *     description: Gọi API Groq để phân tích và sinh ra nội dung giải thích, tài liệu học tập cho một chủ đề cụ thể.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "React Hooks"
 *               context:
 *                 type: string
 *                 example: "Lập trình Frontend cơ bản"
 *               user_level:
 *                 type: string
 *                 example: "beginner"
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của node
 *       400:
 *         description: Thiếu topic
 *       500:
 *         description: Lỗi máy chủ hoặc lỗi parse JSON
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, context, user_level } = body;

        if (!topic) {
            return NextResponse.json({ error: "Thiếu topic" }, { status: 400 });
        }

        const userPrompt = `Hãy phân tích chủ đề: "${topic}". \nNgữ cảnh lộ trình: ${context || "Không có"}. \nTrình độ người học: ${user_level || "intermediate"}.`;

        const result = await getChatCompletion(
            [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            { maxTokens: 1500, temperature: 0.7, modelId: "llama-3.3-70b-versatile" }
        );

        const content = result.content;
        
        if (!content) {
            throw new Error("Không có content trả về từ AI");
        }

        let parsedData;
        try {
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[1]);
            } else {
                parsedData = JSON.parse(content);
            }
        } catch (parseError) {
            console.error("Lỗi parse JSON từ AI:", content);
            return NextResponse.json({ error: "AI trả về sai định dạng", content }, { status: 500 });
        }

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Lỗi trong API node-detail:", error);
        return NextResponse.json({ error: "Lỗi Server", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
