import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
  getLikes,
  toggleLike,
  uploadImages,
} from "../api/comments.api";

export const useGetComments = (params) =>
  useQuery({
    queryKey: ["comments", params],
    queryFn: () => getComments(params),
    staleTime: 1000 * 60, // 1 min
  });

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => editComment(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

export const useGetLikes = () => {
  return useQuery({
    queryKey: ["likes"],
    queryFn: getLikes,
  });
};

export const useToggleLikes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: (form) => uploadImages(form),
  });
};
