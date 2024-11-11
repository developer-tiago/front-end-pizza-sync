import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/categories?page=${page}`);
  },

  index() {
    return axios.get("/api/categories/all");
  },

  store(data: any) {
    return axios.post("/api/categories", data);
  },

  delete(id: string) {
    return axios.delete(`/api/categories/${id}`);
  },
};
