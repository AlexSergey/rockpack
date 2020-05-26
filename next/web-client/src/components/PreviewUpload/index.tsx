import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import useStyles from 'isomorphic-style-loader/useStyles';
import { getBase64 } from '../../utils/file';
import config from '../../config';
import styles from './styles.modules.scss';

const PreviewUpload = ({ onChange }: { onChange: (file: UploadFile<{}>|false) => void}): JSX.Element => {
  useStyles(styles);

  const [preview, setPreview] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      const img = await getBase64(file);
      file.preview = img;
      setPreview(img);
    }
  };

  return (
    <>
      <Upload
        fileList={fileList}
        showUploadList={false}
        beforeUpload={(file) => {
          const isSupported = config.fileFormats.includes(file.type);
          if (!isSupported) {
            message.error('You can only upload image file!');
          } else {
            handlePreview(file);
            setFileList([file]);
          }
          return false;
        }}
        onChange={async (info) => {
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
        <div className={styles['preview-holder']}>
          <img className={styles.preview} src={preview} alt="preview" />
        </div>
      ) : null}
    </>
  );
};

export default PreviewUpload;
