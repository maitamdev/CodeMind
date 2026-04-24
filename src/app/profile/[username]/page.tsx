"use client";

export const dynamic = "force-dynamic";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    BookOpen,
    BriefcaseBusiness,
    Globe,
    GraduationCap,
    Link2,
    MapPin,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import PageLoading from "@/components/PageLoading";
import AvatarWithProBadge from "@/components/AvatarWithProBadge";
import VerifiedBadge from "@/components/profile/VerifiedBadge";
import ContributionGraph from "@/components/profile/ContributionGraph";
import { formatUsernameHandle, normalizeUsername } from "@/lib/profile-url";
import type {
    ProfessionalProfileRecord,
    UnifiedProfileResponse,
} from "@/types/profile";

function readItemLabel(item: Record<string, unknown>): string {
    const preferredKeys = [
        "title",
        "label",
        "name",
        "institution",
        "organization",
        "company",
        "role",
    ];

    for (const key of preferredKeys) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }

    return JSON.stringify(item);
}

function readItemDescription(item: Record<string, unknown>): string | null {
    const preferredKeys = ["description", "summary", "subtitle", "details"];

    for (const key of preferredKeys) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }

    return null;
}

function renderListSection(
    title: string,
    items: Record<string, unknown>[],
    icon: ReactNode,
) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    {icon}
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={`${title}-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                        <p className="text-sm font-semibold text-slate-900">
                            {readItemLabel(item)}
                        </p>
                        {readItemDescription(item) ? (
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                {readItemDescription(item)}
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}

function ProfessionalHighlights({
    professionalProfile,
}: {
    professionalProfile: ProfessionalProfileRecord;
}) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            Professional Overview
                        </h2>
                        <p className="text-sm text-slate-500">
                            Published professional profile
                        </p>
                    </div>
                </div>

                {professionalProfile.summary ? (
                    <p className="text-[15px] leading-7 text-slate-600">
                        {professionalProfile.summary}
                    </p>
                ) : (
                    <p className="text-sm text-slate-500">
                        This professional profile is published without a summary.
                    </p>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Current Role
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                            {professionalProfile.currentTitle || "Not provided"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            {professionalProfile.currentOrganization ||
                                "Organization not provided"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Experience
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                            {professionalProfile.yearsExperience !== null
                                ? `${professionalProfile.yearsExperience}+ years`
                                : "Not provided"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            {professionalProfile.location || "Location not provided"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_40px_-30px_rgba(15,23,42,0.55)]">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Publication State
                        </h2>
                        <p className="text-sm text-slate-300">
                            Returned directly by backend workflow
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                        Status
                    </p>
                    <p className="mt-2 text-2xl font-semibold capitalize">
                        {professionalProfile.status.replace(/_/g, " ")}
                    </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {professionalProfile.profileRoles.map((role) => (
                        <span
                            key={role}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200"
                        >
                            {role}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function UserProfilePage() {
    const params = useParams();
    const rawUsername = params.username as string | undefined;
    const username = normalizeUsername(rawUsername);

    const [profile, setProfile] = useState<UnifiedProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/profiles/${username}`, {
                    cache: "no-store",
                });
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to load profile");
                }

                setProfile(data.data);
                setError(null);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load profile",
                );
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            loadProfile();
        }
    }, [username]);

    const allBadges = useMemo(() => profile?.badges ?? [], [profile?.badges]);

    if (loading) {
        return <PageLoading message="Loading profile..." />;
    }

    if (error || !profile) {
        return (
            <PageContainer>
                <div className="mx-auto flex min-h-[70dvh] max-w-3xl items-center justify-center px-4 py-10">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Profile unavailable
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                            This profile could not be loaded
                        </h1>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                            {error || "The requested profile does not exist."}
                        </p>
                        <Link
                            href="/"
                            className="mt-8 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                        >
                            Return home
                        </Link>
                    </div>
                </div>
            </PageContainer>
        );
    }

    const { publicProfile, professionalProfile, courses, user } = profile;

    return (
        <PageContainer>
            <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[296px_1fr]">
                    
                    {/* Left Sidebar (GitHub Style) */}
                    <aside className="flex flex-col gap-5">
                        {/* Avatar */}
                        <div className="relative w-full aspect-square max-w-[296px] mx-auto md:mx-0">
                            <AvatarWithProBadge
                                avatarUrl={publicProfile.avatarUrl}
                                fullName={publicProfile.displayName}
                                isPro={false}
                                isRegistered={false}
                                size="full"
                                className="w-full h-full rounded-full border border-slate-200 shadow-sm"
                            />
                        </div>

                        {/* Name and Username */}
                        <div className="flex flex-col">
                            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900">
                                {publicProfile.displayName}
                            </h1>
                            <div className="flex items-center gap-2 text-[20px] font-light leading-tight text-slate-500">
                                <span>{formatUsernameHandle(user.username)}</span>
                                {allBadges.map((badge) => (
                                    <VerifiedBadge key={badge.code} badge={badge} />
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        {publicProfile.bio && (
                            <div className="text-base text-slate-900 leading-snug">
                                {publicProfile.bio}
                            </div>
                        )}
                        {publicProfile.headline && !publicProfile.bio && (
                            <div className="text-base text-slate-900 leading-snug">
                                {publicProfile.headline}
                            </div>
                        )}

                        <div className="mt-1 w-full">
                            <button className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 shadow-sm">
                                Edit profile
                            </button>
                        </div>

                        {/* Roles */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.roles.map((role) => (
                                <span key={role} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">
                                    {role}
                                </span>
                            ))}
                        </div>

                        {/* Links & Details */}
                        <div className="flex flex-col gap-1.5 text-sm text-slate-700 mt-2">
                            {professionalProfile?.currentOrganization && (
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                                    <span className="font-semibold">{professionalProfile.currentOrganization}</span>
                                </div>
                            )}
                            {publicProfile.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span>{publicProfile.location}</span>
                                </div>
                            )}
                            {publicProfile.websiteUrl && (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    <a href={publicProfile.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                        {publicProfile.websiteUrl.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                            {Object.entries(publicProfile.socialLinks).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <Link2 className="h-4 w-4 text-slate-400" />
                                    <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline capitalize">
                                        {key}
                                    </a>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t border-slate-200 mt-2 pt-4">
                            <h2 className="text-sm font-semibold text-slate-900 mb-3">Highlights</h2>
                            {professionalProfile?.status && (
                                <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                                    <span className="capitalize">{professionalProfile.status.replace(/_/g, " ")} Pro</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Sparkles className="h-4 w-4 text-slate-400" />
                                <span>PRO Member</span>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <div className="flex flex-col min-w-0">
                        {/* Tab Bar Navigation */}
                        <div className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 -mx-4 px-4 md:mx-0 md:px-0 pt-2 mb-6">
                            <nav className="flex gap-6 text-sm">
                                <button className="flex items-center gap-2 border-b-2 border-orange-500 pb-3 font-semibold text-slate-900">
                                    <BookOpen className="h-4 w-4 text-slate-500" />
                                    Overview
                                </button>
                                <button className="flex items-center gap-2 border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-colors">
                                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1v-2h-8a2.5 2.5 0 0 0-1 4.79V2.5a1 1 0 0 1 1-1h7.5Z"></path>
                                    </svg>
                                    Repositories
                                    <span className="flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                        {profile.projects?.length || 0}
                                    </span>
                                </button>
                                <button className="flex items-center gap-2 border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-colors">
                                    <GraduationCap className="h-4 w-4 text-slate-400" />
                                    Courses
                                    <span className="flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                        {courses.length}
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Professional Summary (like a README) */}
                        {professionalProfile?.summary && (
                            <div className="mb-8 rounded-xl border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {formatUsernameHandle(user.username)} / README.md
                                    </p>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-700">
                                    {professionalProfile.summary}
                                </p>
                            </div>
                        )}

                        {/* Pinned Projects */}
                        {profile.projects && profile.projects.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-base font-semibold text-slate-900">Pinned</h2>
                                    <button className="text-sm text-blue-600 hover:underline">Customize your pins</button>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {profile.projects.slice(0, 6).map((project: any) => {
                                        const commitsCount = project.commits?.length || 0;
                                        return (
                                        <div key={project.id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 shadow-sm">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1v-2h-8a2.5 2.5 0 0 0-1 4.79V2.5a1 1 0 0 1 1-1h7.5Z"></path>
                                                    </svg>
                                                    <a href="#" className="font-semibold text-blue-600 hover:underline truncate">
                                                        {project.name}
                                                    </a>
                                                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500">Public</span>
                                                </div>
                                                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                                                    {project.description || "Interactive CodeMind web project."}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                                                    <span>Web App</span>
                                                </div>
                                                {commitsCount > 0 && (
                                                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                                        </svg>
                                                        <span>{commitsCount}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 ml-auto text-slate-400">
                                                    <span>Updated {new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        )}

                        {/* Contribution Graph */}
                        <div className="mb-10">
                            <ContributionGraph projects={profile.projects || []} />
                        </div>

                        {/* Additional Information Sections (Courses, Career, Education) */}
                        <div className="space-y-6">
                            {courses.length > 0 && (
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">Published Courses</h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {courses.map((course) => (
                                            <Link key={course.id} href={`/learn/${course.slug}`} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300">
                                                <h3 className="font-semibold text-blue-600 group-hover:underline">{course.title}</h3>
                                                {course.shortDescription && <p className="mt-1 text-xs text-slate-600">{course.shortDescription}</p>}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {professionalProfile && (
                                <div className="grid gap-6 md:grid-cols-2 mt-8">
                                    {renderListSection("Experience", professionalProfile.careerItems, <BriefcaseBusiness className="h-5 w-5" />)}
                                    {renderListSection("Education", professionalProfile.educationItems, <GraduationCap className="h-5 w-5" />)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
