import axios from 'axios';

export async function getPageOfUsers(page) {
  const result = await axios({
    method: "GET",
    url: `https://reqres.in/api/users?page=${page}`
  });
  return result.data;
}
