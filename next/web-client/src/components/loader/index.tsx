import { Spin } from 'antd';
import React from 'react';

export const Loader = (): JSX.Element => (
  <div style={{ textAlign: 'center' }}>
    <Spin />
  </div>
);
