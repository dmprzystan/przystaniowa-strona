import React from 'react';
import EditorComponent from './Editor';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const EditorMobile = ({ value, onChange }: Props) => {
  return (
    <div className="editor-mobile">
      <EditorComponent value={value} onChange={onChange} />
    </div>
  );
};

export default EditorMobile;
