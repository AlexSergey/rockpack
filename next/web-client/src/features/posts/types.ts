export interface PostsPayload {
  page: number;
  postData: FormData;
}

export interface DeletePostPayload {
  id: number;
  owner: boolean;
}
