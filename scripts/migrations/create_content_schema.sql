-- ==========================================
-- CodeMind Content Schema
-- This script creates the content-related tables (Courses, Blogs, Q&A)
-- Execute this in the Supabase SQL Editor
-- ==========================================

-- Clean up any incorrectly created tables from previous runs
DROP TABLE IF EXISTS public.lesson_answers CASCADE;
DROP TABLE IF EXISTS public.lesson_questions CASCADE;
DROP TABLE IF EXISTS public.blog_post_tags CASCADE;
DROP TABLE IF EXISTS public.blog_post_categories CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.blog_tags CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;

-- ==========================================
-- COURSE SCHEMA
-- ==========================================

-- 1. Create course categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    thumbnail_url TEXT,
    level VARCHAR(50) DEFAULT 'BEGINNER',
    price DECIMAL(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    instructor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- ==========================================
-- Q&A SCHEMA (Lesson Questions)
-- ==========================================

-- 6. Create lesson questions table
CREATE TABLE IF NOT EXISTS public.lesson_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    answers_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create lesson answers table
CREATE TABLE IF NOT EXISTS public.lesson_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.lesson_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- BLOG SCHEMA
-- ==========================================

-- 8. Create blog categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create blog tags
CREATE TABLE IF NOT EXISTS public.blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create blog relations
CREATE TABLE IF NOT EXISTS public.blog_post_categories (
    post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.blog_post_tags (
    post_id INTEGER REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 12. Forum tables
CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- 14. Gamification table
CREATE TABLE IF NOT EXISTS public.user_gamification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. AI Roadmap tables
CREATE TABLE IF NOT EXISTS public.ai_generated_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_estimated_hours INTEGER DEFAULT 0,
    nodes JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_roadmap_node_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES public.ai_generated_roadmaps(id) ON DELETE CASCADE,
    node_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'not_started',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, roadmap_id, node_id)
);
