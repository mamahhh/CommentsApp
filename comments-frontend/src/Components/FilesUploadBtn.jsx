import { useRef, useState } from "react";
import { useUploadImages } from "../hooks/useComments";

export const FilesUploadBtn = ({ files, handleSetFiles }) => {
  const inputRef = useRef(null);
  const { mutate: upload, isPending } = useUploadImages();
  const [uploadedFilesCnt, setUploadedFilesCnt] = useState(0);
  return (
    <>
      <input
        id="img-upload"
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={(e) => {
          console.log("e.target.files:", e.target.files);
          if (!e.target.files) return;

          const form = new FormData();
          Array.from(e.target.files).forEach((f) => {
            form.append("files", f);
          });

          upload(form, {
            onSuccess: (data) => {
              const { files } = data;
              handleSetFiles((prev) => [...prev, ...files]);
              setUploadedFilesCnt(files.length);
            },
          });
        }}
      />
      <div className="flex">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          Upload images
        </button>
        {uploadedFilesCnt > 0 && (
          <p className="self-center text-sm">
            {uploadedFilesCnt} files uploaded!
          </p>
        )}
      </div>
    </>
  );
};
