import Localization, { l } from '@localazer/component';
import { Modal, Button, Form, Input } from 'antd';
import React, { useState } from 'react';

import { useUserApi } from '../../../../features/user';

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

      <Modal title={l('Sign In')()} visible={signinState} onCancel={(): void => signinModal(false)} footer={null}>
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
                message: l('Please input your e-mail!')(),
                required: true,
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
                message: l('Please input your password!')(),
                required: true,
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
