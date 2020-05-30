import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils/file';
import config from '../../config';

const PhotosUpload = ({ onChange }: { onChange: (file: UploadFile<any>[]) => void }) => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    onChange(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        multiple
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file) => {
          const isSupported = config.fileFormats.includes(file.type);
          if (!isSupported) {
            message.error('You can only upload image file!');
          } else {
            setFileList([file]);
          }
          return false;
        }}
      >
        {fileList.length >= config.maxPhotos ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default PhotosUpload;
