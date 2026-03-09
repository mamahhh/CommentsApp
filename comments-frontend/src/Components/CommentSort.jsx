import { useRef, useState, useEffect } from "react";
import { Button } from "@douyinfe/semi-ui";
export const CommentSort = ({ params, handleSetParams }) => {
  const useSortRef = useRef(null);
  const [displaySortOptions, setDisplaySortOptions] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (useSortRef.current && !useSortRef.current.contains(e.target)) {
        setDisplaySortOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [useSortRef]);

  return (
    <div className="flex flex-col gap-1 relative">
      <Button
        theme="light"
        type="tertiary"
        className="self-start"
        style={{ padding: 0, backgroundColor: "transparent" }}
        onClick={() => setDisplaySortOptions(true)}
      >
        Sort by
        <p></p>
      </Button>
      {displaySortOptions && (
        <div
          ref={useSortRef}
          className="flex flex-col absolute top-8 bg-white p-1.5 rounded-xs shadow-xl/30 inset-shadow-xs/10"
        >
          <div
            className={`${params.sortBy === "latest" ? "bg-gray-200 font-bold" : ""} cursor-pointer hover:bg-gray-200`}
            onClick={() => {
              handleSetParams({ sortBy: "latest" });
              setDisplaySortOptions(false);
            }}
          >
            <p className="text-[14px]">Latest</p>
          </div>
          <div
            className={`${params.sortBy === "oldest" ? "bg-gray-200 font-bold" : ""} cursor-pointer hover:bg-gray-200`}
            onClick={() => {
              handleSetParams({ sortBy: "oldest" });
              setDisplaySortOptions(false);
            }}
          >
            <p className="text-[14px]">Oldest</p>
          </div>
          <div
            className={`${params.sortBy === "smallestId" ? "bg-gray-200 font-bold" : ""} cursor-pointer hover:bg-gray-200`}
            onClick={() => {
              handleSetParams({ sortBy: "smallestId" });
              setDisplaySortOptions(false);
            }}
          >
            <p className="text-[14px]">Smallest Id</p>
          </div>
          <div
            className={`${params.sortBy === "biggestId" ? "bg-gray-200 font-bold" : ""} cursor-pointer hover:bg-gray-200`}
            onClick={() => {
              handleSetParams({ sortBy: "biggestId" });
              setDisplaySortOptions(false);
            }}
          >
            <p className="text-[14px]">Biggest Id</p>
          </div>
        </div>
      )}
    </div>
  );
};
