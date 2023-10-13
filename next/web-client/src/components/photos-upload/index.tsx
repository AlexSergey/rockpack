import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { ReactElement, useState } from 'react';

import { config } from '../../config';
import { getBase64 } from '../../utils/file';

export const PhotosUpload = ({ onChange }: { onChange: (file: UploadFile[]) => void }): ReactElement => {
  const [uploadList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = (): void => setPreviewVisible(false);

  const handlePreview = async (file): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList }): void => {
    setFileList(fileList);
    onChange(fileList);
  };

  const uploadButton: ReactElement = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload
        beforeUpload={(file): false => {
          const isSupported = config.fileFormats.includes(file.type);
          if (!isSupported) {
            message.error('You can only upload image file!');
          } else {
            setFileList([file]);
          }

          return false;
        }}
        fileList={uploadList}
        listType="picture-card"
        multiple
        onChange={handleChange}
        onPreview={handlePreview}
      >
        {uploadList.length >= config.maxPhotos ? null : uploadButton}
      </Upload>
      <Modal footer={null} onCancel={handleCancel} open={previewVisible} title={previewTitle}>
        <img alt="example" src={previewImage} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};
