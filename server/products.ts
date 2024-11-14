import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/products?page=${page}`);
  },

  store(data: any) {
    return axios.post("/api/products", data);
  },

  delete(id: string) {
    return axios.delete(`/api/products/${id}`);
  },
};

