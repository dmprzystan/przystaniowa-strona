"use client";

import { CloseRounded, CloudUploadRounded } from "@mui/icons-material";
import React from "react";
import { motion } from "framer-motion";
import { Album, AlbumPhotoSize } from "@/app/lib/prisma";

type UploadProps = {
  album: Album;
  onClose: () => void;
  onSubmit: () => void;
};

type FileUpload = {
  file: File;
  progress: number;
};

function Upload({ album, onClose, onSubmit }: UploadProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = React.useState<FileUpload[]>([]);

  const handleClose = () => {
    const notUploaded = uploads.filter((u) => u.progress < 100);
    if (notUploaded.length > 0) {
      if (confirm("Trwa wysyłanie plików, czy na pewno chcesz zamknąć okno?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  async function handleUpload(fileList: FileList) {
    const files = Array.from(fileList || []);

    if (files.length > 0) {
      for (const file of files) {
        const upload: FileUpload = {
          file,
          progress: 0,
        };

        setUploads((prev) => [...prev, upload]);

        const formData = new FormData();
        const image = new Image();
        image.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          image.onload = () => {
            resolve(null);
          };
        });

        const dimensions = {
          width: image.width,
          height: image.height,
        };

        image.remove();

        const ar = dimensions.width / dimensions.height;
        const delta = ar - 1.25;

        console.log(dimensions, ar, delta);

        let size: AlbumPhotoSize = "NORMAL";

        if (delta > 0.25) {
          size = "WIDE";
        } else if (delta < -0.25) {
          size = "TALL";
        }

        if (dimensions.width > 1920) {
          size = "BIG";
        }

        formData.append("file", file);
        formData.append("size", size);

        fetch(`/api/admin/gallery/${album.id}`, {
          method: "POST",
          body: formData,
        }).then((res) => {
          if (res.ok) {
            upload.progress = 100;
            setUploads((prev) => [...prev]);
            onSubmit();
            setTimeout(() => {
              setUploads((prev) => prev.filter((u) => u.file !== file));
            }, 5000);
          } else {
            setUploads((prev) => prev.filter((u) => u.file !== file));
          }
        });
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const calculateFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return (
    <div
      className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-30 backdrop-blur-lg flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white px-6 py-6 rounded-3xl w-[500px] shadow-2xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="relative flex items-center justify-center">
          <h2 className="text-2xl text-center flex gap-2 items-center justify-center font-semibold">
            <CloudUploadRounded />
            Dodaj zdjęcia
          </h2>
          <button
            className="absolute right-0 hover:rotate-90 rotate-0 transition-all text-gray-600 hover:text-black"
            onClick={handleClose}
          >
            <CloseRounded />
          </button>
        </div>
        <div className="mt-8">
          <motion.label
            htmlFor="images"
            className={`bg-gray-200 flex items-center justify-center rounded-lg w-full py-16 cursor-pointer data-[is-hovered]:bg-gray-300 transition-all border-dashed border-2 border-gray-400 data-[is-hovered]:border-gray-500`}
            {...(isHovered && { "data-is-hovered": true })}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHovered(false);
              const files = e.dataTransfer.files;
              if (files) {
                handleUpload(files);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHovered(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            <div className="flex items-center justify-center flex-col gap-2">
              <h3 className="text-xl font-semibold">
                Przeciągnij zdjęcia lub kliknij w obszar
              </h3>
              <p className="font-light text-sm text-gray-600">
                <span className="font-normal">Obsługiwane formaty:</span> JPG,
                JPEG, PNG, GIF, WEBP, SVG
              </p>
              <p className="font-light text-sm text-gray-600 text-center px-6 mt-2">
                Zdjęcia zostaną od razu dodane do albumu po przeciągnięciu lub
                wybraniu
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              name="images"
              id="images"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;

                if (files) {
                  handleUpload(files);
                }
              }}
              ref={inputRef}
            />
          </motion.label>
          {uploads.length > 0 && (
            <div className="mt-4">
              <hr />
              <div className="mt-4 flex flex-col gap-4 max-h-[400px] overflow-y-scroll scrollbar-none px-2 py-2">
                {uploads.map((upload) => (
                  <div
                    key={upload.file.name}
                    className="flex flex-col gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-arround"
                  >
                    <div className="flex gap-4 items-stretch overflow-hidden min-h-24">
                      <div className="w-1/4 flex items-center">
                        <img
                          className="block w-full h-fit rounded-lg object-contain"
                          src={URL.createObjectURL(upload.file)}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col justify-center relative flex-1">
                        <h4 className="text-lg font-semibold whitespace-nowrap text-ellipsis">
                          {upload.file.name}
                        </h4>
                        <p className="text-sm text-gray-600 font-light whitespace-nowrap text-ellipsis">
                          {calculateFileSize(upload.file.size)}
                        </p>
                        <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden absolute bottom-2">
                          <div
                            className="bg-gray-600 w-2 data-[uploaded]:w-full h-full rounded-sm transition-all"
                            {...(upload.progress === 100 && {
                              "data-uploaded": true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
