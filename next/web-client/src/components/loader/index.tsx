import { Spin } from 'antd';
import { ReactElement } from 'react';

export const Loader = (): ReactElement => (
  <div style={{ textAlign: 'center' }}>
    <Spin />
  </div>
);
