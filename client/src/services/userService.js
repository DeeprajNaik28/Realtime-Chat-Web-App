import axios from "axios";

const API_URL = "https://realtime-chat-web-app-ui2m.onrender.com/api/users";


export const getUsers = async () => {

  const response = await axios.get(API_URL);

  return response.data;

};