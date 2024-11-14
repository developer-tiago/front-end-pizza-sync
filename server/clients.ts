import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/clients?page=${page}`);
  },

  store(data: any) {
    return axios.post("/api/clients", data);
  },

  delete(id: string) {
    return axios.delete(`/api/clients/${id}`);
  },
  
  seachClient(filter: string) {
    return axios.get(`/api/clients/search?filter=${filter}`);
  }
}
