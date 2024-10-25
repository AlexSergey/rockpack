import { isBackend } from '@issr/core';
import loadable from '@loadable/component';
import Localization, { l } from '@localazer/component';
import { Button, Form, Input, Modal } from 'antd';
import { ReactElement, useRef, useState } from 'react';

import { PhotosUpload } from '../../../../components/photos-upload';
import { PreviewUpload } from '../../../../components/preview-upload';
import { usePagination, usePostsApi } from '../../../../features/posts';

const Wysiwyg = loadable(() => import('../../../../components/wysiwyg'));

interface FormState {
  title: string;
}

export const CreatePost = (): ReactElement => {
  const { current } = usePagination();
  const { createPost } = usePostsApi();
  const [postCreate, postCreateModal] = useState(false);
  const [text, setText] = useState('');
  const formData = useRef(isBackend() ? {} : new FormData());

  const cleanState = (): void => {
    if (formData.current instanceof FormData) {
      formData.current.delete('photos');
      formData.current.delete('preview');
      formData.current.delete('title');
      formData.current.delete('text');
      setText('');
    }
  };

  const previewChange = (file): void => {
    if (formData.current instanceof FormData) {
      formData.current.append('preview', file);
    }
  };

  const photosChange = (files): void => {
    if (formData.current instanceof FormData) {
      formData.current.delete('photos');

      files.forEach((file) => {
        if (formData.current instanceof FormData) {
          formData.current.append('photos', file.originFileObj);
        }
      });
    }
  };

  return (
    <>
      <Button onClick={(): void => postCreateModal(true)} type="primary">
        <Localization>{l('Create post')}</Localization>
      </Button>
      <Modal
        footer={null}
        onCancel={(): void => {
          cleanState();
          postCreateModal(false);
        }}
        open={postCreate}
        title={l('Create')()}
      >
        {postCreate && (
          <Form
            name="post"
            onFinish={(store: FormState): void => {
              if (formData.current instanceof FormData) {
                formData.current.append('title', store.title);
                formData.current.append('text', text);
                createPost({ page: current, postData: formData.current });
              }
              cleanState();
              postCreateModal(false);
            }}
          >
            <Form.Item
              label={l('Title')()}
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
              <PreviewUpload onChange={previewChange} />
            </Form.Item>
            <Form.Item>
              <Wysiwyg onChange={setText} value={text} />
            </Form.Item>
            <Form.Item>
              <PhotosUpload onChange={photosChange} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button htmlType="submit" type="primary">
                <Localization>{l('Create')}</Localization>
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
