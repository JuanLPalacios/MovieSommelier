/* eslint-disable camelcase */
const BASE_URL = ' https://us-central1-involvement-api.cloudfunctions.net/capstoneApi';
const APP_ID = 'OAW88uh8tayXubZCqUNx';

export async function like(item_id) {
  return fetch(`${BASE_URL}/apps/${APP_ID}/likes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id }),
    }).then((response) => response.text());
}
export async function getLikesList() {
  return fetch(`${BASE_URL}/apps/${APP_ID}/likes`).then((response) => response.json());
}
export async function addComment(item_id, username, comment) {
  return fetch(`${BASE_URL}/apps/${APP_ID}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id, username, comment }),
    }).then((response) => response.text());
}
export async function getCommentList(item_id) {
  return fetch(`${BASE_URL}/apps/${APP_ID}/comments?item_id=${item_id}`)
    .then((response) => response.json())
    .then((response) => {
      if (response.error) throw response.error;
      return response;
    });
}