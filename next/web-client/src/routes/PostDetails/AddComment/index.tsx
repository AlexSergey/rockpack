import React from 'react';
import { Button, Form, Input } from 'antd';
import { useUser } from '../../../features/AuthManager';
import { useCommentsApi } from '../../../features/Comments';

export const AddComment = ({
  postId
}: { postId: string }): JSX.Element => {
  const { email, role } = useUser();
  const { createComment } = useCommentsApi(postId);

  return (
    <div>
      <h4>Create comment</h4>
      <Form
        name="comment"
        onFinish={(store: any) => {
          createComment({
            text: store.text,
            user: {
              email,
              role
            }
          });
        }}
      >
        <Form.Item
          label="text"
          name="text"
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Comment Create
        </Button>
      </Form>
    </div>
  );
};
