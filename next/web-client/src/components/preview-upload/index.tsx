import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useState } from 'react';

import { config } from '../../config';
import { getBase64 } from '../../utils/file';

import styles from './style.module.scss';

export const PreviewUpload = ({
  onChange,
}: {
  onChange: (file: UploadFile<Record<string, unknown>> | false) => void;
}): JSX.Element => {
  const [preview, setPreview] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file): Promise<void> => {
    if (!file.url && !file.preview) {
      const img = await getBase64(file);
      file.preview = img;
      setPreview(img);
    }
  };

  return (
    <div className={`${styles.holder} ${preview.length === 0 ? styles['without-preview'] : ''}`}>
      <Upload
        fileList={fileList}
        showUploadList={false}
        beforeUpload={(file): false => {
          const isSupported = config.fileFormats.includes(file.type);
          if (!isSupported) {
            message.error('You can only upload image file!');
          } else {
            handlePreview(file);
            setFileList([file]);
          }

          return false;
        }}
        onChange={(info): void => {
          if (info.fileList.length === 0) {
            setPreview('');
            setFileList([]);
            onChange(false);
          } else {
            onChange(info.file);
          }
        }}
      >
        <Button>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
      {preview !== '' ? (
        <div>
          <img className={styles.preview} src={preview} alt="preview" />
        </div>
      ) : null}
    </div>
  );
};
