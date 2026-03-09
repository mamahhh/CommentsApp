import { formatDateTime } from "../utils/dateConvert";
export const CommentInfo = ({ item }) => {
  return (
    <>
      {/* author & time */}
      <div className="flex gap-1">
        <p className="self-baseline font-bold italic">{`@${item.author}`}</p>
        <p className="self-baseline text-[14px] text-gray-500">
          {formatDateTime(item.update_at)}
        </p>
      </div>
    </>
  );
};
