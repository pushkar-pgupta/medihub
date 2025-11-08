import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROLES } from "./lib/roles";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAshaRoute = createRouteMatcher(["/asha(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // ✅ make role a plain string, not a literal type
  let role: string = ROLES.CITIZEN;

  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    role = (user.publicMetadata?.role as string) || ROLES.CITIZEN;
  }

  // ✅ Role-based gating
  if (isAdminRoute(req) && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isAshaRoute(req) && role !== ROLES.ASHA && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
