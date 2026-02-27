import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  maps: defineTable({
    userId: v.string(),
    name: v.string(),
    spec: v.any(),
    prompt: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  generationLogs: defineTable({
    userId: v.string(),
    timestamp: v.number(),
  }).index("by_user_timestamp", ["userId", "timestamp"]),
});
