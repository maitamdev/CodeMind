"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { getCanonicalProfilePath } from "@/lib/profile-url";

function timeSince(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    };
}

export default function ArticleComments({ slug }: { slug: string }) {
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blog/posts/${slug}/comments`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setComments(data.data);
            })
            .finally(() => setIsLoading(false));
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để bình luận");
            return;
        }
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/blog/posts/${slug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment })
            });
            const data = await res.json();
            if (data.success) {
                setComments([data.data, ...comments]);
                setNewComment("");
                toast.success("Đã đăng bình luận");
            } else {
                toast.error(data.message || "Lỗi khi đăng bình luận");
            }
        } catch {
            toast.error("Lỗi khi đăng bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border border-slate-200 rounded-2xl p-6 md:p-10 mb-20 bg-white shadow-sm" id="comments">
            <h3 className="text-2xl text-slate-900 mb-8 font-semibold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-indigo-500" />
                Bình luận ({comments.length})
            </h3>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-10 flex gap-4">
                    <div className="shrink-0">
                        {user?.avatar_url ? (
                            <Image src={user.avatar_url} alt={user.full_name || ""} width={40} height={40} className="rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {user?.full_name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mb-10">
                    <p className="text-slate-600 mb-4">Vui lòng đăng nhập để tham gia thảo luận</p>
                    <Link href="/auth/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-500">
                        Đăng nhập ngay
                    </Link>
                </div>
            )}

            {isLoading ? (
                <div className="animate-pulse space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 w-32 rounded"></div>
                                <div className="h-16 bg-slate-200 w-full rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <Link href={getCanonicalProfilePath(comment.author.username)} className="shrink-0">
                                {comment.author.avatar_url ? (
                                    <Image src={comment.author.avatar_url} alt={comment.author.full_name} width={40} height={40} className="rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                        {comment.author.full_name.charAt(0)}
                                    </div>
                                )}
                            </Link>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <Link href={getCanonicalProfilePath(comment.author.username)} className="font-semibold text-slate-900 hover:text-indigo-600">
                                        {comment.author.full_name}
                                    </Link>
                                    <span className="text-xs text-slate-500">
                                        {timeSince(comment.createdAt)}
                                    </span>
                                </div>
                                <div className="text-slate-700 text-sm whitespace-pre-wrap">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!
                </div>
            )}
        </div>
    );
}
