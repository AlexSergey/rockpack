import { useState } from 'react';

type Params = {
  children: (openIdsState: string[], setOpenIds: (openIds: string[]) => void) => JSX.Element;
  openIds: string[];
};

export const OpenIds = ({ children, openIds }: Params): JSX.Element => {
  const [openIdsState, setOpenIds] = useState(openIds);

  return children(openIdsState, setOpenIds);
};
