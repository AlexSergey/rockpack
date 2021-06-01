import React from 'react';
import { Layout } from 'antd';
import { Content } from './Content';
import { Header } from './Header';
import { Footer } from './Footer';

export const Main = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => (
  <>
    <Layout className="main-content-layout">
      <Header />
      <Content>
        {children}
      </Content>
      <Footer />
    </Layout>
  </>
);
