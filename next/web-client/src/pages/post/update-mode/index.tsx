import loadable from '@loadable/component';
import Localization, { l } from '@localazer/component';
import { Button, Form, Input } from 'antd';
import { ReactElement, useState } from 'react';

import { usePostApi } from '../../../features/post';

const Wysiwyg = loadable(() => import('../../../components/wysiwyg'));

interface UpdateMode {
  onFinish: () => void;
  postId: number;
  text: string;
  title: string;
}

interface Store {
  title: string;
}

export const UpdateMode = ({ onFinish, postId, text, title }: UpdateMode): ReactElement => {
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
          initialValue={title}
          label="title"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Wysiwyg onChange={setText} value={postText} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button htmlType="submit" type="primary">
            <Localization>{l('Update post')}</Localization>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
