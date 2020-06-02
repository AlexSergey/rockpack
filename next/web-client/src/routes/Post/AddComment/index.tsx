import React from 'react';
import { Button, Form, Input } from 'antd';
import { useUser } from '../../../features/User';
import { useCommentsApi } from '../../../features/Comments';

interface AddCommentInterface {
  postId: number;
}

type Store = {
  text: string;
};

export const AddComment = ({ postId }: AddCommentInterface): JSX.Element => {
  const [form] = Form.useForm();
  const user = useUser();
  const { createComment } = useCommentsApi();

  return (
    <div>
      <h4>Create comment</h4>
      <Form
        form={form}
        name="comment"
        onFinish={(store: Store): void => {
          createComment({
            postId,
            text: store.text,
            user
          });
          form.resetFields();
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
