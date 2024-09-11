import { addLikeToRemote, getLikesFromRemote } from "./routeService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  // increase like count of the blog
  const currentLike = await addLikeToRemote(body.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...body,
      likes: currentLike,
      timestamp: Date.now(),
    }),
  );
}

export async function GET(request) {
  // get like count of the blog
  const currentLike = await getLikesFromRemote(
    request.nextUrl.searchParams.get("id"),
  );

  // send response back
  return new Response(
    JSON.stringify({
      id: request.nextUrl.searchParams.get("id"),
      likes: currentLike,
      timestamp: Date.now(),
    }),
  );
}
