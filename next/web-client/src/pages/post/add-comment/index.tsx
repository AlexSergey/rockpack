import Localization, { l } from '@localazer/component';
import { Button, Form, Input } from 'antd';
import React from 'react';

import { useCommentsApi } from '../../../features/comments';
import { useUser } from '../../../features/user';

import styles from './style.module.scss';

interface IAddComment {
  postId: number;
}

type Store = {
  text: string;
};

export const AddComment = ({ postId }: IAddComment): JSX.Element => {
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
          <Input.TextArea rows={4} className={styles['text-area']} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            <Localization>{l('Publish')}</Localization>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
