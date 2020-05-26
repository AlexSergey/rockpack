import React from 'react';

export const Comment = ({
  text, createdAt
}: { text: string; createdAt?: Date }): JSX.Element => (
  <div>
    <p>{text}</p>
    <p><span>{createdAt}</span></p>
  </div>
);
