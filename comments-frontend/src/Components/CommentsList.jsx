import { useMemo } from "react";
import { CommentItem } from "./CommentItem";
import { useGetComments, useGetLikes } from "../hooks/useComments";
import { CommentInfo } from "./CommentInfo";
export const CommentsList = ({ param }) => {
  const { data: commentsData } = useGetComments(param);

  const { data: likedComments } = useGetLikes();
  const likedCommentsSet = useMemo(() => {
    if (!likedComments) return new Set();
    return new Set(likedComments.map((c) => c.comment));
  }, [likedComments]);

  return (
    <div className="flex flex-col gap-0.5">
      {commentsData?.map((comment) => {
        const liked = likedCommentsSet.has(comment.id);
        return (
          <div key={comment.id}>
            <CommentInfo item={comment} />
            <div className={`border-l-[1px] border-l-gray-400 pl-[14px]`}>
              <CommentItem item={comment} liked={liked} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
