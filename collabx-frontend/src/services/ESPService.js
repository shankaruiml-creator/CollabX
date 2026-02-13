import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/esps";

const addESP = (username, email, password, role, collegeId) => {
  return axios.post(
    API_URL + "/add",
    {
      username,
      email,
      password,
      role: [role],
    },
    {
      headers: authHeader(),
      params: { collegeId },
    }
  );
};

const getESPsByCollege = (collegeId) => {
  return axios.get(API_URL + "/college/" + collegeId, { headers: authHeader() });
};

const ESPService = {
  addESP,
  getESPsByCollege,
};

export default ESPService;
