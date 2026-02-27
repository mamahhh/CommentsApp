import { IconLikeHeart } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";
import { useState } from "react";

export const CommentBtnBar = ({
  handleToggleLike,
  frontLiked,
  frontLikesCnt,
  handleEditable,
  handleDeleteComment,
}) => {
  const [deleteHover, setDeleteHover] = useState(false);
  return (
    <div className="self-start flex gap-1">
      <Button
        theme="borderless"
        type="tertiary"
        onClick={handleToggleLike}
        className="flex gap-0.5"
        style={{ padding: 0, backgroundColor: "transparent" }}
      >
        <IconLikeHeart
          className={`self-center ${frontLiked ? "text-red-600" : "text-gray-400"} `}
          size="extra-large"
        />
        <p className="self-center">{frontLikesCnt}</p>
      </Button>

      <Button
        theme="borderless"
        type="tertiary"
        style={{ padding: 0, backgroundColor: "transparent" }}
        onClick={handleEditable}
      >
        edit
      </Button>
      <Button
        theme="borderless"
        type={`${deleteHover ? "danger" : "tertiary"}`}
        style={{ padding: 0, backgroundColor: "transparent" }}
        onClick={handleDeleteComment}
        onMouseEnter={() => setDeleteHover(true)}
        onMouseLeave={() => setDeleteHover(false)}
      >
        delete
      </Button>
    </div>
  );
};
