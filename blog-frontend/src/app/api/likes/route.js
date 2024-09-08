import { addLikeToRemote, getLikesFromRemote } from "./routeService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export function POST(request) {
  const body = request.json();

  // increase like count of the blog
  const currentLike = addLikeToRemote(body.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...body,
      likes: currentLike,
      timestamp: Date.now(),
    }),
  );
}

export function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  // get like count of the blog
  const currentLike = getLikesFromRemote(searchParams.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...searchParams,
      likes: currentLike,
      timestamp: Date.now(),
    }),
  );
}
