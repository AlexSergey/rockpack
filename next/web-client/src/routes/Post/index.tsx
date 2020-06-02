import React, { useState } from 'react';
import { Button } from 'antd';
import MetaTags from 'react-meta-tags';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Comments } from './Comments';
import { UpdateMode } from './UpdateMode';
import { AddComment } from './AddComment';
import { usePost } from '../../features/Post';
import { Access, Owner } from '../../features/User';
import { Roles } from '../../types/User';

type PathParamsType = {
  postId: string;
};


type PropsType = RouteComponentProps<PathParamsType> & {
  // Your component own properties
};

const PostDetails = ({
  match
}: PropsType): JSX.Element => {
  const postId = Number(match.params.postId);
  const [loading, error, data] = usePost(postId);
  const [updateMode, setUpdateMode] = useState(false);

  return (
    <>
      <MetaTags>
        <title>Post</title>
        <meta name="description" content="Secondary page" />
      </MetaTags>
      <div>
        <h1>POST 8</h1>
      </div>
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {data && (
        <>
          {data.User && (
            <Owner forUser={data.User.email}>
              <Button onClick={(): void => setUpdateMode(true)}>Update post</Button>
            </Owner>
          )}
          {data.text && <div dangerouslySetInnerHTML={{ __html: data.text }} />}

          <div>
            <h4>Statistic:</h4>
            <p>Comments: {data.Statistic.comments}</p>
          </div>

          {data.Statistic && data && data.Statistic.comments > 0 && (
            <Comments commentsCount={data.Statistic.comments} postId={postId} />
          )}

          <Access forRoles={[Roles.user, Roles.admin]}>
            <AddComment postId={postId} />
          </Access>

          {updateMode && (
            <UpdateMode
              postId={data.id}
              text={data.text}
              title={data.title}
              onFinish={(): void => setUpdateMode(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default withRouter(PostDetails);
