import { notify } from "./routeService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  notify(body.email);

  // send response back
  return new Response(
    JSON.stringify({
      ...body,
      timestamp: Date.now(),
    }),
  );
}
