import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Create separate axios instance for auth requests to avoid interceptor issues
const authAxios = axios.create();

const sendOtp = (email) => {
  return authAxios.post(API_URL + "/send-otp", { email });
};

const register = (username, email, password, role, collegeData, otp) => {
  const signupData = {
    username,
    email,
    password,
    role: [role],
    otp,
    // Ensure all college fields are present even if null
    collegeName: collegeData.collegeName || null,
    registrationNumber: collegeData.registrationNumber || null,
    collegeCode: collegeData.collegeCode || null,
    address: collegeData.address || null,
    city: collegeData.city || null,
    state: collegeData.state || null,
    website: collegeData.website || null
  };
  
  return authAxios.post(API_URL + "/signup", signupData)
    .then((response) => {
      // If registration returns a JWT token (auto-login), store it
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        cachedUser = response.data;
      }
      return response.data;
    });
};

let cachedUser = null;

const getCurrentUser = () => {
  if (!cachedUser) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      cachedUser = JSON.parse(userStr);
    }
  }
  return cachedUser;
};

const login = (username, password) => {
  return authAxios
    .post(API_URL + "/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        cachedUser = response.data;
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  cachedUser = null;
};

const checkAdminExists = () => {
  return authAxios.get(API_URL + "/check-admin");
};

const AuthService = {
  register,
  sendOtp,
  login,
  logout,
  getCurrentUser,
  checkAdminExists,
};

export default AuthService;
