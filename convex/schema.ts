import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    text: v.string(),
  }),
  healthReports: defineTable({
    createdBy: v.string(),
    createdByRole: v.string(),
    disease: v.string(),
    symptoms: v.array(v.string()),
    village: v.string(),
    date: v.string(),
  }),
});
