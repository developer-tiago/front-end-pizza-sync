import axios from "."

export default {
  index() {
    return axios.get("/api/countries");
  },
};

