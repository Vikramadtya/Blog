import { getAllTags } from "./routeService";
import { isFilteringOn } from "../services";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function GET(request) {
  let tags = [];
  if (isFilteringOn(request, "id")) {
    tags = [];
  } else {
    tags = await getAllTags();
  }
  return new Response(JSON.stringify(tags));
}
