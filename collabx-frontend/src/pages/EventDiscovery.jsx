import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventService from "../services/EventService";

const EventDiscovery = ({ searchQuery = "" }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(query) ||
      event.category?.toLowerCase().includes(query) ||
      event.type?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    EventService.getAllEvents().then(
      (response) => {
        setEvents(response.data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Discover Opportunities</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="row">
          {filteredEvents.length === 0 ? (
            <p className="text-center">No events found.</p>
          ) : (
            filteredEvents.map((event) => (
              <div className="col-md-4 mb-4" key={event.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <span className="badge bg-info mb-2">{event.type}</span>
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text text-muted small">
                      {event.college?.collegeName} | {event.venue}
                    </p>
                    <p className="card-text">
                      {event.description.substring(0, 100)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/event/${event.id}`} className="btn btn-primary btn-sm">Details</Link>
                      <button className="btn btn-outline-success btn-sm">Register</button>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent text-muted small">
                    Date: {new Date(event.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;
