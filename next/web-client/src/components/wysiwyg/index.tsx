import { ReactElement } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Wysiwyg = ({ onChange, value }: { onChange: (content: string) => void; value: string }): ReactElement => (
  <ReactQuill
    modules={{
      toolbar: [[{ header: [3, 4, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], ['clean']],
    }}
    onChange={onChange}
    theme="snow"
    value={value}
  />
);
