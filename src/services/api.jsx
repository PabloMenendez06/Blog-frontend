import axios from "axios";

const API_URL = "http://localhost:3001/blog/v1/publication";

export const getPublications = async () => {
  const res = await axios.get(API_URL);
  return res.data.publications || res.data.posts || [];
};
export const addComment = async (publicationId, commentData) => {
  await axios.post(`${API_URL}/addcomment/${publicationId}`, commentData);
};
export const updateComment = async (commentId, updatedData) => {
  return await axios.put(`http://localhost:3001/blog/v1/comment/${commentId}`, updatedData);
};
