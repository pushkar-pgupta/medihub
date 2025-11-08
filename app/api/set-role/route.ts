// app/api/set-role/route.ts
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ROLES } from "@/lib/roles";

export async function POST(req: Request) {
  // Only accept JSON body: { role: string, invite?: string }
  const body = await req.json().catch(() => ({}));
  const roleRequested = body?.role;
  const invite = body?.invite;

  if (!roleRequested) {
    return NextResponse.json({ ok: false, error: "role required" }, { status: 400 });
  }

  // identify the currently authenticated user (server-side)
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  // Basic invite-code logic for privileged roles (replace with proper invites in prod)
  const privilegedRoles = [ROLES.ASHA, ROLES.ADMIN];
  if (privilegedRoles.includes(roleRequested)) {
    // simple invite check — change to your own secure token system
    const allowedInvite = process.env.ASHA_INVITE_CODE || "ASHA2025";
    const adminInvite = process.env.ADMIN_INVITE_CODE || "ADMIN2025";

    if (roleRequested === ROLES.ASHA && invite !== allowedInvite) {
      return NextResponse.json({ ok: false, error: "Invalid invite for ASHA" }, { status: 403 });
    }
    if (roleRequested === ROLES.ADMIN && invite !== adminInvite) {
      return NextResponse.json({ ok: false, error: "Invalid invite for ADMIN" }, { status: 403 });
    }
  }

  // Update Clerk user publicMetadata
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: roleRequested },
    });
    return NextResponse.json({ ok: true, role: roleRequested });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || String(err) }, { status: 500 });
  }
}
