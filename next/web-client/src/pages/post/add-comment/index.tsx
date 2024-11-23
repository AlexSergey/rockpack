import Localization, { l } from '@localazer/component';
import { Button, Form, Input } from 'antd';
import { ReactElement } from 'react';

import { useCommentsApi } from '../../../features/comments';
import { useUser } from '../../../features/user';
import * as styles from './style.module.scss';

interface AddComment {
  postId: number;
}

interface Store {
  text: string;
}

export const AddComment = ({ postId }: AddComment): ReactElement => {
  const [form] = Form.useForm();
  const user = useUser();
  const { createComment } = useCommentsApi();

  return (
    <div className={styles['add-comment']}>
      <h4>
        <Localization>{l('Add comment')}</Localization>
      </h4>
      <Form
        form={form}
        name="comment"
        onFinish={(store: Store): void => {
          createComment({
            postId,
            text: store.text,
            user,
          });
          form.resetFields();
        }}
      >
        <Form.Item
          name="text"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea className={styles['text-area']} rows={4} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button htmlType="submit" type="primary">
            <Localization>{l('Publish')}</Localization>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
