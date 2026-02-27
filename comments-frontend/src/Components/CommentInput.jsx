import { FilesUploadBtn } from "./FilesUploadBtn";
import { useAddComment } from "../hooks/useComments";
import { useState } from "react";
import { TextArea } from "@douyinfe/semi-ui";

export const CommentInput = ({ handleInputOpen }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const [newUploadedImgs, setNewUploadedImgs] = useState([]);
  const { mutate: createComment, isPending } = useAddComment();

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Comment can't be empty.");
      return;
    }
    createComment(
      {
        text: text,
        medias: { image_paths: newUploadedImgs.map((f) => f.path) },
      },
      {
        onSuccess: () => {
          console.log("Comment added!");
        },
      },
    );
    setText("");
    setNewUploadedImgs([]);
    handleInputOpen(false);
  };
  return (
    <>
      <div>
        <form onSubmit={handleCreateComment} className="flex flex-col">
          <TextArea
            name="text"
            className="border-1 flex-1"
            style={{ fontSize: 20 }}
            value={text}
            onChange={(v, e) => {
              setText(e.target.value);
              setError(false);
            }}
          />
          {error && <p className="text-[14px] text-red-500">{error}</p>}
          <div className="self-end flex gap-1">
            <button type="submit" disabled={isPending} className="text-sm">
              Comment
            </button>
            <FilesUploadBtn
              files={newUploadedImgs}
              handleSetFiles={setNewUploadedImgs}
            />
            <button type="button" onClick={() => handleInputOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
