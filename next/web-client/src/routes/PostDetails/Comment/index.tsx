import React from 'react';
import { Button } from 'antd';
import { Roles } from '../../../types/AuthManager';
import { Access, Owner } from '../../../features/AuthManager';
import { useCommentsApi } from '../../../features/Comments';
import { User } from '../../../types/PostDetails';

export const Comment = ({
  id, text, createdAt, user
}: { id: number; text: string; createdAt: Date; user: User }): JSX.Element => {
  const commentsApi = useCommentsApi();

  return (
    <div>
      <Access forRoles={[Roles.admin]}>
        {roleMatched => (roleMatched ? (
          <Button onClick={() => commentsApi.deleteComment(id)}>Delete Comment</Button>
        ) : (
          <Owner forUser={user.email}>
            <Button onClick={() => commentsApi.deleteComment(id)}>Delete Comment</Button>
          </Owner>
        ))}
      </Access>
      <p>{text}</p>
      <p><span>{createdAt}</span></p>
    </div>
  );
};
