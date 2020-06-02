import React from 'react';
import { Button } from 'antd';
import { Roles, User } from '../../../../types/User';
import { Access, Owner } from '../../../../features/User';
import { useCommentsApi } from '../../../../features/Comments';

interface CommentInterface {
  id: number;
  text: string;
  createdAt: Date;
  user: User;
}

export const Comment = ({ id, text, createdAt, user }: CommentInterface): JSX.Element => {
  const commentsApi = useCommentsApi();
  //eslint-disable-next-line
  console.log(createdAt);
  return (
    <div>
      <Access forRoles={[Roles.admin]}>
        {(roleMatched): JSX.Element => (roleMatched ? (
          <Button onClick={(): void => commentsApi.deleteComment(id)}>Delete Comment</Button>
        ) : (
          <Owner forUser={user.email}>
            <Button onClick={(): void => commentsApi.deleteComment(id)}>Delete Comment</Button>
          </Owner>
        ))}
      </Access>
      <p>{text}</p>
      {/*<p><span>{createdAt}</span></p>*/}
    </div>
  );
};
