const fs = require('fs');

const inputFile = 'khoa_hoc_git_github_tu_co_ban_den_nang_cao.txt';
const outputFile = 'database/003_seed_git_course.sql';

const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

const course = {
  title: 'Git & GitHub từ Cơ bản đến Nâng cao',
  slug: 'git-github-tu-co-ban-den-nang-cao',
  description: 'Khóa học Git & GitHub toàn diện dành cho lập trình viên từ con số 0.',
  short_description: 'Nắm vững công cụ quản lý phiên bản quan trọng nhất và quy trình làm việc nhóm chuyên nghiệp.',
  thumbnail_url: '/images/courses/git-course-thumbnail.png',
  level: 'BEGINNER',
  duration: 1200,
  chapters: []
};

let currentChapter = null;
let currentLesson = null;

const chapterRegex = /^PHẦN\s+(\d+)\.\s+(.*)$/i;
const lessonRegex = /^(\d+)\.(\d+)\.\s+(.*)$/;

for (let line of lines) {
  line = line.replace('\r', '');
  
  const chapterMatch = line.match(chapterRegex);
  if (chapterMatch) {
    if (currentLesson) {
        currentLesson.content = currentLesson.content.trim();
    }
    
    const chapOrder = parseInt(chapterMatch[1], 10);
    
    let existingChapter = course.chapters.find(c => c.order === chapOrder);
    if (existingChapter) {
        currentChapter = existingChapter;
        currentChapter.lessons = []; // Clear any empty lessons from TOC
    } else {
        currentChapter = {
          order: chapOrder,
          title: `Chương ${chapterMatch[1]}: ${chapterMatch[2].trim()}`,
          lessons: []
        };
        course.chapters.push(currentChapter);
    }
    
    // Tạo 1 lesson duy nhất cho chương này
    currentLesson = {
        order: 1,
        title: `Nội dung: ${chapterMatch[2].trim()}`,
        content: ''
    };
    currentChapter.lessons.push(currentLesson);
    continue;
  }
  
  const lessonMatch = line.match(lessonRegex);
  if (lessonMatch) {
    // Treat it as a Markdown heading within the single lesson
    if (currentLesson) {
        currentLesson.content += `\n## ${lessonMatch[1]}.${lessonMatch[2]}. ${lessonMatch[3].trim()}\n\n`;
    }
    continue;
  }
  
  // Accumulate content if in a lesson
  if (currentLesson) {
    currentLesson.content += line + '\n';
  }
}

if (currentLesson) {
  currentLesson.content = currentLesson.content.trim();
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let sql = `-- ============================================
-- CodeMind — Seed Data cho Khóa học Git & GitHub
-- ============================================

DO $$
DECLARE
    v_category_id UUID;
    v_course_id UUID;
    v_chapter_id UUID;
BEGIN
    -- 1. TẠO DANH MỤC (NẾU CHƯA CÓ)
    INSERT INTO categories (name, slug, description, icon)
    VALUES (
        'Công cụ', 
        'cong-cu', 
        'Các công cụ hỗ trợ lập trình viên', 
        'Wrench'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_category_id;

    -- 2. TẠO KHÓA HỌC
    INSERT INTO courses (
        title, slug, description, short_description, thumbnail_url, 
        level, is_free, is_published, estimated_duration, 
        category_id, tags
    )
    VALUES (
        '${escapeSql(course.title)}', 
        '${escapeSql(course.slug)}', 
        '${escapeSql(course.description)}',
        '${escapeSql(course.short_description)}',
        '${escapeSql(course.thumbnail_url)}',
        '${escapeSql(course.level)}', 
        true, 
        true, 
        ${course.duration}, 
        v_category_id,
        ARRAY['git', 'github', 'devops', 'công cụ']
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        thumbnail_url = EXCLUDED.thumbnail_url,
        is_published = true
    RETURNING id INTO v_course_id;

    -- Xóa các chương cũ của khóa này (nếu chạy lại script)
    DELETE FROM chapters WHERE course_id = v_course_id;

`;

for (const chapter of course.chapters) {
    // Only insert chapters that have lessons, or keep them all.
    if (chapter.lessons.length === 0 && chapter.order > 0) continue; // Skip empty chapters unless they are part of something else. (Wait, let's include all valid ones)

    sql += `
    -- ============================================
    -- TẠO CHƯƠNG ${chapter.order}
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        '${escapeSql(chapter.title)}', 
        '',
        ${chapter.order}
    )
    RETURNING id INTO v_chapter_id;
`;

    for (const lesson of chapter.lessons) {
        sql += `
    -- BÀI: ${escapeSql(lesson.title)}
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        '${escapeSql(lesson.title)}', 
        'reading', 
        ${lesson.order}, 
        15,
        E'${escapeSql(lesson.content).replace(/\n/g, "\\n")}'
    );
`;
    }
}

sql += `
END $$;
`;

fs.writeFileSync(outputFile, sql);
console.log('Successfully generated SQL file: ' + outputFile);
