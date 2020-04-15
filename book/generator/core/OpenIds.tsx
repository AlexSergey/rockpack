import { useState } from 'react';

export const OpenIds = ({ children, openIds }): JSX.Element => {
  const [openIdsState, setOpenIds] = useState(openIds);
  
  return children(openIdsState, setOpenIds);
};
