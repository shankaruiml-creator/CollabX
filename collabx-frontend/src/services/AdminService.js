import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/admin` : "http://localhost:8080/api/admin";

const getStats = () => {
  return axios.get(API_URL + "/stats");
};

const getPendingColleges = () => {
  return axios.get(API_URL + "/pending-colleges");
};

const verifyCollege = (id) => {
  return axios.put(API_URL + `/colleges/${id}/verify`, {});
};

const rejectCollege = (id) => {
  return axios.delete(API_URL + `/colleges/${id}/reject`);
};

const AdminService = {
  getStats,
  getPendingColleges,
  verifyCollege,
  rejectCollege,
};

export default AdminService;
