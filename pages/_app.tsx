import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function MyApp({ Component, pageProps }) {
  const [value, setValue] = React.useState('');

  return (
    <div className="container">
      <Component {...pageProps} />
      <Editor
        value={value}
        onChange={(newValue) => setValue(newValue)}
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
}

export default MyApp;
