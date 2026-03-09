import { useState } from "react";
import {
  useDeleteComment,
  useEditComment,
  useToggleLikes,
} from "../hooks/useComments.js";
import { CommentEdit } from "./CommentEdit.jsx";
import { CommentBtnBar } from "./CommentBtnBar.jsx";
import { ImagesGrid } from "./ImagesGrid.jsx";
import { formatDateTime } from "../utils/dateConvert.js";

export const CommentItem = ({ item, liked }) => {
  const [fliked, setFliked] = useState(liked);
  const [flikesCnt, setFlikesCnt] = useState(item.likes_cnt);
  const [editable, setEditable] = useState(false);
  const [displayText, setDisplayText] = useState(item.text);
  const [text, setText] = useState(item.text);

  // images
  const [imageFiles, setImageFiles] = useState(item.related_images ?? []);
  const [newUploadedImgs, setNewUploadedImgs] = useState([]);

  const { mutate: editComment } = useEditComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: toggleLike } = useToggleLikes();

  const handleToggleLike = () => {
    const prev_liked = fliked;
    setFliked((v) => !v);
    if (prev_liked) {
      setFlikesCnt((c) => c - 1);
    } else {
      setFlikesCnt((c) => c + 1);
    }
    toggleLike(item.id, {
      onSuccess: (data) => {
        const { liked: new_liked, likes_cnt: new_likes_cnt } = data;
        setFliked(new_liked);
        setFlikesCnt(new_likes_cnt);
      },
      onError: () => {
        setFliked(prev_liked);
        setFlikesCnt((c) => (prev_liked ? c + 1 : c - 1));
      },
    });
  };
  const handleEditSubmit = () => {
    editComment(
      {
        id: item.id,
        data: {
          text,
          medias: {
            keep_image_ids: imageFiles.map((f) => f.id),
            image_paths: newUploadedImgs.map((f) => f.path),
          },
        },
      },
      {
        onSuccess: (data) => {
          console.log("Comment edited!");
          const { related_images } = data;
          setImageFiles(related_images);
        },
      },
    );
    setDisplayText(text);
    setNewUploadedImgs([]);
    setEditable(false);
  };
  const handleEditCancel = () => {
    setText(item.text);
    setEditable(false);
  };

  const handleDeleteComment = () => {
    deleteComment(item.id, {
      onSuccess: () => {
        console.log("Comment deleted!");
      },
    });
  };

  return (
    <div className="flex flex-col py-2">
      {/* text */}
      {!editable && (
        <p className="leading-tight text-[18px]">
          {displayText ?? "Content has been deleted"}
        </p>
      )}
      {!editable && <ImagesGrid images={imageFiles} />}
      {/* edit box */}
      {editable && (
        <CommentEdit
          handleEditSubmit={handleEditSubmit}
          handleEditTextChange={(v, e) => setText(e.target.value)}
          handleEditCancel={handleEditCancel}
          editText={text}
          files={newUploadedImgs}
          handleSetFiles={setNewUploadedImgs}
        />
      )}
      {/* btns bar */}
      {!editable && (
        <CommentBtnBar
          handleToggleLike={handleToggleLike}
          handleDeleteComment={handleDeleteComment}
          frontLiked={fliked}
          frontLikesCnt={flikesCnt}
          handleEditable={() => setEditable(true)}
        />
      )}
    </div>
  );
};
