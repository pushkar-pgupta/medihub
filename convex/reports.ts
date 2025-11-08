import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ROLES } from "../lib/roles"; // You can mirror this string union here too

export const addByAsha = mutation({
  args: {
    disease: v.string(),
    symptoms: v.array(v.string()),
    village: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const role = (identity.publicMetadata as { role?: string })?.role || "citizen";
    if (role !== ROLES.ASHA && role !== ROLES.ADMIN) {
      throw new Error("Only ASHA/Admin can add reports");
    }

    await ctx.db.insert("healthReports", {
      createdBy: identity.subject,
      createdByRole: role,
      ...args,
    });
  },
});

export const getVillageSummary = query({
  args: { village: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const role = (identity.publicMetadata as { role?: string })?.role || "citizen";

    // Citizens can only see anonymized summary; ASHA/Admin can see more details
    const reports = await ctx.db
      .query("healthReports")
      .filter(q => q.eq(q.field("village"), args.village))
      .collect();

    if (role === ROLES.CITIZEN) {
      // return aggregated summary
      const byDisease: Record<string, number> = {};
      for (const r of reports) byDisease[r.disease] = (byDisease[r.disease] || 0) + 1;
      return { type: "summary", byDisease };
    }

    // ASHA/Admin: return raw (or semi-raw) data
    return { type: "detailed", reports };
  },
});
