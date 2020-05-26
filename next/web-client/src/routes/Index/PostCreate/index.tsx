import React, { useState, useRef } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import { isBackend } from '@rockpack/ussr';
import loadable from '@loadable/component';
import PreviewUpload from '../../../components/PreviewUpload';
import PhotosUpload from '../../../components/PhotosUpload';
import { usePostsApi } from '../../../features/Posts';

const Wysiwyg = loadable(() => import('../../../components/Wysiwyg'));

export const PostCreate = (): JSX.Element => {
  const { createPost } = usePostsApi();
  const [postCreate, postCreateModal] = useState(false);
  const [text, setText] = useState('');
  const formData = useRef(isBackend() ? {} : new FormData());

  const cleanState = () => {
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
    }
    files.forEach(file => {
      if (formData.current instanceof FormData) {
        formData.current.append('photos', file);
      }
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => postCreateModal(true)}>
        Create post
      </Button>
      <Modal
        title="Post Create"
        footer={null}
        visible={postCreate}
        onCancel={() => {
          cleanState();
          postCreateModal(false);
        }}
      >
        {postCreate && (
          <Form
            name="post"
            onFinish={(store: any) => {
              if (formData.current instanceof FormData) {
                formData.current.append('title', store.title);
                formData.current.append('text', text);
              }
              createPost(formData.current);
              cleanState();
              postCreateModal(false);
            }}
          >
            <Form.Item
              label="title"
              name="title"
              rules={[
                {
                  required: true
                },
              ]}
            >
              <Input />
            </Form.Item>
            <PreviewUpload onChange={previewChange} />
            <Wysiwyg value={text} onChange={setText} />
            <PhotosUpload onChange={photosChange} />
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form>
        )}
      </Modal>
    </>
  );
};
