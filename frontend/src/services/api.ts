import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001", // Vérifie l'URL de ton backend
});
