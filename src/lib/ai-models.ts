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
        id: DEFAULT_GROQ_TUTOR_MODEL,
        name: "Llama 3.3 70B",
        provider: "Groq",
        providerSlug: "meta",
        description: "Tối ưu cho AI Tutor và giải thích bài học",
    },
    {
        id: "llama-3.1-70b-versatile",
        name: "Llama 3.1 70B",
        provider: "Groq",
        providerSlug: "meta",
        description: "Chuyên cho chat code và tác vụ lập trình",
    },
    {
        id: DEFAULT_GROQ_COMPLETION_MODEL,
        name: "Llama 3.1 8B Instant",
        provider: "Groq",
        providerSlug: "meta",
        description: "Phản hồi nhanh, nhẹ",
    },
    {
        id: "gemma2-9b-it",
        name: "Gemma 2 9B",
        provider: "Groq",
        providerSlug: "google",
        description: "Mô hình nhẹ của Google",
    },
];

// Backward compat alias
export const APPROVED_OLLAMA_MODELS = APPROVED_GROQ_MODELS;
