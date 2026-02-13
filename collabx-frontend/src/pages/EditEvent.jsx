import React, { useState, useEffect } from "react";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Event");
  const [category, setCategory] = useState("Technical");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [amount, setAmount] = useState("");
  const [venue, setVenue] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const canEdit = currentUser && (
    currentUser.roles.includes("ROLE_COLLEGE") || 
    currentUser.roles.includes("ROLE_ADMIN") ||
    currentUser.roles.includes("ROLE_ESP_PRESIDENT") || 
    currentUser.roles.includes("ROLE_ESP_VICE_PRESIDENT")
  );

  useEffect(() => {
    if (!canEdit) {
      navigate("/college");
      return;
    }
    EventService.getEventById(id).then(
      (response) => {
        const event = response.data;
        setTitle(event.title);
        setDescription(event.description);
        setType(event.type);
        setCategory(event.category);
        setStartDate(event.startDate);
        setEndDate(event.endDate);
        setRegistrationDate(event.registrationDate);
        setAmount(event.amount);
        setVenue(event.venue);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    );
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("You must be logged in to update an event.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("registrationDate", registrationDate);
    formData.append("amount", amount);
    formData.append("venue", venue);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);

    EventService.updateEvent(id, formData).then(
      () => {
        alert("Event updated successfully!");
        navigate(`/event/${id}`);
      },
      (error) => {
        alert("Error updating event: " + (error.response?.data?.message || error.message));
      }
    );
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="bg-light d-flex flex-column overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center p-3 overflow-auto">
        <div className="row g-4 w-100 justify-content-center" style={{ maxWidth: "1200px" }}>
          {/* Left Side: Standalone Image Column */}
          <div className="col-lg-5 d-none d-lg-block text-center" style={{ marginTop: "100px" }}>
            <img 
              src="/events.png" 
              alt="Event" 
              className="img-fluid" 
              style={{ maxHeight: "450px", objectFit: "contain" }} 
            />
          </div>

          {/* Right Side: Form Card */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-4 px-lg-5 h-100">
              <div className="mb-3">
                <h3 className="fw-bold mb-0" style={{ color: "var(--text-main)", fontSize: "1.4rem" }}>Edit Opportunity</h3>
                <p className="text-muted small mb-0">Update the details of your event on <strong className="text-dark">Collab</strong><strong className="text-primary">X</strong></p>
              </div>
              
              <form onSubmit={handleUpdate}>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Event Title</label>
                    <input type="text" className="form-control form-control-sm rounded-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Tech Symposium" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Type</label>
                    <select className="form-select form-select-sm rounded-3" value={type} onChange={(e) => setType(e.target.value)}>
                      <option>Event</option>
                      <option>Workshop</option>
                      <option>Hackathon</option>
                      <option>Job Mela</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Category</label>
                    <select className="form-select form-select-sm rounded-3" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>Technical</option>
                      <option>Academic</option>
                      <option>Cultural</option>
                      <option>Career</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Start Date</label>
                    <input type="datetime-local" className="form-control form-control-sm rounded-3" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>End Date</label>
                    <input type="datetime-local" className="form-control form-control-sm rounded-3" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Registration Date</label>
                    <input type="datetime-local" className="form-control form-control-sm rounded-3" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} required />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Amount</label>
                    <input type="number" className="form-control form-control-sm rounded-3" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Registration fee" required />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Venue</label>
                    <input type="text" className="form-control form-control-sm rounded-3" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Campus location or online link" required />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Description</label>
                    <textarea className="form-control form-control-sm rounded-3" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide detailed information..." required></textarea>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Photo 1 (4:3 ratio) vertical</label>
                    <input type="file" className="form-control form-control-sm rounded-3" onChange={(e) => setImage1(e.target.files[0])} accept="image/*" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-1" style={{ fontSize: "0.6rem" }}>Photo 2 (16:9 ratio)</label>
                    <input type="file" className="form-control form-control-sm rounded-3" onChange={(e) => setImage2(e.target.files[0])} accept="image/*" />
                  </div>
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-register w-100 py-2 fw-bold shadow-sm">
                    Update Opportunity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
