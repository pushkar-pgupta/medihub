"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ROLES } from "@/lib/roles";

export async function setUserRole(targetUserId: string, newRole: string) {
  // ✅ call auth() properly
  const { userId: currentUserId, sessionClaims } = await auth();

  // ✅ safely extract role (avoid typing errors)
  const currentRole =
    (sessionClaims?.publicMetadata?.role as string | undefined) || "";

  if (!currentUserId || currentRole !== ROLES.ADMIN) {
    throw new Error("Unauthorized — only admin can set roles");
  }

  // ✅ call Clerk Admin API
  await clerkClient.users.updateUserMetadata(targetUserId, {
    publicMetadata: { role: newRole },
  });

  return { success: true };
}
