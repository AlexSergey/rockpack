import React from 'react';
import MetaTags from 'react-meta-tags';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Comments } from './Comments';
import { AddComment } from './AddComment';
import { usePost } from '../../features/PostDetails';
import { Access } from '../../features/AuthManager';
import { Roles } from '../../types/AuthManager';

type PathParamsType = {
  postId: string;
};


type PropsType = RouteComponentProps<PathParamsType> & {
  // Your component own properties
};

const PostDetails = ({
  match
}: PropsType): JSX.Element => {
  const { postId } = match.params;
  const [loading, error, data] = usePost(postId);
  return (
    <>
      <MetaTags>
        <title>Post</title>
        <meta name="description" content="Secondary page" />
      </MetaTags>
      <div>
        <h1>POST</h1>
      </div>
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {data && (
        <>
          {data.text && <div dangerouslySetInnerHTML={{ __html: data.text }} />}

          {data.Statistic && data && data.Statistic.comments > 0 && (
            <Comments commentsCount={data.Statistic.comments} postId={postId} />
          )}

          <Access forRoles={[Roles.user, Roles.admin]}>
            <AddComment postId={postId} />
          </Access>
        </>
      )}
    </>
  );
};

export default withRouter(PostDetails);
