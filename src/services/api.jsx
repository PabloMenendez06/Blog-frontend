import axios from "axios";

const API_URL = "http://localhost:3001/blog/v1";

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/category`);
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const getPublications = async () => {
  const res = await axios.get(`${API_URL}/publication`);
  return res.data.publications || res.data.posts || [];
};

export const getPublicationsByCategory = async (categoryName) => {
  const res = await axios.get(`${API_URL}/publication/${categoryName}`);
  return res.data.publications || [];
};

export const addComment = async (publicationId, commentData) => {
  await axios.post(`${API_URL}/publication/addcomment/${publicationId}`, commentData);
};

export const updateComment = async (commentId, updatedData) => {
  return await axios.put(`http://localhost:3001/blog/v1/comment/${commentId}`, updatedData);
};
