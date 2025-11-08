export const ROLES = {
  ADMIN: "admin",
  ASHA: "asha",
  CITIZEN: "citizen",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
