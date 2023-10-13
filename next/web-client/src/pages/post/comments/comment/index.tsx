import { CloseOutlined } from '@ant-design/icons';
import { l, sprintf } from '@localazer/component';
import { Button, Tooltip } from 'antd';
import { ReactElement } from 'react';

import { useCommentsApi } from '../../../../features/comments';
import { Access, Owner, useUser } from '../../../../features/user';
import { IUser, Roles } from '../../../../types/user';
import { dateFormatter } from '../../../../utils/date-format';
import styles from './style.module.scss';

interface IComment {
  createdAt: string;
  id: number;
  text: string;
  user: IUser;
}

export const Comment = ({ createdAt, id, text, user }: IComment): ReactElement => {
  const commentsApi = useCommentsApi();
  const currentUser = useUser();

  return (
    <div className={styles.comment}>
      <Access forRoles={[Roles.admin]}>
        {(roleMatched): ReactElement =>
          roleMatched ? (
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
          )
        }
      </Access>
      <p>{text}</p>
      <p className={styles.date}>
        <Tooltip title={sprintf(l('The user has role "%s"', 'User role')(), user.Role.role)()}>
          <span>{user.email}</span>
        </Tooltip>{' '}
        | <span>{dateFormatter(createdAt)}</span>
      </p>
    </div>
  );
};
