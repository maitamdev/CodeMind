-- ==========================================
-- CodeMind Auth Schema
-- This script creates the necessary tables for the authentication system
-- Execute this in the Supabase SQL Editor
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    membership_type VARCHAR(20) DEFAULT 'FREE',
    membership_expires_at TIMESTAMP WITH TIME ZONE,
    learning_streak INTEGER DEFAULT 0,
    total_study_time INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the user_roles table for RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the user_metadata table (for recovery keys, etc.)
CREATE TABLE IF NOT EXISTS public.user_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    meta_key VARCHAR(100) NOT NULL,
    meta_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create public_profiles table
CREATE TABLE IF NOT EXISTS public.public_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    headline VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    location VARCHAR(255),
    website_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create professional_profiles table
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    profile_roles JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'DRAFT',
    headline VARCHAR(255),
    summary TEXT,
    years_experience INTEGER DEFAULT 0,
    current_title VARCHAR(255),
    current_organization VARCHAR(255),
    location VARCHAR(255),
    skills JSONB DEFAULT '[]'::jsonb,
    education_items JSONB DEFAULT '[]'::jsonb,
    career_items JSONB DEFAULT '[]'::jsonb,
    achievement_items JSONB DEFAULT '[]'::jsonb,
    featured_links JSONB DEFAULT '[]'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create user_verifications table
CREATE TABLE IF NOT EXISTS public.user_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Note: Ensure Row Level Security (RLS) is configured properly or 
-- rely on server-side Next.js APIs bypassing RLS with service_role_key.
