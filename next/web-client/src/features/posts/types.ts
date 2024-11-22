export interface DeletePostPayload {
  id: number;
  owner: boolean;
}

export interface PostsPayload {
  page: number;
  postData: FormData;
}
