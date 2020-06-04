import React, { useState, useRef } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import Localization, { l, useI18n } from '@rockpack/localazer';
import { isBackend } from '@rockpack/ussr';
import loadable from '@loadable/component';
import PreviewUpload from '../../../../components/PreviewUpload';
import PhotosUpload from '../../../../components/PhotosUpload';
import { usePostsApi } from '../../../../features/Posts';

import styles from './style.modules.scss';

const Wysiwyg = loadable(() => import('../../../../components/Wysiwyg'));

type FormState = {
  title: string;
};

export const CreatePost = (): JSX.Element => {
  const i18n = useI18n();
  useStyles(styles);
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

      files.forEach(file => {
        if (formData.current instanceof FormData) {
          formData.current.append('photos', file.originFileObj);
        }
      });
    }
  };

  return (
    <>
      <Button type="primary" onClick={(): void => postCreateModal(true)}>
        <Localization>{l('Create post')}</Localization>
      </Button>
      <Modal
        title={l('Post Create')(i18n)}
        footer={null}
        visible={postCreate}
        onCancel={(): void => {
          cleanState();
          postCreateModal(false);
        }}
      >
        {postCreate && (
          <Form
            name="post"
            onFinish={(store: FormState): void => {
              if (formData.current instanceof FormData) {
                formData.current.append('title', store.title);
                formData.current.append('text', text);
                createPost({ postData: formData.current });
              }
              cleanState();
              postCreateModal(false);
            }}
          >
            <Form.Item
              label={l('Title')(i18n)}
              name="title"
              rules={[
                {
                  required: true
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <PreviewUpload onChange={previewChange} />
            </Form.Item>
            <Form.Item>
              <Wysiwyg value={text} onChange={setText} />
            </Form.Item>
            <Form.Item>
              <PhotosUpload onChange={photosChange} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                <Localization>{l('Create')}</Localization>
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
