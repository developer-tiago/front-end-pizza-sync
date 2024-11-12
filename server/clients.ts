import axios from ".";

export default {
  paginate(page: number) {
    return axios.get(`/api/clients?page=${page}`);
  },
  
  seachClient(filter: string) {
    return axios.get(`/api/clients/search?filter=${filter}`);
  }
}
