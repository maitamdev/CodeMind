import { NextRequest, NextResponse } from 'next/server';
import { queryBuilder } from '@/lib/db';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
  is_published: number;
}

/**
 * GET /api/chapters/[chapterId]/lessons
 * Lấy danh sách lessons của một chapter
 */
/**
 * @swagger
 * /api/chapters/[chapterId]/lessons:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: API endpoint for /api/chapters/[chapterId]/lessons
 *     description: Tự động sinh tài liệu cho GET /api/chapters/[chapterId]/lessons. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    const lessons = await queryBuilder<Lesson>(
      'lessons',
      {
        select: 'id, title, content, sort_order, is_published',
        filters: { chapter_id: chapterId },
        orderBy: { column: 'sort_order', ascending: true }
      }
    );

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài học' },
      { status: 500 }
    );
  }
}
