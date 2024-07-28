"use client";

import React from "react";
import { CloseRounded } from "@mui/icons-material";

type ImageUploadProps = {
  image: File | null;
  setImage: (image: File | null) => void;
};

function ImageUpload(props: ImageUploadProps) {
  const [image, setImage] = React.useState<File | null>(props.image);
  const [highlight, setHighlight] = React.useState(false);

  React.useEffect(() => {
    props.setImage(image);
  }, [image]);

  return (
    <label
      htmlFor="image-input"
      className="flex items-center justify-center px-4 py-4 w-full h-[500px] bg-gray-200 rounded-3xl cursor-pointer border-dashed border-4 border-gray-300 hover:border-gray-400 data-[drop]:border-gray-400 transition-all duration-200"
      onDragOver={(e) => {
        e.preventDefault();
        setHighlight(true);
      }}
      onDragLeave={() => {
        setHighlight(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setHighlight(false);
        setImage(e.dataTransfer.files[0]);
      }}
      {...(highlight ? { "data-drop": "true" } : {})}
    >
      {image ? (
        <div className="flex relative items-center justify-center h-full">
          <img
            src={URL.createObjectURL(image)}
            alt="Zdjęcie"
            className="w-full h-full object-contain rounded-3xl"
          />
          {image && (
            <button
              className="absolute top-4 right-4 bg-red-500 rounded-full px-1 py-1 hover:bg-red-400 transition-all duration-200 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setImage(null);
              }}
            >
              <CloseRounded />
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 text-center font-semibold">
            Przeciągnij zdjęcie tutaj
          </p>
          <p className="text-gray-600 text-center">lub kliknij, aby wybrać</p>
        </div>
      )}
      <input
        type="file"
        id="image-input"
        accept="image/*"
        className="hidden"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
    </label>
  );
}

export default ImageUpload;
