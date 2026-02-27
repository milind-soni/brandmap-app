import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const join = mutation({
  args: {
    email: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { alreadyExists: true };
    }

    await ctx.db.insert("waitlist", {
      email,
      source: args.source,
      timestamp: Date.now(),
    });

    return { alreadyExists: false };
  },
});
