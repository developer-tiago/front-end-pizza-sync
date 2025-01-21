import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adicionar o `account_id` dinamicamente em cada requisição
api.interceptors.request.use((config) => {
  const accountId = localStorage.getItem("account_id"); // ou Vuex/Pinia
  if (accountId) {
    config.headers["account_id"] = accountId;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
