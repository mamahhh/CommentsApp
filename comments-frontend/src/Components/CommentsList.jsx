import { useMemo } from "react";
import { CommentItem } from "./CommentItem";
import { useGetComments, useGetLikes } from "../hooks/useComments";
export const CommentsList = () => {
  const { data: commentsData } = useGetComments();
  const { data: likedComments } = useGetLikes();
  const likedCommentsSet = useMemo(() => {
    if (!likedComments) return new Set();
    return new Set(likedComments.map((c) => c.comment));
  }, [likedComments]);
  console.log(likedCommentsSet);
  return (
    <div className="flex flex-col gap-0.5">
      {commentsData?.map((comment) => {
        const liked = likedCommentsSet.has(comment.id);
        return (
          <div key={comment.id}>
            <CommentItem item={comment} liked={liked} />
          </div>
        );
      })}
    </div>
  );
};
