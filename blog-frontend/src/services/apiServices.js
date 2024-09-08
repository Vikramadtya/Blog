export async function getView(id) {
  return fetch(`https://www.neuralcook.com/api/view`, {
    method: "GET",
  });
}

export async function getLikes(id) {
  return fetch(`https://www.neuralcook.com/api/like`, {
    method: "GET",
  });
}
