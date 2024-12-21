import {
  getAllBlogData,
  getAllBlogForType,
  getBlogDataForId,
  getBlogDataForSlug,
} from "./routeService";
import { getParam, isFilteringOn } from "../services";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function GET(request) {
  let response;

  if (isFilteringOn(request, "id")) {
    const metadata = await getBlogDataForId(getParam(request, "id"));
    response = [metadata];
  } else if (isFilteringOn(request, "slug")) {
    response = await getBlogDataForSlug(getParam(request, "slug"));
  } else if (isFilteringOn(request, "type")) {
    response = await getAllBlogForType(getParam(request, "type"));
  } else {
    response = await getAllBlogData();
  }

  // send response back
  return new Response(JSON.stringify(response));
}
