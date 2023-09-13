import loadable from '@loadable/component';
import Localization, { l } from '@localazer/component';
import { Form, Input, Button } from 'antd';
import { useState } from 'react';

import { usePostApi } from '../../../features/post';

const Wysiwyg = loadable(() => import('../../../components/wysiwyg'));

interface IUpdateMode {
  postId: number;
  title: string;
  text: string;
  onFinish: () => void;
}

type Store = {
  title: string;
};

export const UpdateMode = ({ postId, title, text, onFinish }: IUpdateMode): JSX.Element => {
  const [postText, setText] = useState(text);
  const { updatePost } = usePostApi();

  return (
    <div>
      <Form
        name="post"
        onFinish={(store: Store): void => {
          updatePost({
            postId,
            text: postText,
            title: store.title,
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
              required: true,
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
  );
};
