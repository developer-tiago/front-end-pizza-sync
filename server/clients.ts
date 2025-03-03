import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/clients?page=${page}`);
  },

  findById(id: string) {
    return axios.get(`/api/clients/${id}`);
  },

  store(data: any) {
    return axios.post("/api/clients", data);
  },

  update(id:string, data: any) {
    return axios.put(`/api/clients/${id}`, data);
  },

  delete(id: string) {
    return axios.delete(`/api/clients/${id}`);
  },
  
  seachClient(filter: string) {
    return axios.get(`/api/clients/search?filter=${filter}`);
  }
}
