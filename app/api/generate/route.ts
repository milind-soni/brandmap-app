import { createMapGenerateHandler } from "json-maps/api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const handler = createMapGenerateHandler();

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  return handler(req);
}

export const maxDuration = 30;
