import { useState } from "react";
import { FilesUploadBtn } from "./FilesUploadBtn";
import { TextArea } from "@douyinfe/semi-ui";

export const CommentEdit = ({
  handleEditSubmit,
  handleEditCancel,
  handleEditTextChange,
  editText,
  files,
  handleSetFiles,
}) => {
  const [error, setError] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!editText.trim()) {
          setError("Comment can't be empty.");
          return;
        }

        handleEditSubmit();
      }}
      className="flex flex-col"
    >
      <TextArea
        className="border-2"
        style={{ fontSize: 20 }}
        value={editText}
        onChange={(v, e) => {
          setError(false);
          handleEditTextChange(v, e);
        }}
      />
      {error && <p className="text-[14px] text-red-500">{error}</p>}
      <div className="self-end flex">
        <button type="submit">Confirm</button>
        <FilesUploadBtn files={files} handleSetFiles={handleSetFiles} />
        <button type="button" onClick={handleEditCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
