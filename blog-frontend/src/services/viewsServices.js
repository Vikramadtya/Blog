export function addViewToRemote(id) {
  console.log("increased view for blog " + id);
  return 101;
}

export function getViewsFromRemote(id) {
  return 100;
}

export async function getView(id) {
  // return fetch(`http://localhost:3000/api/view?id=${id}`, {
  //   method: "GET",
  // });
  return 10;
}
