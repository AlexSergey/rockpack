import React from 'react';
import MetaTags from 'react-meta-tags';
import { Layout } from 'antd';
import { Content } from './Content';
import { Header } from './Header';
import { Footer } from './Footer';

export const Index = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => (
  <>
    <MetaTags>
      <title>Home</title>
      <meta name="description" content="Home page" />
    </MetaTags>
    <Layout className="main-content-layout">
      <Header />
      <Content>
        {children}
      </Content>
      <Footer />
    </Layout>
  </>
);
