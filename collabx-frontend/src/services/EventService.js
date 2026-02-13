import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/events";

const getAllEvents = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getEventById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const createEvent = (formData) => {
  return axios.post(API_URL, formData, { 
    headers: {
      ...authHeader()
    } 
  });
};

const getEventsByCollege = (collegeId) => {
  return axios.get(`${API_URL}/college/${collegeId}`, { headers: authHeader() });
};

const updateEvent = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, { 
    headers: {
      ...authHeader()
    } 
  });
};

const EventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  getEventsByCollege
};

export default EventService;
