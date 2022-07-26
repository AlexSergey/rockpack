import Localization, { l, sprintf } from '@localazer/component';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useParams } from 'react-router-dom';

import { Error } from '../../components/error';
import { Loader } from '../../components/loader';
import { usePost } from '../../features/post';
import { Access, Owner } from '../../features/user';
import { Roles } from '../../types/user';

import { AddComment } from './add-comment';
import { Comments } from './comments';
import { Images } from './images';
import styles from './style.module.scss';
import { UpdateMode } from './update-mode';

type PathParamsType = {
  postId: string;
};

const PostDetails = (): JSX.Element => {
  const params = useParams<PathParamsType>();
  const postId = Number(params.postId);
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

            {Array.isArray(data.Photos) && data.Photos.length > 0 && <Images images={data.Photos} />}

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
            title={sprintf(l('Update post %s', 'Post')(), data.title)()}
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

export default PostDetails;
