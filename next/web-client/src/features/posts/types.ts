export interface IPostsPayload {
  page: number;
  postData: FormData;
}

export interface IDeletePostPayload {
  id: number;
  owner: boolean;
}
