import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import MetaTags from 'react-meta-tags';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import Localization, { l, sprintf } from '@rockpack/localazer';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Comments } from './Comments';
import { UpdateMode } from './UpdateMode';
import { AddComment } from './AddComment';
import { Images } from './Images';
import { usePost } from '../../features/Post';
import { Access, Owner } from '../../features/User';
import { Roles } from '../../types/User';
import { Error } from '../../components/Error';
import { Loader } from '../../components/Loader';

import styles from './style.module.scss';

type PathParamsType = {
  postId: string;
};

type PropsType = RouteComponentProps<PathParamsType> & {
  // Your component own properties
};

const PostDetails = ({
  match
}: PropsType): JSX.Element => {
  useStyles(styles);

  const postId = Number(match.params.postId);
  const [loading, error, data] = usePost(postId);
  const [updateMode, setUpdateMode] = useState(false);

  return (
    <>
      <MetaTags>
        <title>{data && data.title}</title>
        <meta name="description" content={data && data.title} />
      </MetaTags>
      {loading && <Loader />}
      {error && <Error />}
      {data && (
        <div className={styles['post-page']}>
          <div className={styles.post}>
            {data.User && (
              <Owner forUser={data.User.email}>
                <Button className={styles.update} onClick={(): void => setUpdateMode(true)}>
                  <Localization>{l('Update post')}</Localization>
                </Button>
              </Owner>
            )}
            <h1>{data.title}</h1>

            {data.text && <div dangerouslySetInnerHTML={{ __html: data.text }} />}

            {Array.isArray(data.Photos) && data.Photos.length > 0 && (
              <Images images={data.Photos} />
            )}

            <div className={styles.comments}>
              <p>Comments: {data.Statistic.comments}</p>
            </div>
          </div>

          {data.Statistic && data && data.Statistic.comments > 0 && (
            <Comments commentsCount={data.Statistic.comments} postId={postId} />
          )}

          <Access forRoles={[Roles.user, Roles.admin]}>
            <AddComment postId={postId} />
          </Access>

          <Modal
            title={
              sprintf(
                l('Update post %s', 'Post')(),
                data.title
              )()
            }
            visible={updateMode}
            onCancel={(): void => setUpdateMode(false)}
            footer={null}
          >
            <UpdateMode
              postId={data.id}
              text={data.text}
              title={data.title}
              onFinish={(): void => setUpdateMode(false)}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default withRouter(PostDetails);
