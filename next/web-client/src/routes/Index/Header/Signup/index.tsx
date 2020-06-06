import React, { useState } from 'react';
import Localization, { l, useI18n } from '@rockpack/localazer';
import { Modal, Button, Form, Input } from 'antd';
import { useUserApi } from '../../../../features/User';

type Store = {
  email: string;
  password: string;
};

export const Signup = (): JSX.Element => {
  const { signup } = useUserApi();
  const i18n = useI18n();
  const [signupState, signupModal] = useState(false);

  return (
    <>
      <Button type="primary" onClick={(): void => signupModal(true)}>
        Sign Up
      </Button>

      <Modal
        title={l('Sign Up')(i18n)}
        visible={signupState}
        onCancel={(): void => signupModal(false)}
        footer={null}
      >
        <Form
          name="signup"
          onFinish={(store: Store): void => {
            signup(store);
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
              <Localization>{l('Sign Up')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
