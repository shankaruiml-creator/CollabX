import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/registrations";

const registerForEvent = (registrationData) => {
  return axios.post(API_URL, registrationData, { headers: authHeader() });
};

const getStudentRegistrations = (studentId) => {
  return axios.get(`${API_URL}/student/${studentId}`, { headers: authHeader() });
};

const getRegistrationDetails = (studentId, eventId) => {
  return axios.get(`${API_URL}/check?studentId=${studentId}&eventId=${eventId}`, { headers: authHeader() });
};

const getEventRegistrations = (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`, { headers: authHeader() });
};

const RegistrationService = {
  registerForEvent,
  getStudentRegistrations,
  getRegistrationDetails,
  getEventRegistrations
};

export default RegistrationService;
