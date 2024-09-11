import { addViewToRemote, getViewsFromRemote } from "./routeService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  // increase view count of the blog
  const currentViews = await addViewToRemote(body.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...body,
      views: currentViews,
      timestamp: Date.now(),
    }),
  );
}

export async function GET(request) {
  // get view count of the blog
  const currentViews = await getViewsFromRemote(
    request.nextUrl.searchParams.get("id"),
  );

  // send response back
  return new Response(
    JSON.stringify({
      id: request.nextUrl.searchParams.get("id"),
      views: currentViews,
      timestamp: Date.now(),
    }),
  );
}
