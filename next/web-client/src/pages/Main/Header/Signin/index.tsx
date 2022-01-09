import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import Localization, { l } from '@localazer/component';
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
        <Localization>{l('Sign In')}</Localization>
      </Button>

      <Modal
        title={l('Sign In')()}
        visible={signinState}
        onCancel={(): void => signinModal(false)}
        footer={null}
      >
        <Form
          name="signin"
          onFinish={(store: Store): void => {
            signin(store);
          }}
        >
          <Form.Item
            label={l('E-mail')()}
            name="email"
            rules={[
              {
                required: true,
                message: l('Please input your e-mail!')(),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={l('Password')()}
            name="password"
            rules={[
              {
                required: true,
                message: l('Please input your password!')(),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              <Localization>{l('Sign In')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
