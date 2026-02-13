import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/esps` : "http://localhost:8080/api/esps";

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
      params: { collegeId },
    }
  );
};

const getESPsByCollege = (collegeId) => {
  return axios.get(API_URL + "/college/" + collegeId);
};

const ESPService = {
  addESP,
  getESPsByCollege,
};

export default ESPService;
