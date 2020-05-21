import React from 'react';
import MetaTags from 'react-meta-tags';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

type PathParamsType = {
  userId: string;
};

// Your component own properties
type PropsType = RouteComponentProps<PathParamsType> & {
  someString: string;
};

const Secondary = ({
  match
}: PropsType): JSX.Element => {
  console.log(match);
  return (
    <>
      <MetaTags>
        <title>Post</title>
        <meta name="description" content="Secondary page" />
      </MetaTags>
      <div>
        <h1>USER</h1>
      </div>
    </>
  );
};

export default withRouter(Secondary);
