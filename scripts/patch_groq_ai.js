const fs = require('fs');

let content = fs.readFileSync('src/app/api/lessons/[lessonId]/questions/route.ts', 'utf8');

// 1. Add Groq import
content = content.replace(
    'import { requireAuth, AuthError } from "@/lib/auth-helpers";',
    'import { requireAuth, AuthError } from "@/lib/auth-helpers";\nimport Groq from "groq-sdk";\n\nconst groq = new Groq({ apiKey: process.env.GROQ_API_KEY });'
);

// 2. Add title and content to lessonData
content = content.replace(
    '        chapters!inner(',
    '        title,\n        content,\n        chapters!inner('
);

// 3. Add AI Auto-Reply logic
const autoReplyLogic = `
        // -------------------------------------------------------------------
        // GROQ AI AUTO-REPLY
        // -------------------------------------------------------------------
        try {
            // Find an admin user to act as the AI avatar
            const { data: adminUser } = await supabaseAdmin!
                .from("users")
                .select("id")
                .eq("role", "admin")
                .limit(1)
                .single();

            if (adminUser) {
                // Call Groq
                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: \`Bạn là CodeMind AI - Trợ lý giảng dạy lập trình thông minh của nền tảng CodeMind. 
Học viên đang hỏi một câu hỏi trong bài học "\${lessonData.title || 'Không rõ'}".
Nội dung bài học:
\${lessonData.content ? lessonData.content.substring(0, 3000) : 'Không có nội dung'}

Nhiệm vụ của bạn:
1. Trả lời câu hỏi của học viên một cách chính xác, ngắn gọn, dễ hiểu và cực kỳ thân thiện.
2. Luôn xưng hô "mình" và gọi học viên là "bạn".
3. Thêm một số biểu tượng cảm xúc (emoji) cho sinh động.
4. Trình bày code bằng Markdown nếu có.
5. Nếu câu hỏi nằm ngoài phạm vi bài học, hãy cố gắng giải đáp ngắn gọn và hướng dẫn họ tìm hiểu thêm.\`
                        },
                        {
                            role: "user",
                            content: \`Tiêu đề: \${title}\\nNội dung: \${content}\`
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_completion_tokens: 1024,
                });

                const aiAnswer = completion.choices[0]?.message?.content;

                if (aiAnswer) {
                    // Save to lesson_answers
                    await insert("lesson_answers", {
                        question_id: newQuestion.id,
                        user_id: adminUser.id,
                        content: aiAnswer,
                        is_accepted: false
                    });
                }
            }
        } catch (aiError) {
            console.error("Groq AI Error:", aiError);
            // Don't throw, we still want to return success for question creation
        }
        // -------------------------------------------------------------------

        return NextResponse.json({`;

content = content.replace('        return NextResponse.json({', autoReplyLogic);

fs.writeFileSync('src/app/api/lessons/[lessonId]/questions/route.ts', content);
console.log('Successfully injected Groq AI logic!');
