import { Layout } from 'antd';

import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';

export const Main = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => (
  <Layout className="main-content-layout">
    <Header />
    <Content>{children}</Content>
    <Footer />
  </Layout>
);
