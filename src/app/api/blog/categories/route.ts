import { NextResponse } from "next/server"
import { queryBuilder } from "@/lib/db-helpers"

/**
 * @swagger
 * /api/blog/categories:
 *   get:
 *     tags:
 *       - Blog
 *     summary: API endpoint for /api/blog/categories
 *     description: Tự động sinh tài liệu cho GET /api/blog/categories. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function GET() {
  try {
    const results = await queryBuilder<any>('blog_categories', {
      select: '*',
      orderBy: { column: 'name', ascending: true },
    })
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("Get categories error:", error)
    // Return empty array instead of 500 so the UI doesn't break when table is missing
    return NextResponse.json([])
  }
}
