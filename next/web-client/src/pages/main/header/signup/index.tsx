import Localization, { l } from '@localazer/component';
import { Modal, Button, Form, Input } from 'antd';
import { useState } from 'react';

import { useUserApi } from '../../../../features/user';

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

      <Modal title={l('Sign Up')()} open={signupState} onCancel={(): void => signupModal(false)} footer={null}>
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
              <Localization>{l('Sign Up')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
