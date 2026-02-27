import { createMapGenerateHandler } from "json-maps/api";
import { isAuthenticated, fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

const handler = createMapGenerateHandler();

export async function POST(req: Request) {
  const authed = await isAuthenticated();

  if (!authed) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await fetchAuthQuery(api.rateLimit.canGenerate);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        message: `Daily limit reached (${rateLimit.limit} maps/day). Try again tomorrow.`,
      },
      { status: 429 },
    );
  }

  await fetchAuthMutation(api.rateLimit.logGeneration);

  return handler(req);
}

export const maxDuration = 30;
