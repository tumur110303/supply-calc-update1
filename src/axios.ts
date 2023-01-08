import defaultAxios from "axios";

const axios = defaultAxios.create({
  baseURL: "http://13.250.116.121:8000/api",
  withCredentials: true,
});

export default axios;
