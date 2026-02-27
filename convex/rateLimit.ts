import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import type { GenericQueryCtx } from "convex/server";
import type { DataModel } from "./_generated/dataModel";

async function getUser(ctx: GenericQueryCtx<DataModel>) {
  try {
    return await authComponent.getAuthUser(ctx);
  } catch {
    return null;
  }
}

const MAX_GENERATIONS_PER_DAY = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

export const canGenerate = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return { allowed: false, remaining: 0, used: 0, limit: MAX_GENERATIONS_PER_DAY };

    const dayAgo = Date.now() - DAY_MS;
    const recent = await ctx.db
      .query("generationLogs")
      .withIndex("by_user_timestamp", (q) =>
        q.eq("userId", user.email).gte("timestamp", dayAgo),
      )
      .collect();

    const count = recent.length;
    return {
      allowed: count < MAX_GENERATIONS_PER_DAY,
      remaining: Math.max(0, MAX_GENERATIONS_PER_DAY - count),
      used: count,
      limit: MAX_GENERATIONS_PER_DAY,
    };
  },
});

export const logGeneration = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const dayAgo = Date.now() - DAY_MS;
    const recent = await ctx.db
      .query("generationLogs")
      .withIndex("by_user_timestamp", (q) =>
        q.eq("userId", user.email).gte("timestamp", dayAgo),
      )
      .collect();

    if (recent.length >= MAX_GENERATIONS_PER_DAY) {
      throw new Error("Rate limit exceeded");
    }

    await ctx.db.insert("generationLogs", {
      userId: user.email,
      timestamp: Date.now(),
    });
  },
});
