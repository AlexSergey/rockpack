import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { ReactElement, useState } from 'react';

import { config } from '../../config';
import { getBase64 } from '../../utils/file';
import styles from './style.module.scss';

export const PreviewUpload = ({
  onChange,
}: {
  onChange: (file: false | UploadFile<Record<string, unknown>>) => void;
}): ReactElement => {
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
        fileList={fileList}
        onChange={(info): void => {
          if (info.fileList.length === 0) {
            setPreview('');
            setFileList([]);
            onChange(false);
          } else {
            onChange(info.file);
          }
        }}
        showUploadList={false}
      >
        <Button>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
      {preview !== '' ? (
        <div>
          <img alt="preview" className={styles.preview} src={preview} />
        </div>
      ) : null}
    </div>
  );
};
