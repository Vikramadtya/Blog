import {
  addViewToRemote,
  getViewsFromRemote,
} from "../../../services/viewsServices";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  // increase view count of the blog
  const currentViews = addViewToRemote(body.id);

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
  const searchParams = request.nextUrl.searchParams;

  // get view count of the blog
  const currentViews = getViewsFromRemote(searchParams.id);

  // send response back
  return new Response(
    JSON.stringify({
      ...searchParams,
      views: currentViews,
      timestamp: Date.now(),
    }),
  );
}
