import React from 'react';
import MetaTags from 'react-meta-tags';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Comments } from './components/Comments';
import { usePost } from '../../features/PostDetails';

type PathParamsType = {
  postId: string;
};

// Your component own properties
type PropsType = RouteComponentProps<PathParamsType> & {
  someString: string;
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
      {data && data.Statistic && data && data.Statistic.comments > 0 && <Comments postId={postId} />}
    </>
  );
};

export default withRouter(PostDetails);
