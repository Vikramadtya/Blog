import { notifySlack } from "../../../services/notificationServices";
import { addLike, getLikes } from "../../../services/likesServices";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  // increase like count of the blog
  const currentLike = addLike(body.id);

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
  const searchParams = request.nextUrl.searchParams;

  // get like count of the blog
  const currentLike = getLikes(searchParams.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...searchParams,
      likes: currentLike,
      timestamp: Date.now(),
    }),
  );
}
