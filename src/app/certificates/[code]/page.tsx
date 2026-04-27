import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
    Award,
    CheckCircle2,
    XCircle,
    Calendar,
    GraduationCap,
    User as UserIcon,
    Clock,
    ShieldCheck,
} from "lucide-react";

type VerifyResponse =
    | {
          success: true;
          data:
              | {
                    valid: false;
                    reason: string;
                }
              | {
                    valid: true;
                    code: string;
                    student: {
                        id: string;
                        fullName: string;
                        username: string | null;
                        avatarUrl: string | null;
                    };
                    course: {
                        id: string;
                        slug: string;
                        title: string;
                        durationMinutes: number | null;
                        instructorName: string | null;
                    };
                    completedAt: string | null;
                    isCompleted: boolean;
                };
      }
    | { success: false; message?: string };

async function fetchVerify(code: string): Promise<VerifyResponse | null> {
    try {
        const h = await headers();
        const host = h.get("x-forwarded-host") ?? h.get("host");
        const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0];
        if (!host) return null;
        const url = `${proto}://${host}/api/certificates/verify/${encodeURIComponent(code)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as VerifyResponse;
    } catch {
        return null;
    }
}

function formatDate(value: string | null): string {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return value;
    }
}

function formatDuration(minutes: number | null): string {
    if (!minutes || minutes <= 0) return "—";
    if (minutes < 60) return `${minutes} phút`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export default async function CertificateVerifyPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    if (!code) notFound();

    const result = await fetchVerify(code);

    if (!result || result.success === false) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-center">
                    <XCircle className="h-12 w-12 mx-auto text-destructive mb-3" />
                    <h1 className="text-xl font-semibold text-foreground mb-2">
                        Không thể xác thực chứng chỉ
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Có lỗi khi kết nối đến hệ thống xác thực. Vui lòng thử
                        lại sau.
                    </p>
                </div>
            </div>
        );
    }

    const data = result.data;

    if (!data.valid) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-center">
                    <XCircle className="h-12 w-12 mx-auto text-destructive mb-3" />
                    <h1 className="text-xl font-semibold text-foreground mb-2">
                        Chứng chỉ không hợp lệ
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Mã chứng chỉ này không tồn tại hoặc đã bị thay đổi.
                    </p>
                    <p className="mt-4 text-xs font-mono text-muted-foreground/70 break-all">
                        {code}
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary text-sm"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const profileHref = data.student.username
        ? `/${data.student.username}`
        : "#";
    const courseHref = `/courses/${data.course.slug}`;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
                {/* Status banner */}
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 mb-6 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">
                            Chứng chỉ đã được xác thực
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Cấp bởi CodeMind · Mã chứng chỉ:{" "}
                            <span className="font-mono">{data.code}</span>
                        </p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-400 hidden sm:block" />
                </div>

                {/* Certificate showcase */}
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-8 md:p-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_60%)] pointer-events-none" />
                    <div className="absolute inset-4 border-[6px] border-double border-amber-500/20 rounded-2xl pointer-events-none" />

                    <div className="relative text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-400 text-xs uppercase tracking-wider mb-6">
                            <Award className="h-3.5 w-3.5" /> Certificate of
                            Completion
                        </div>
                        <p className="text-muted-foreground uppercase tracking-widest text-sm mb-3">
                            Đây là xác nhận rằng
                        </p>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
                            {data.student.fullName}
                        </h1>
                        <p className="text-muted-foreground mb-2">
                            Đã hoàn thành xuất sắc khóa học
                        </p>
                        <Link
                            href={courseHref}
                            className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors block mb-8"
                        >
                            {data.course.title}
                        </Link>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm">
                            <div className="rounded-xl border border-border bg-background/50 p-3 flex flex-col items-center">
                                <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Hoàn thành
                                </span>
                                <span className="font-semibold text-foreground">
                                    {formatDate(data.completedAt)}
                                </span>
                            </div>
                            <div className="rounded-xl border border-border bg-background/50 p-3 flex flex-col items-center">
                                <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Thời lượng
                                </span>
                                <span className="font-semibold text-foreground">
                                    {formatDuration(
                                        data.course.durationMinutes,
                                    )}
                                </span>
                            </div>
                            <div className="rounded-xl border border-border bg-background/50 p-3 flex flex-col items-center">
                                <GraduationCap className="h-4 w-4 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Giảng viên
                                </span>
                                <span className="font-semibold text-foreground line-clamp-1">
                                    {data.course.instructorName ?? "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student card */}
                <div className="mt-6 rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                    <Link
                        href={profileHref}
                        className="w-14 h-14 rounded-full overflow-hidden bg-secondary flex-shrink-0"
                    >
                        {data.student.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={data.student.avatarUrl}
                                alt={data.student.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link
                            href={profileHref}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            {data.student.fullName}
                        </Link>
                        {data.student.username && (
                            <p className="text-sm text-muted-foreground">
                                @{data.student.username}
                            </p>
                        )}
                    </div>
                    <Link
                        href={courseHref}
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary text-sm transition-colors"
                    >
                        Xem khóa học
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Xác thực bởi CodeMind · Hệ thống chứng chỉ số sử dụng chữ
                    ký HMAC-SHA256.
                </p>
            </div>
        </div>
    );
}
