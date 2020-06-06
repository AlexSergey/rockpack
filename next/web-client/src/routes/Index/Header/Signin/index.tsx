import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import Localization, { l, useI18n } from '@rockpack/localazer';
import { useUserApi } from '../../../../features/User';

type Store = {
  email: string;
  password: string;
};

export const Signin = (): JSX.Element => {
  const i18n = useI18n();
  const [signinState, signinModal] = useState(false);
  const { signin } = useUserApi();

  return (
    <>
      <Button type="primary" onClick={(): void => signinModal(true)}>
        Sign In
      </Button>

      <Modal
        title={l('Sign In')(i18n)}
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
            label={l('E-mail')(i18n)}
            name="email"
            rules={[
              {
                required: true,
                message: l('Please input your e-mail!')(i18n),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={l('Password')(i18n)}
            name="password"
            rules={[
              {
                required: true,
                message: l('Please input your password!')(i18n),
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
