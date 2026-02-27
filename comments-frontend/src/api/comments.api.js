import { apiClient } from "./client";

// Comments
// export type GetCommentsParams = {
//   user_id?: string;
//   parent_id?: string;
// };

// export type CommentsData = {
//   id?: string | number;
//   user?: string;
//   author?: string;
//   parent?: string;
//   text?: string;
//   likes_cnt?: number;
//   image_url?: string;
//   medias?: {
//     keep_image_ids?: number[];
//     image_paths?: string[];
//   };
// };

// export type ResponseCommentsData = {
//   id?: string | number;
//   user?: string;
//   author?: string;
//   parent?: string;
//   text?: string;
//   likes_cnt?: number;
//   image_url?: string;
//   related_images?: string[];
// }

export const getComments = (params) => {
  return apiClient.get("/comments/", { params });
};

export const editComment = (id, data) => {
  return apiClient.patch(`/comments/${id}/`, data);
};

export const addComment = (data) => {
  return apiClient.post("/comments/", data);
};

export const deleteComment = (id) => {
  return apiClient.delete(`/comments/${id}/`);
};

// Likes
export const getLikes = () => {
  return apiClient.get("/likes/");
};

export const toggleLike = (id) => {
  return apiClient.post(`/comments/${id}/toggle_likes/`);
};

// upload images
export const uploadImages = (form) => {
  return apiClient.post("/uploads/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
