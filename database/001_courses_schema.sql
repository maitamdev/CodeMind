-- ============================================
-- CodeMind — Courses System Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    trailer_url TEXT,
    level VARCHAR(20) DEFAULT 'BEGINNER',
    price DECIMAL(10,2) DEFAULT 0,
    is_free BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    estimated_duration INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    total_students INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    lesson_type VARCHAR(30) DEFAULT 'reading',
    video_url TEXT,
    youtube_backup_url TEXT,
    video_duration INT DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress DECIMAL(5,2) DEFAULT 0,
    UNIQUE(user_id, course_id)
);

-- 6. LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, lesson_id)
);

-- 7. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_name VARCHAR(255) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_code VARCHAR(50) UNIQUE,
    UNIQUE(user_id, course_id)
);

-- 8. COURSE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================
-- ADD MISSING COLUMNS (safe for existing tables)
-- ============================================
DO $$
BEGIN
    -- chapters.sort_order
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='sort_order') THEN
        ALTER TABLE chapters ADD COLUMN sort_order INT DEFAULT 0;
    END IF;
    -- chapters.description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='description') THEN
        ALTER TABLE chapters ADD COLUMN description TEXT;
    END IF;
    -- lessons.sort_order
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='sort_order') THEN
        ALTER TABLE lessons ADD COLUMN sort_order INT DEFAULT 0;
    END IF;
    -- lessons.content
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='content') THEN
        ALTER TABLE lessons ADD COLUMN content TEXT;
    END IF;
    -- lessons.lesson_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='lesson_type') THEN
        ALTER TABLE lessons ADD COLUMN lesson_type VARCHAR(30) DEFAULT 'reading';
    END IF;
    -- lessons.youtube_backup_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='youtube_backup_url') THEN
        ALTER TABLE lessons ADD COLUMN youtube_backup_url TEXT;
    END IF;
    -- lessons.is_preview
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='is_preview') THEN
        ALTER TABLE lessons ADD COLUMN is_preview BOOLEAN DEFAULT FALSE;
    END IF;
    -- courses.short_description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='short_description') THEN
        ALTER TABLE courses ADD COLUMN short_description TEXT;
    END IF;
    -- courses.trailer_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='trailer_url') THEN
        ALTER TABLE courses ADD COLUMN trailer_url TEXT;
    END IF;
    -- courses.learning_outcomes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='learning_outcomes') THEN
        ALTER TABLE courses ADD COLUMN learning_outcomes JSONB DEFAULT '[]'::jsonb;
    END IF;
    -- courses.requirements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='requirements') THEN
        ALTER TABLE courses ADD COLUMN requirements JSONB DEFAULT '[]'::jsonb;
    END IF;
    -- courses.tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='tags') THEN
        ALTER TABLE courses ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    -- enrollments.progress
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='progress') THEN
        ALTER TABLE enrollments ADD COLUMN progress DECIMAL(5,2) DEFAULT 0;
    END IF;
    -- enrollments.completed_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='completed_at') THEN
        ALTER TABLE enrollments ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
    -- categories.sort_order
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='sort_order') THEN
        ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0;
    END IF;
    -- categories.icon
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='icon') THEN
        ALTER TABLE categories ADD COLUMN icon VARCHAR(50);
    END IF;
END $$;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_chapters_course ON chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(chapter_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);

-- ============================================
-- RPC Functions
-- ============================================

-- Function: Get courses with details (used by /api/courses)
CREATE OR REPLACE FUNCTION get_courses_with_details(
    p_limit INT DEFAULT 12,
    p_offset INT DEFAULT 0,
    p_level TEXT DEFAULT NULL,
    p_is_free BOOLEAN DEFAULT NULL,
    p_category_slug TEXT DEFAULT NULL,
    p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    level TEXT,
    price DECIMAL,
    is_free BOOLEAN,
    estimated_duration INT,
    rating DECIMAL,
    total_students INT,
    total_lessons INT,
    category_name TEXT,
    category_slug TEXT,
    instructor_id UUID,
    instructor_name TEXT,
    instructor_username TEXT,
    instructor_avatar_url TEXT,
    instructor_membership_type TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.title::TEXT,
        c.slug::TEXT,
        c.short_description::TEXT,
        c.thumbnail_url::TEXT,
        c.level::TEXT,
        c.price,
        c.is_free,
        c.estimated_duration,
        c.rating,
        c.total_students,
        c.total_lessons,
        cat.name::TEXT AS category_name,
        cat.slug::TEXT AS category_slug,
        c.instructor_id,
        u.full_name::TEXT AS instructor_name,
        u.username::TEXT AS instructor_username,
        u.avatar_url::TEXT AS instructor_avatar_url,
        u.membership_type::TEXT AS instructor_membership_type,
        c.created_at
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE c.is_published = TRUE
        AND (p_level IS NULL OR c.level = p_level)
        AND (p_is_free IS NULL OR c.is_free = p_is_free)
        AND (p_category_slug IS NULL OR cat.slug = p_category_slug)
        AND (p_search IS NULL OR c.title ILIKE '%' || p_search || '%' OR c.short_description ILIKE '%' || p_search || '%')
    ORDER BY c.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function: Count courses with filters
CREATE OR REPLACE FUNCTION count_courses_with_filters(
    p_level TEXT DEFAULT NULL,
    p_is_free BOOLEAN DEFAULT NULL,
    p_category_slug TEXT DEFAULT NULL,
    p_search TEXT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    result INT;
BEGIN
    SELECT COUNT(*)::INT INTO result
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.is_published = TRUE
        AND (p_level IS NULL OR c.level = p_level)
        AND (p_is_free IS NULL OR c.is_free = p_is_free)
        AND (p_category_slug IS NULL OR cat.slug = p_category_slug)
        AND (p_search IS NULL OR c.title ILIKE '%' || p_search || '%' OR c.short_description ILIKE '%' || p_search || '%');
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courses_updated_at ON courses;
CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS lessons_updated_at ON lessons;
CREATE TRIGGER lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update course student count
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE courses SET total_students = total_students + 1 WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses SET total_students = GREATEST(total_students - 1, 0) WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enrollment_count_trigger ON enrollments;
CREATE TRIGGER enrollment_count_trigger
    AFTER INSERT OR DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_student_count();

-- Auto-update total_lessons count
CREATE OR REPLACE FUNCTION update_course_lesson_count()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_count INT;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        SELECT ch.course_id INTO v_course_id FROM chapters ch WHERE ch.id = NEW.chapter_id;
    ELSE
        SELECT ch.course_id INTO v_course_id FROM chapters ch WHERE ch.id = OLD.chapter_id;
    END IF;

    SELECT COUNT(*)::INT INTO v_count
    FROM lessons l
    JOIN chapters ch ON l.chapter_id = ch.id
    WHERE ch.course_id = v_course_id;

    UPDATE courses SET total_lessons = v_count WHERE id = v_course_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_count_trigger ON lessons;
CREATE TRIGGER lesson_count_trigger
    AFTER INSERT OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_course_lesson_count();
