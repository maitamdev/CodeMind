-- Create user_code_snippets table for cloud sync
CREATE TABLE IF NOT EXISTS public.user_code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(255) NOT NULL,
    html TEXT DEFAULT '',
    css TEXT DEFAULT '',
    javascript TEXT DEFAULT '',
    cpp TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- RLS Policies
ALTER TABLE public.user_code_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own code snippets"
    ON public.user_code_snippets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own code snippets"
    ON public.user_code_snippets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code snippets"
    ON public.user_code_snippets FOR UPDATE
    USING (auth.uid() = user_id);
