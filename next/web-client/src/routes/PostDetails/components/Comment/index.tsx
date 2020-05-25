import React from 'react';

export const Comment = ({
  children
}: { children: JSX.Element }): JSX.Element => (
  <>
    <div>
      {children}
    </div>
  </>
);
