import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const save = mutation({
  args: {
    mapId: v.optional(v.id("maps")),
    name: v.string(),
    spec: v.any(),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    if (args.mapId) {
      const existing = await ctx.db.get(args.mapId);
      if (!existing || existing.userId !== user.email) {
        throw new Error("Not found");
      }
      await ctx.db.patch(args.mapId, {
        name: args.name,
        spec: args.spec,
        prompt: args.prompt,
        updatedAt: Date.now(),
      });
      return args.mapId;
    }

    return await ctx.db.insert("maps", {
      userId: user.email,
      name: args.name,
      spec: args.spec,
      prompt: args.prompt,
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { mapId: v.id("maps") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    const map = await ctx.db.get(args.mapId);
    if (!map || map.userId !== user.email) return null;
    return map;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("maps")
      .withIndex("by_user_updated", (q) => q.eq("userId", user.email))
      .order("desc")
      .collect();
  },
});

export const remove = mutation({
  args: { mapId: v.id("maps") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const map = await ctx.db.get(args.mapId);
    if (!map || map.userId !== user.email) {
      throw new Error("Not found");
    }
    await ctx.db.delete(args.mapId);
  },
});

export const rename = mutation({
  args: {
    mapId: v.id("maps"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const map = await ctx.db.get(args.mapId);
    if (!map || map.userId !== user.email) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.mapId, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});
