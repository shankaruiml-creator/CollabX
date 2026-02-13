import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin";

const getStats = () => {
  return axios.get(API_URL + "/stats", { headers: authHeader() });
};

const getPendingColleges = () => {
  return axios.get(API_URL + "/pending-colleges", { headers: authHeader() });
};

const verifyCollege = (id) => {
  return axios.put(API_URL + `/colleges/${id}/verify`, {}, { headers: authHeader() });
};

const rejectCollege = (id) => {
  return axios.delete(API_URL + `/colleges/${id}/reject`, { headers: authHeader() });
};

const AdminService = {
  getStats,
  getPendingColleges,
  verifyCollege,
  rejectCollege,
};

export default AdminService;
