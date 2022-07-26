import { Layout } from 'antd';
import React from 'react';

import { Content } from './Content';
import { Footer } from './Footer';
import { Header } from './Header';

export const Main = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => (
  <Layout className="main-content-layout">
    <Header />
    <Content>{children}</Content>
    <Footer />
  </Layout>
);
