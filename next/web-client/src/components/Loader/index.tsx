import React from 'react';
import { Spin } from 'antd';

export const Loader = (): JSX.Element => (
  <div style={{ textAlign: 'center' }}>
    <Spin />
  </div>
);
