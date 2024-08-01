import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextSelect from "./TextSelect";

import {
  FormatBoldRounded,
  FormatItalicRounded,
  FormatUnderlinedRounded,
  FormatListBulletedRounded,
  FormatListNumberedRounded,
  UndoRounded,
  RedoRounded,
} from "@mui/icons-material";

export default function Editor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none [h3]:text-2xl",
      },
    },
    onUpdate({ editor }) {
      setValue(editor.getHTML());
    },
  });

  return (
    <div>
      <div className="mx-2 flex gap-2 bg-gray-200 rounded-full px-4 py-1 items-stretch sticky top-4 z-50">
        <TextSelect editor={editor} />
        <div className="my-1.5 w-0.5 bg-gray-400 rounded-full"></div>
        <div className="flex gap-1">
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 transition-all duration-200"
            onClick={() => {
              editor?.chain().focus().undo().run();
            }}
          >
            <UndoRounded />
          </button>
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 transition-all duration-200"
            onClick={() => {
              editor?.chain().focus().redo().run();
            }}
          >
            <RedoRounded />
          </button>
        </div>
        <div className="my-1.5 w-0.5 bg-gray-400 rounded-full"></div>
        <div className="flex gap-1">
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 data-[is-active]:bg-gray-300 transition-all duration-200"
            {...(editor?.isActive("bold") ? { "data-is-active": "true" } : {})}
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
          >
            <FormatBoldRounded />
          </button>
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 data-[is-active]:bg-gray-300 transition-all duration-200"
            {...(editor?.isActive("italic")
              ? { "data-is-active": "true" }
              : {})}
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
          >
            <FormatItalicRounded />
          </button>
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 data-[is-active]:bg-gray-300 transition-all duration-200"
            {...(editor?.isActive("underline")
              ? { "data-is-active": "true" }
              : {})}
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
          >
            <FormatUnderlinedRounded />
          </button>
        </div>
        <div className="my-1.5 w-0.5 bg-gray-400 rounded-full"></div>
        <div className="flex gap-1">
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 data-[is-active]:bg-gray-300 transition-all duration-200"
            {...(editor?.isActive("bulletList")
              ? { "data-is-active": "true" }
              : {})}
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
            }}
          >
            <FormatListBulletedRounded />
          </button>
          <button
            className="hover:bg-gray-300 rounded-lg px-0.5 py-0.5 data-[is-active]:bg-gray-300 transition-all duration-200"
            {...(editor?.isActive("orderedList")
              ? { "data-is-active": "true" }
              : {})}
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
            }}
          >
            <FormatListNumberedRounded />
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border px-5 py-5 mt-4">
        <EditorContent className="focus:outline-none" editor={editor} />
      </div>
    </div>
  );
}
