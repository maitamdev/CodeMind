-- ==========================================
-- CodeMind Course RPC Functions
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- Function 1: count_courses_with_filters
-- Returns the total count of courses matching the filters
CREATE OR REPLACE FUNCTION public.count_courses_with_filters(
    p_level VARCHAR DEFAULT NULL,
    p_is_free BOOLEAN DEFAULT NULL,
    p_category_slug VARCHAR DEFAULT NULL,
    p_search VARCHAR DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.courses c
    LEFT JOIN public.categories cat ON c.category_id = cat.id
    WHERE 
        c.is_published = TRUE
        AND (p_level IS NULL OR c.level = p_level)
        AND (p_is_free IS NULL OR c.is_free = p_is_free)
        AND (p_category_slug IS NULL OR cat.slug = p_category_slug)
        AND (p_search IS NULL OR c.title ILIKE '%' || p_search || '%');
        
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function 2: get_courses_with_details
-- Returns paginated courses with instructor and category details
CREATE OR REPLACE FUNCTION public.get_courses_with_details(
    p_limit INTEGER DEFAULT 12,
    p_offset INTEGER DEFAULT 0,
    p_level VARCHAR DEFAULT NULL,
    p_is_free BOOLEAN DEFAULT NULL,
    p_category_slug VARCHAR DEFAULT NULL,
    p_search VARCHAR DEFAULT NULL
) RETURNS TABLE (
    id UUID,
    title VARCHAR,
    slug VARCHAR,
    short_description TEXT,
    thumbnail_url TEXT,
    level VARCHAR,
    price DECIMAL,
    is_free BOOLEAN,
    is_published BOOLEAN,
    rating DECIMAL,
    total_students INTEGER,
    total_lessons INTEGER,
    estimated_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    category_name VARCHAR,
    category_slug VARCHAR,
    instructor_id UUID,
    instructor_name VARCHAR,
    instructor_username VARCHAR,
    instructor_avatar_url TEXT,
    instructor_membership_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.slug,
        c.short_description,
        c.thumbnail_url,
        c.level,
        c.price,
        c.is_free,
        c.is_published,
        c.rating,
        c.total_students,
        c.total_lessons,
        c.estimated_duration,
        c.created_at,
        cat.name AS category_name,
        cat.slug AS category_slug,
        u.id AS instructor_id,
        u.full_name AS instructor_name,
        u.username AS instructor_username,
        u.avatar_url AS instructor_avatar_url,
        u.membership_type AS instructor_membership_type
    FROM 
        public.courses c
    LEFT JOIN 
        public.categories cat ON c.category_id = cat.id
    LEFT JOIN 
        public.users u ON c.instructor_id = u.id
    WHERE 
        c.is_published = TRUE
        AND (p_level IS NULL OR c.level = p_level)
        AND (p_is_free IS NULL OR c.is_free = p_is_free)
        AND (p_category_slug IS NULL OR cat.slug = p_category_slug)
        AND (p_search IS NULL OR c.title ILIKE '%' || p_search || '%')
    ORDER BY 
        c.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
