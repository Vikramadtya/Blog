import {
  addLikeToRemote,
  addViewToRemote,
  getAllBlogMetadataFromRemote,
  getBlogMetadataFromRemote,
  getBlogMetadataFromRemoteBySlug,
} from "./routeService";
import { getBlogMetaDataBySlug } from "../../../../services/apiServices";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();

  let blogMetaData;
  if (body.likes === true) {
    // increase like count of the blog
    blogMetaData = await addLikeToRemote(body.id);
  } else {
    blogMetaData = await addViewToRemote(body.id);
  }

  // send response back
  return new Response(
    JSON.stringify({
      ...blogMetaData,
      timestamp: Date.now(),
    }),
  );
}

export async function GET(request) {
  if (request.nextUrl.searchParams.get("id") !== null) {
    const blogMetaData = await getBlogMetadataFromRemote(
      request.nextUrl.searchParams.get("id"),
    );

    // send response back
    return new Response(
      JSON.stringify([
        {
          ...blogMetaData,
        },
      ]),
    );
  } else if (request.nextUrl.searchParams.get("slug") !== null) {
    const blogMetaData = await getBlogMetadataFromRemoteBySlug(
      request.nextUrl.searchParams.get("slug"),
    );

    // send response back
    return new Response(JSON.stringify(blogMetaData));
  }

  const blogMetas = await getAllBlogMetadataFromRemote();
  return new Response(JSON.stringify(blogMetas));
}
