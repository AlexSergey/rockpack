import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { useUserApi } from '../../../../features/User';

type Store = {
  email: string;
  password: string;
};

export const Signin = (): JSX.Element => {
  const [signinState, signinModal] = useState(false);
  const { signin } = useUserApi();

  return (
    <>
      <Button type="primary" onClick={(): void => signinModal(true)}>
        Sign In
      </Button>

      <Modal
        title="Sign In"
        visible={signinState}
        onCancel={(): void => signinModal(false)}
      >
        <Form
          name="signin"
          onFinish={(store: Store): void => {
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
