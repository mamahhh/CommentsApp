import { CommentsList } from "./CommentsList";
import { useState } from "react";
import { CommentInput } from "./CommentInput";
import { Divider } from "@douyinfe/semi-ui";

export const Comments = () => {
  //
  const [isCommentIputOpen, setIsCommentInputOpen] = useState(false);
  return (
    <>
      <p className="italic font-bold my-0.5">@Admin</p>
      {!isCommentIputOpen && (
        <button
          type="button"
          onClick={() => setIsCommentInputOpen(true)}
          className="text-sm self-start"
          style={{ padding: "0 5px" }}
        >
          Add a comment
        </button>
      )}
      
      {isCommentIputOpen && (
        <CommentInput handleInputOpen={setIsCommentInputOpen} />
      )}
      <Divider margin="12px" />
      <CommentsList />
    </>
  );
};
