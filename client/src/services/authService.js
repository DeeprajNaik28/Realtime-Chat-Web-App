import axios from "axios";

const API_URL = "https://realtime-chat-web-app-ui2m.onrender.com/api/auth";


// SIGNUP
export const signupUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    userData
  );

  return response.data;
};


// LOGIN
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};