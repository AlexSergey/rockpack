import React from 'react';
import MetaTags from 'react-meta-tags';
import { Layout } from 'antd';
import { Content } from './Content';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../../features/AuthManager';

export const Index = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  const auth = useAuth();
  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <Layout className="main-content-layout">
        <Header
          signin={auth.signin}
          signout={auth.signout}
          signup={auth.signup}
        />
        <Content>
          {children}
        </Content>
        <Footer />
      </Layout>
    </>
  );
};
