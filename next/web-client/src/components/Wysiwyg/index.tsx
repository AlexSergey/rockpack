import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Wysiwyg = ({ value, onChange }: { value: string; onChange: (content: string) => void}): JSX.Element => (
  <ReactQuill
    theme="snow"
    value={value}
    onChange={onChange}
    modules={{
      toolbar: [
        [{ header: '3' }, { header: '4' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ['clean']
      ] }}
  />
);

export default Wysiwyg;
