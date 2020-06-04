import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Roles, User } from '../../../../types/User';
import { Access, Owner, useUser } from '../../../../features/User';
import { useCommentsApi } from '../../../../features/Comments';
import { dateFormatter } from '../../../../utils/dateFormat';

import styles from './style.modules.scss';

interface CommentInterface {
  id: number;
  text: string;
  createdAt: Date;
  user: User;
}

export const Comment = ({ id, text, createdAt, user }: CommentInterface): JSX.Element => {
  useStyles(styles);

  const commentsApi = useCommentsApi();
  const currentUser = useUser();
  return (
    <div className={styles.comment}>
      <Access forRoles={[Roles.admin]}>
        {(roleMatched): JSX.Element => (roleMatched ? (
          <Button
            className={styles['delete-comment']}
            danger
            onClick={(): void => commentsApi.deleteComment(id, currentUser.email === user.email)}
          >
            <CloseOutlined />
          </Button>
        ) : (
          <Owner forUser={user.email}>
            <Button
              className={styles['delete-comment']}
              danger
              onClick={(): void => commentsApi.deleteComment(id, currentUser.email === user.email)}
            >
              <CloseOutlined />
            </Button>
          </Owner>
        ))}
      </Access>
      <p>{text}</p>
      <p className={styles.date}><span>{dateFormatter(createdAt)}</span></p>
    </div>
  );
};
