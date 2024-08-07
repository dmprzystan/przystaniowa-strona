import React from "react";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";
import { Editor } from "@tiptap/react";

function TextSelect({ editor }: { editor: Editor | null }) {
  const [selectShown, setSelectShown] = React.useState(false);

  const [isHeadingHovered, setIsHeadingHovered] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="flex hover:bg-gray-300 items-center pl-2 py-1 rounded-lg"
        onClick={() => {
          setSelectShown(!selectShown);
        }}
      >
        <p>
          {editor?.isActive("heading", { level: 3 }) && "Nagłówek 1"}
          {editor?.isActive("heading", { level: 4 }) && "Nagłówek 2"}
          {editor?.isActive("heading", { level: 5 }) && "Nagłówek 3"}
          {editor?.isActive("paragraph") && "Zwykły tekst"}
        </p>
        <KeyboardArrowDownRounded />
      </button>
      {selectShown && (
        <div className="absolute z-50 bg-gray-50 px-4 py-2 rounded-xl mt-2 flex flex-col items-stretch gap-2 shadow-lg prose">
          <button
            type="button"
            className="hover:bg-gray-200 px-2 py-1 rounded-lg whitespace-nowrap text-left  transition-all duration-200"
            onClick={() => {
              editor?.chain().setParagraph().run();
              setSelectShown(false);
            }}
          >
            <p className="my-0">Zwykły tekst</p>
          </button>
          <div className="bg-gray-200 rounded-full h-0.5" />
          <div
            className="relative hover:bg-gray-200 px-2 py-1 rounded-lg whitespace-nowrap flex items-center justify-between gap-2  transition-all duration-200"
            onPointerEnter={() => setIsHeadingHovered(true)}
            onPointerLeave={() => setIsHeadingHovered(false)}
          >
            <h3 className="my-0">Nagłówek</h3>
            <KeyboardArrowRightRounded />
            {isHeadingHovered && (
              <div className="absolute left-full pl-6">
                <div className="bg-gray-50 px-2 py-2 rounded-lg shadow-md">
                  <button
                    type="button"
                    className="relative hover:bg-gray-200 px-2 py-1 rounded-lg whitespace-nowrap flex items-center justify-between gap-2  transition-all duration-200"
                    onClick={() => {
                      editor?.chain().setHeading({ level: 3 }).run();
                      setIsHeadingHovered(false);
                      setSelectShown(false);
                    }}
                  >
                    <h3 className="my-0">Nagłówek 1</h3>
                  </button>
                  <button
                    type="button"
                    className="relative hover:bg-gray-200 px-2 py-1 rounded-lg whitespace-nowrap flex items-center justify-between gap-2  transition-all duration-200"
                    onClick={() => {
                      editor?.chain().setHeading({ level: 4 }).run();
                      setIsHeadingHovered(false);
                      setSelectShown(false);
                    }}
                  >
                    <h4 className="my-0">Nagłówek 2</h4>
                  </button>
                  <button
                    type="button"
                    className="relative hover:bg-gray-200 px-2 py-1 rounded-lg whitespace-nowrap flex items-center justify-between gap-2  transition-all duration-200"
                    onClick={() => {
                      editor?.chain().setHeading({ level: 5 }).run();
                      setIsHeadingHovered(false);
                      setSelectShown(false);
                    }}
                  >
                    <h5 className="my-0">Nagłówek 3</h5>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TextSelect;
