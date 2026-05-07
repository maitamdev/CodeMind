-- ============================================
-- CodeMind — Exercises System Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. EXERCISES TABLE
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'multiple_choice', -- 'multiple_choice', 'fill_in_the_blank', 'code'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'BEGINNER',
    xp_reward INT DEFAULT 10,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXERCISE OPTIONS TABLE (For Multiple Choice)
CREATE TABLE IF NOT EXISTS exercise_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    explanation TEXT
);

-- 3. EXERCISE CODE BLOCKS TABLE (For Fill-in-the-blank or Code)
CREATE TABLE IF NOT EXISTS exercise_code_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    language VARCHAR(50) DEFAULT 'python',
    code_template TEXT,
    blanks JSONB DEFAULT '[]'::jsonb
);

-- 4. USER EXERCISE PROGRESS TABLE
CREATE TABLE IF NOT EXISTS user_exercise_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- ============================================
-- Triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS exercises_updated_at ON exercises;
CREATE TRIGGER exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_options_exercise ON exercise_options(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_code_blocks_exercise ON exercise_code_blocks(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_progress_user ON user_exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_progress_exercise ON user_exercise_progress(exercise_id);
