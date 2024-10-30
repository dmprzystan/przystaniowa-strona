import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const EditorComponent = ({ value, onChange }: Props) => {
  const editorRef = React.createRef<Editor>();

  return (
    <div className="editor">
      <Editor
        ref={editorRef}
        value={value}
        onChange={(newValue) => onChange(newValue)}
        extensions={[StarterKit]}
        style={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          border: 'none',
          borderRadius: '0.25rem',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};

export default EditorComponent;
