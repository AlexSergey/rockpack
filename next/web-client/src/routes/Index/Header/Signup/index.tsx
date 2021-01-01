import React, { useState } from 'react';
import Localization, { l } from '@localazer/component';
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
        <Localization>{l('Sign Up')}</Localization>
      </Button>

      <Modal
        title={l('Sign Up')()}
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
              <Localization>{l('Sign Up')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
