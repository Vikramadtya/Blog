import { getMetaData, getMetaDataForId, incrementKey } from "./routeService";
import { getParam, isFilteringOn } from "../services";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

export async function GET(request) {
  let response;

  if (isFilteringOn(request, "id")) {
    response = [await getMetaDataForId(getParam(request, "id"))];
  } else {
    response = await getMetaData(request);
  }

  // send response back
  return new Response(JSON.stringify(response));
}

export async function POST(request) {
  const body = await request.json();

  if (body.likes === true) {
    await incrementKey(body.id, "likes");
  } else if (body.views === true) {
    await incrementKey(body.id, "views");
  }

  // get updated data
  const response = [await getMetaDataForId(getParam(request, "id"))];

  // send response back
  return new Response(JSON.stringify(response));
}
