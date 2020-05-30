import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import loadable from '@loadable/component';
import { usePostApi } from '../../../features/PostDetails';
import { useCookie } from '../../../features/IsomorphicCookies';

const Wysiwyg = loadable(() => import('../../../components/Wysiwyg'));

export const UpdateMode = ({ postId, title, text, onFinish }: { postId: number; title: string; text: string; onFinish: () => void }): JSX.Element => {
  const [postText, setText] = useState(text);
  const token = useCookie('token');
  const { updatePost } = usePostApi();
  return (
    <>
      <div>
        <Form
          name="post"
          onFinish={(store: any) => {
            updatePost({
              postId,
              title: store.title,
              text: postText,
              token
            });
            onFinish();
          }}
        >
          <Form.Item
            label="title"
            name="title"
            initialValue={title}
            rules={[
              {
                required: true
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Wysiwyg value={postText} onChange={setText} />

          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </div>
    </>
  );
};
