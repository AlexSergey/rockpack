import { useState } from 'react';
export const OpenIds = ({ children, openIds }) => {
    const [openIdsState, setOpenIds] = useState(openIds);
    return children(openIdsState, setOpenIds);
};
