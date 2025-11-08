"use client";
import { useUser } from "@clerk/nextjs";
import { ROLES, type Role } from "./roles";

export function useRole(): Role {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as Role) || ROLES.CITIZEN;
  return role;
}
