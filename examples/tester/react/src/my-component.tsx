import React from 'react';

interface MyComponentProps {
  firstName: string;
  lastName: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ firstName, lastName }) => (
  <h1>
    Hi {firstName} {lastName}!
  </h1>
);
