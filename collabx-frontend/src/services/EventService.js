import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/events` : "http://localhost:8080/api/events";

const getAllEvents = () => {
  return axios.get(API_URL);
};

const getEventById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createEvent = (formData) => {
  return axios.post(API_URL, formData);
};

const getEventsByCollege = (collegeId) => {
  return axios.get(`${API_URL}/college/${collegeId}`);
};

const updateEvent = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData);
};

const EventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  getEventsByCollege
};

export default EventService;
