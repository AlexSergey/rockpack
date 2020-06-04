import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Localization, { l } from '@rockpack/localazer';
import loadable from '@loadable/component';
import { usePostApi } from '../../../features/Post';

const Wysiwyg = loadable(() => import('../../../components/Wysiwyg'));

interface UpdateModeInterface {
  postId: number;
  title: string;
  text: string;
  onFinish: () => void;
}

type Store = {
  title: string;
};

export const UpdateMode = ({ postId, title, text, onFinish }: UpdateModeInterface): JSX.Element => {
  const [postText, setText] = useState(text);
  const { updatePost } = usePostApi();
  return (
    <>
      <div>
        <Form
          name="post"
          onFinish={(store: Store): void => {
            updatePost({
              postId,
              title: store.title,
              text: postText
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
          <Form.Item>
            <Wysiwyg value={postText} onChange={setText} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              <Localization>{l('Update post')}</Localization>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
