const BASE_URL = ' https://api.tvmaze.com';

export async function getList() {
  return fetch(`${BASE_URL}/shows`).then((response) => response.json());
}
export async function getDetails(id) {
  return fetch(`${BASE_URL}/shows/${id}`).then((response) => response.json());
}