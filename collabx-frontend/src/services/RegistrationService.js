import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/registrations` : "http://localhost:8080/api/registrations";

const registerForEvent = (registrationData) => {
  return axios.post(API_URL, registrationData);
};

const getStudentRegistrations = (studentId) => {
  return axios.get(`${API_URL}/student/${studentId}`);
};

const getRegistrationDetails = (studentId, eventId) => {
  return axios.get(`${API_URL}/check?studentId=${studentId}&eventId=${eventId}`);
};

const getEventRegistrations = (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`);
};

const RegistrationService = {
  registerForEvent,
  getStudentRegistrations,
  getRegistrationDetails,
  getEventRegistrations
};

export default RegistrationService;
