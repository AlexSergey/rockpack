import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { useUserApi } from '../../../../features/User';

type Store = {
  email: string;
  password: string;
};

export const Signup = (): JSX.Element => {
  const { signup } = useUserApi();
  const [signupState, signupModal] = useState(false);

  return (
    <>
      <Button type="primary" onClick={(): void => signupModal(true)}>
        Sign Up
      </Button>

      <Modal
        title="Sign Up"
        visible={signupState}
        onCancel={(): void => signupModal(false)}
      >
        <Form
          name="signup"
          onFinish={(store: Store): void => {
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
