// Groq AI Models Configuration for CodeMind Platform

export const DEFAULT_GROQ_CHAT_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_GROQ_COMPLETION_MODEL = "llama-3.1-8b-instant";
export const DEFAULT_GROQ_TUTOR_MODEL = "llama-3.3-70b-versatile";

// Legacy aliases for backward compatibility
export const DEFAULT_OLLAMA_CHAT_MODEL = DEFAULT_GROQ_CHAT_MODEL;
export const DEFAULT_OLLAMA_COMPLETION_MODEL = DEFAULT_GROQ_COMPLETION_MODEL;
export const DEFAULT_OLLAMA_TUTOR_MODEL = DEFAULT_GROQ_TUTOR_MODEL;

export interface GroqUIModel {
    id: string;
    name: string;
    provider: string;
    providerSlug: string;
    description?: string;
}

// Keep old type alias for backward compat
export type OllamaUIModel = GroqUIModel;

export const APPROVED_GROQ_MODELS: GroqUIModel[] = [
    {
        id: "meta-llama/llama-3-8b-instruct:free",
        name: "Llama 3 8B (Free)",
        provider: "OpenRouter",
        providerSlug: "meta",
        description: "Hoàn toàn miễn phí, phản hồi nhanh và thông minh",
    },
    {
        id: "google/gemma-2-9b-it:free",
        name: "Gemma 2 9B (Free)",
        provider: "OpenRouter",
        providerSlug: "google",
        description: "Model miễn phí từ Google qua OpenRouter",
    },
    {
        id: "mistralai/mistral-7b-instruct:free",
        name: "Mistral 7B (Free)",
        provider: "OpenRouter",
        providerSlug: "mistral",
        description: "Model miễn phí từ Mistral cực nhẹ",
    },
    {
        id: DEFAULT_GROQ_TUTOR_MODEL,
        name: "Llama 3.3 70B",
        provider: "Groq",
        providerSlug: "meta",
        description: "Tối ưu cho AI Tutor và giải thích bài học",
    },
    {
        id: DEFAULT_GROQ_COMPLETION_MODEL,
        name: "Llama 3.1 8B Instant",
        provider: "Groq",
        providerSlug: "meta",
        description: "Phản hồi nhanh, nhẹ",
    },
];

// Backward compat alias
export const APPROVED_OLLAMA_MODELS = APPROVED_GROQ_MODELS;
