import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.oluwasetemi.dev",
  headers: {
    "Content-Type": "application/json",
  },
});
