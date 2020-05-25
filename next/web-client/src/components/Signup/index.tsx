import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { AuthInterface, User } from '../../types/AuthManager';

export const Signup = ({ signup }: Pick<AuthInterface, 'signup'>): JSX.Element => {
  const [signupState, signupModal] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => signupModal(true)}>
        Sign Up
      </Button>

      <Modal
        title="Sign Up"
        visible={signupState}
        onCancel={() => signupModal(false)}
      >
        <Form
          name="signup"
          onFinish={(store: User) => {
            console.log(store);
            signup(store);
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
              Sign Up!
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
