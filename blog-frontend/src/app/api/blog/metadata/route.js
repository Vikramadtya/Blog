import {
  getAllBlogMetadataFromRemote,
  getBlogMetadataFromRemote,
  getBlogMetadataFromRemoteBySlug,
} from "./routeService";
import { getBlogMetaDataBySlug } from "../../../../services/apiServices";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

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
