import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/environments?page=${page}`);
  },

  index() {
    return axios.get("/api/environments/all");
  },

  store(data: any) {
    return axios.post("/api/environments", data);
  },

  delete(id: string) {
    return axios.delete(`/api/environments/${id}`);
  },
};
