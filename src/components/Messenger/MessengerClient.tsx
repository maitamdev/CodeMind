"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Search, UserPlus, UserCheck, UserX, Send, Phone, Video, Info, Image as ImageIcon, Smile, MessageSquare, Loader2 } from "lucide-react";
import AvatarWithProBadge from "../AvatarWithProBadge";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/contexts/ToastContext";
import Cookies from "js-cookie";

interface UserProfile {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    isOnline?: boolean;
}

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MessengerClient() {
    const { user } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<"chats" | "friends" | "search">("chats");
    const [activeChat, setActiveChat] = useState<UserProfile | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [pendingRequests, setPendingRequests] = useState<{user: UserProfile, isOutgoing: boolean}[]>([]);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load Friends
    useEffect(() => {
        if (!user) return;
        const loadFriends = async () => {
            try {
                const res = await fetch("/api/messenger/friends");
                const data = await res.json();
                if (data.friends) {
                    setFriends(data.friends.map((f: any) => f.user));
                }
                if (data.pendingRequests) {
                    setPendingRequests(data.pendingRequests);
                }
            } catch (error) {
                console.error("Failed to load friends", error);
            } finally {
                setIsLoadingFriends(false);
            }
        };
        loadFriends();
    }, [user]);

    // Load Messages for active chat
    useEffect(() => {
        if (!activeChat || !user) return;
        
        const loadMessages = async () => {
            try {
                const res = await fetch(`/api/messenger/messages?friendId=${activeChat.id}`);
                const data = await res.json();
                if (data.messages) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        };
        
        loadMessages();

        // Subscribe to Realtime messages
        const channel = supabase.channel(`direct_messages_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'direct_messages',
                    filter: `receiver_id=eq.${user.id}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    if (newMsg.sender_id === activeChat.id) {
                        setMessages(prev => [...prev, newMsg]);
                    } else {
                        toast.success("Có tin nhắn mới!");
                        // You could add a badge or play a sound here
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeChat, user, toast]);

    // Search Users
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`/api/messenger/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                if (data.users) setSearchResults(data.users);
            } catch (error) {
                console.error("Failed to search", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChat || !user) return;
        
        const tempMsg: Message = {
            id: Math.random().toString(),
            sender_id: user.id,
            receiver_id: activeChat.id,
            content: messageInput.trim(),
            created_at: new Date().toISOString()
        };
        
        // Optimistic UI update
        setMessages(prev => [...prev, tempMsg]);
        const currentInput = messageInput.trim();
        setMessageInput("");
        
        try {
            await fetch("/api/messenger/messages", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-csrf-token": Cookies.get("csrf_token") || ""
                },
                body: JSON.stringify({
                    receiverId: activeChat.id,
                    content: currentInput
                })
            });
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Không thể gửi tin nhắn");
            // Remove optimistic message if failed
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
        }
    };

    const handleAddFriend = async (targetUserId: string) => {
        try {
            const res = await fetch("/api/messenger/friends", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-csrf-token": Cookies.get("csrf_token") || ""
                },
                body: JSON.stringify({ targetUserId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Đã kết bạn thành công!");
                // Reload friends & requests
                const friendsRes = await fetch("/api/messenger/friends");
                const friendsData = await friendsRes.json();
                if (friendsData.friends) setFriends(friendsData.friends.map((f: any) => f.user));
                if (friendsData.pendingRequests) setPendingRequests(friendsData.pendingRequests);
                
                setActiveTab("friends");
                setSearchQuery("");
            }
        } catch (error) {
            toast.error("Lỗi khi kết bạn");
        }
    };

    const handleAcceptFriend = async (targetUserId: string) => {
        try {
            const res = await fetch("/api/messenger/friends", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "x-csrf-token": Cookies.get("csrf_token") || ""
                },
                body: JSON.stringify({ targetUserId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Đã chấp nhận kết bạn!");
                // Reload
                const friendsRes = await fetch("/api/messenger/friends");
                const friendsData = await friendsRes.json();
                if (friendsData.friends) setFriends(friendsData.friends.map((f: any) => f.user));
                if (friendsData.pendingRequests) setPendingRequests(friendsData.pendingRequests);
            }
        } catch (error) {
            toast.error("Lỗi khi chấp nhận kết bạn");
        }
    };

    const handleRejectFriend = async (targetUserId: string) => {
        try {
            const res = await fetch("/api/messenger/friends", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "x-csrf-token": Cookies.get("csrf_token") || ""
                },
                body: JSON.stringify({ targetUserId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Đã xóa lời mời");
                // Reload
                const friendsRes = await fetch("/api/messenger/friends");
                const friendsData = await friendsRes.json();
                if (friendsData.friends) setFriends(friendsData.friends.map((f: any) => f.user));
                if (friendsData.pendingRequests) setPendingRequests(friendsData.pendingRequests);
            }
        } catch (error) {
            toast.error("Lỗi khi xóa lời mời");
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            {/* Sidebar (Left) */}
            <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h1 className="text-xl font-bold font-sans">Chats</h1>
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab("search")} className={`p-2 rounded-full hover:bg-secondary transition-colors ${activeTab === 'search' ? 'bg-secondary text-indigo-500' : ''}`} title="Tìm bạn mới">
                            <UserPlus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-1 border-b border-border bg-card/50">
                    <button 
                        onClick={() => setActiveTab("chats")}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'chats' ? 'bg-indigo-500/10 text-indigo-500' : 'text-muted-foreground hover:bg-secondary'}`}
                    >
                        Tin nhắn
                    </button>
                    <button 
                        onClick={() => setActiveTab("friends")}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'friends' ? 'bg-indigo-500/10 text-indigo-500' : 'text-muted-foreground hover:bg-secondary'}`}
                    >
                        Danh bạ
                    </button>
                </div>

                {/* Search Input for adding friends */}
                {activeTab === 'search' && (
                    <div className="p-3 border-b border-border bg-card/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm theo tên/email..." 
                                className="w-full bg-secondary/50 border border-transparent focus:border-indigo-500 rounded-full pl-9 pr-4 py-2 text-sm outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* List Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {(activeTab === "chats" || activeTab === "friends") && (
                        <div className="space-y-0.5 px-2 mt-2">
                            {/* Danh sách lời mời kết bạn */}
                            {activeTab === "friends" && pendingRequests.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Lời mời kết bạn ({pendingRequests.length})</h3>
                                    <div className="space-y-1">
                                        {pendingRequests.map(req => (
                                            <div key={req.user.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded-xl border border-border">
                                                <AvatarWithProBadge avatarUrl={req.user.avatar_url} fullName={req.user.full_name} size="md" isPro={false} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{req.user.full_name}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <button onClick={() => handleAcceptFriend(req.user.id)} className="flex-1 text-xs py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors">Xác nhận</button>
                                                        <button onClick={() => handleRejectFriend(req.user.id)} className="flex-1 text-xs py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-medium transition-colors">Xóa</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-px bg-border my-3 mx-2" />
                                </div>
                            )}

                            {activeTab === "friends" && <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Bạn bè ({friends.length})</h3>}

                            {isLoadingFriends ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                            ) : friends.length === 0 ? (
                                <div className="text-center p-4 text-sm text-muted-foreground">Chưa có bạn bè. Bấm nút 👤+ để tìm kiếm.</div>
                            ) : (
                                friends.map(friend => (
                                    <button 
                                        key={friend.id}
                                        onClick={() => setActiveChat(friend)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${activeChat?.id === friend.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                                    >
                                        <div className="relative">
                                            <AvatarWithProBadge avatarUrl={friend.avatar_url} fullName={friend.full_name} size="md" isPro={false} />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="text-sm font-semibold truncate">{friend.full_name}</p>
                                            <p className="text-xs text-muted-foreground truncate">@{friend.username}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "search" && (
                        <div className="p-2 space-y-2">
                            {isSearching ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(res => {
                                    const isFriend = friends.some(f => f.id === res.id);
                                    return (
                                        <div key={res.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                                            <AvatarWithProBadge avatarUrl={res.avatar_url} fullName={res.full_name} size="md" isPro={false} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{res.full_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">@{res.username}</p>
                                            </div>
                                            {!isFriend ? (
                                                <button onClick={() => handleAddFriend(res.id)} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors" title="Thêm bạn">
                                                    <UserPlus className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <span className="p-2 text-emerald-500 bg-emerald-500/10 rounded-md">
                                                    <UserCheck className="w-4 h-4" />
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : searchQuery.length >= 2 ? (
                                <div className="text-center p-4 text-sm text-muted-foreground">Không tìm thấy ai</div>
                            ) : (
                                <div className="text-center p-4 text-sm text-muted-foreground">Nhập ít nhất 2 ký tự để tìm kiếm</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area (Right) */}
            <div className="flex-1 flex flex-col h-full bg-[var(--ide-bg)] relative">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[66px] border-b border-border bg-card/50 px-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <AvatarWithProBadge avatarUrl={activeChat.avatar_url} fullName={activeChat.full_name} size="sm" isPro={false} />
                                <div>
                                    <h2 className="text-sm font-bold">{activeChat.full_name}</h2>
                                    <p className="text-xs text-muted-foreground">@{activeChat.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <button className="hover:text-indigo-400 transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="hover:text-indigo-400 transition-colors"><Video className="w-5 h-5" /></button>
                                <button className="hover:text-indigo-400 transition-colors"><Info className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                    <AvatarWithProBadge avatarUrl={activeChat.avatar_url} fullName={activeChat.full_name} size="xl" isPro={false} />
                                    <h3 className="mt-4 font-semibold text-foreground">{activeChat.full_name}</h3>
                                    <p className="text-sm mt-1">Hai bạn đã trở thành bạn bè. Hãy gửi lời chào!</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed ${
                                                isMe 
                                                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                                                    : 'bg-secondary border border-border text-foreground rounded-bl-sm'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-card/50 border-t border-border shrink-0">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-end gap-2"
                            >
                                <button type="button" className="p-2.5 text-muted-foreground hover:text-indigo-400 hover:bg-secondary rounded-full transition-all shrink-0">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Nhập tin nhắn..." 
                                        className="w-full bg-secondary border border-border focus:border-indigo-500 rounded-2xl pl-4 pr-10 py-2.5 text-sm outline-none transition-all"
                                    />
                                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-yellow-500 transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-secondary disabled:text-muted-foreground text-white rounded-full transition-all shrink-0"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">CodeMind Messenger</h2>
                        <p className="text-sm text-center max-w-sm">Chọn một đoạn chat hoặc tìm kiếm bạn bè để bắt đầu trò chuyện.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
