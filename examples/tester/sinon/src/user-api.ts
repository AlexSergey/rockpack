import axios from 'axios';

export interface User {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

interface UserApiResponse {
  data: User[];
  page: number;
  total_pages: number;
}

export async function getPageOfUsers(page: number): Promise<UserApiResponse> {
  const result = await axios({
    method: 'GET',
    url: `https://reqres.in/api/users?page=${page}`,
  });

  return result.data as UserApiResponse;
}
