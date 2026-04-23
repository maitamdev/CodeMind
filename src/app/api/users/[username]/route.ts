import { NextRequest, NextResponse } from "next/server";
import { getLegacyProfileByUsername } from "@/lib/profile-service";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ username: string }> },
) {
    try {
        const { username } = await params;
        const profile = await getLegacyProfileByUsername(username);

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to load user profile",
            },
            { status: 500 },
        );
    }
}
