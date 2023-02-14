import axios from "axios";

const BASE_URL = process.env.API_URL || "http://localhost:5000";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// This is another instance of Axios because for some reason Google API didn't cooperate with withCredentials:true
export const AxiosYT = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
