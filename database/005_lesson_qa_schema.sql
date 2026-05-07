-- ============================================
-- CodeMind — Lesson Q&A System Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. LESSON QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS lesson_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    answers_count INT DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LESSON ANSWERS TABLE
CREATE TABLE IF NOT EXISTS lesson_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES lesson_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LESSON QUESTION LIKES TABLE
CREATE TABLE IF NOT EXISTS lesson_question_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES lesson_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(question_id, user_id)
);

-- 4. LESSON ANSWER LIKES TABLE
CREATE TABLE IF NOT EXISTS lesson_answer_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES lesson_answers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(answer_id, user_id)
);

-- ============================================
-- Triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_qa_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_questions_updated_at ON lesson_questions;
CREATE TRIGGER lesson_questions_updated_at
    BEFORE UPDATE ON lesson_questions
    FOR EACH ROW EXECUTE FUNCTION update_qa_updated_at_column();

DROP TRIGGER IF EXISTS lesson_answers_updated_at ON lesson_answers;
CREATE TRIGGER lesson_answers_updated_at
    BEFORE UPDATE ON lesson_answers
    FOR EACH ROW EXECUTE FUNCTION update_qa_updated_at_column();

-- ============================================
-- Triggers for counts
-- ============================================

-- Auto-update answers count
CREATE OR REPLACE FUNCTION update_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE lesson_questions SET answers_count = answers_count + 1 WHERE id = NEW.question_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE lesson_questions SET answers_count = GREATEST(answers_count - 1, 0) WHERE id = OLD.question_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS answer_count_trigger ON lesson_answers;
CREATE TRIGGER answer_count_trigger
    AFTER INSERT OR DELETE ON lesson_answers
    FOR EACH ROW EXECUTE FUNCTION update_question_answers_count();

-- Auto-update question likes count
CREATE OR REPLACE FUNCTION update_question_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE lesson_questions SET likes_count = likes_count + 1 WHERE id = NEW.question_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE lesson_questions SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.question_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS question_likes_trigger ON lesson_question_likes;
CREATE TRIGGER question_likes_trigger
    AFTER INSERT OR DELETE ON lesson_question_likes
    FOR EACH ROW EXECUTE FUNCTION update_question_likes_count();

-- Auto-update answer likes count
CREATE OR REPLACE FUNCTION update_answer_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE lesson_answers SET likes_count = likes_count + 1 WHERE id = NEW.answer_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE lesson_answers SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.answer_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS answer_likes_trigger ON lesson_answer_likes;
CREATE TRIGGER answer_likes_trigger
    AFTER INSERT OR DELETE ON lesson_answer_likes
    FOR EACH ROW EXECUTE FUNCTION update_answer_likes_count();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lesson_questions_lesson ON lesson_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_user ON lesson_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_answers_question ON lesson_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_lesson_answers_user ON lesson_answers(user_id);
