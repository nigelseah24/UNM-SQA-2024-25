import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Backend URL

// Fetch videos based on search query
export const fetchVideos = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/get_videos/`, {
    params: { query },
  });
  return response.data.items || response.data;
};

export const getVideoDetails = async (video_id: string) => {
  const response = await axios.get(`${API_BASE_URL}/get_video_data_single/`, {
    params: { video_id },
  });
  return response.data;
};

// Fetch keywords from the database
export const fetchKeywords = async () => {
  const response = await axios.get(`${API_BASE_URL}/keywords/`);
  return response.data;
};

// Add a new keyword to the database
export const addKeyword = async (name: string) => {
  const response = await axios.post(`${API_BASE_URL}/keywords/`, { name });
  return response.data;
};
