import { getAllTagsFromRemote, getTagToMetadataMap } from "../routeService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function GET(request) {
  const tags = await getTagToMetadataMap();
  return new Response(JSON.stringify(tags));
}
