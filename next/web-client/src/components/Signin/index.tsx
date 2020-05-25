import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { AuthInterface, User } from '../../types/AuthManager';

export const Signin = ({ signin }: Pick<AuthInterface, 'signin'>): JSX.Element => {
  const [signinState, signinModal] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => signinModal(true)}>
        Sign In
      </Button>

      <Modal
        title="Sign In"
        visible={signinState}
        onCancel={() => signinModal(false)}
      >
        <Form
          name="signin"
          onFinish={(store: User) => {
            console.log(store);
            signin(store);
          }}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sign In!
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
