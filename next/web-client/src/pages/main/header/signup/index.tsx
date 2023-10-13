import Localization, { l } from '@localazer/component';
import { Button, Form, Input, Modal } from 'antd';
import { ReactElement, useState } from 'react';

import { useUserApi } from '../../../../features/user';

type Store = {
  email: string;
  password: string;
};

export const Signup = (): ReactElement => {
  const { signup } = useUserApi();
  const [signupState, signupModal] = useState(false);

  return (
    <>
      <Button onClick={(): void => signupModal(true)} type="primary">
        <Localization>{l('Sign Up')}</Localization>
      </Button>

      <Modal footer={null} onCancel={(): void => signupModal(false)} open={signupState} title={l('Sign Up')()}>
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
            <Button htmlType="submit" type="primary">
              <Localization>{l('Sign Up')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
