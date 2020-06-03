import React from 'react';
import { Button } from 'antd';
import { Roles, User } from '../../../../types/User';
import { Access, Owner, useUser } from '../../../../features/User';
import { useCommentsApi } from '../../../../features/Comments';
import { dateFormatter } from '../../../../utils/dateFormat';

interface CommentInterface {
  id: number;
  text: string;
  createdAt: Date;
  user: User;
}

export const Comment = ({ id, text, createdAt, user }: CommentInterface): JSX.Element => {
  const commentsApi = useCommentsApi();
  const currentUser = useUser();
  return (
    <div>
      <Access forRoles={[Roles.admin]}>
        {(roleMatched): JSX.Element => (roleMatched ? (
          <Button onClick={(): void => commentsApi.deleteComment(id, currentUser.email === user.email)}>Delete Comment</Button>
        ) : (
          <Owner forUser={user.email}>
            <Button onClick={(): void => commentsApi.deleteComment(id, currentUser.email === user.email)}>Delete Comment</Button>
          </Owner>
        ))}
      </Access>
      <p>{text}</p>
      <p><span>{dateFormatter(createdAt)}</span></p>
    </div>
  );
};
