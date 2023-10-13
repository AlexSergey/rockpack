import { Layout } from 'antd';
import { ReactElement } from 'react';

import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';

export const Main = ({ children }: { children: ReactElement | ReactElement[] }): ReactElement => (
  <Layout className="main-content-layout">
    <Header />
    <Content>{children}</Content>
    <Footer />
  </Layout>
);
