import Localization, { l } from '@localazer/component';
import { Button, Form, Input, Modal } from 'antd';
import { ReactElement, useState } from 'react';

import { useUserApi } from '../../../../features/user';

interface Store {
  email: string;
  password: string;
}

export const Signin = (): ReactElement => {
  const [signinState, signinModal] = useState(false);
  const { signin } = useUserApi();

  return (
    <>
      <Button onClick={(): void => signinModal(true)} type="primary">
        <Localization>{l('Sign In')}</Localization>
      </Button>

      <Modal footer={null} onCancel={(): void => signinModal(false)} open={signinState} title={l('Sign In')()}>
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
            <Button htmlType="submit" type="primary">
              <Localization>{l('Sign In')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
