import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/seatings?page=${page}`);
  },

  store(data: any) {
    return axios.post("/api/seatings", data);
  },

  delete(id: string) {
    return axios.delete(`/api/seatings/${id}`);
  },
}
