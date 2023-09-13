export interface IPostsPayload {
  postData: FormData;
  page: number;
}

export interface IDeletePostPayload {
  id: number;
  owner: boolean;
}
