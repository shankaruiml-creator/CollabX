import React, { useState, useEffect } from "react";
import { FaUserCheck, FaShieldAlt, FaChartBar, FaUsers, FaUniversity, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSync } from "react-icons/fa";
import AdminService from "../services/AdminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalColleges: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    flaggedContent: 0
  });
  const [pendingColleges, setPendingColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "primary"
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const [statsRes, pendingRes] = await Promise.all([
        AdminService.getStats(),
        AdminService.getPendingColleges()
      ]);
      
      setStats(statsRes.data);
      setPendingColleges(pendingRes.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch dashboard data. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = (id) => {
    setModalConfig({
      title: "Confirm Approval",
      message: "Approve this institution? They will be granted full platform access.",
      type: "success",
      onConfirm: async () => {
        try {
          await AdminService.verifyCollege(id);
          fetchDashboardData(true);
          setShowModal(false);
        } catch (err) {
          alert("Verification failed");
        }
      }
    });
    setShowModal(true);
  };

  const handleReject = (id) => {
    setModalConfig({
      title: "Confirm Rejection",
      message: "Reject this application? The account will be permanently removed.",
      type: "danger",
      onConfirm: async () => {
        try {
          await AdminService.rejectCollege(id);
          fetchDashboardData(true);
          setShowModal(false);
        } catch (err) {
          alert("Rejection failed");
        }
      }
    });
    setShowModal(true);
  };

  const statCards = [
    { label: "Partner Colleges", value: stats.totalColleges, icon: <FaUniversity />, color: "primary" },
    { label: "Active Students", value: stats.activeUsers, icon: <FaUsers />, color: "info" },
    { label: "Approval Queue", value: stats.pendingVerifications, icon: <FaUserCheck />, color: "warning" },
    { label: "Safety Flags", value: stats.flaggedContent, icon: <FaShieldAlt />, color: "danger" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-3">
      <div className="container">
        {error && (
          <div className="alert alert-danger d-flex align-items-center border-0 shadow-sm mb-4">
            <FaExclamationTriangle className="me-2" /> {error}
          </div>
        )}

        <header className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-800 text-dark mb-1">
              Admin <span className="text-primary">Console</span>
            </h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item active small text-muted">Platform Management</li>
                <li className="breadcrumb-item active small text-muted" aria-current="page">Security Overview</li>
              </ol>
            </nav>
          </div>
          <button 
            className={`btn btn-white btn-sm border shadow-sm rounded-pill px-2 py-1 d-flex align-items-center ${refreshing ? 'disabled' : ''}`}
            onClick={() => fetchDashboardData(true)}
            style={{ fontSize: '0.75rem' }}
          >
            <FaSync className={`me-1 ${refreshing ? 'fa-spin' : ''}`} /> 
            {refreshing ? 'Syncing...' : 'Sync Data'}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="col-xl-3 col-md-6">
              <div className={`admin-stat-card border-0 card-variant-${stat.color}`}>
                <div className="d-flex align-items-center">
                  <div className={`stat-icon-wrapper me-3 icon-bg-${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="stat-label mb-0">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-lg-9">
            <section className="admin-main-card border-0 shadow-sm">
              <div className="card-header bg-white py-4 px-4 border-0 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 fw-bold">Institution Verifications</h5>
                  <p className="text-muted small mb-0">Review and authorize pending college registrations</p>
                </div>
                <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill small fw-bold">
                  {pendingColleges.length} Pending
                </span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 admin-table">
                    <thead>
                      <tr>
                        <th className="ps-4">Institution</th>
                        <th>Location</th>
                        <th>Applied On</th>
                        <th>Reg. Number</th>
                        <th>College Code</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingColleges.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            <div className="py-4">
                              <FaCheckCircle className="text-success mb-3" size={40} />
                              <p className="text-muted mb-0">Verification queue is empty</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        pendingColleges.map((college) => (
                          <tr key={college.id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div className="bg-light p-2 rounded me-3 text-primary">
                                  <FaUniversity />
                                </div>
                                <span className="fw-bold">{college.collegeName}</span>
                              </div>
                            </td>
                            <td>
                              <div className="small text-dark">{college.city}</div>
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{college.state}</div>
                            </td>
                            <td className="small text-muted">
                              {formatDate(college.user?.createdAt)}
                            </td>
                            <td>
                              <span className="text-monospace small bg-light px-2 py-1 rounded border">
                                {college.registrationNumber}
                              </span>
                            </td>
                            <td>
                              <span className="text-monospace small bg-info bg-opacity-10 text-info px-2 py-1 rounded border border-info border-opacity-25">
                                {college.collegeCode}
                              </span>
                            </td>
                            <td className="text-end pe-4">
                              <div className="d-flex justify-content-end align-items-center">
                                <button 
                                  className="btn btn-sm btn-success rounded-pill px-3 me-2"
                                  onClick={() => handleApprove(college.id)}
                                  title="Approve Request"
                                >
                                  Approve
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                  onClick={() => handleReject(college.id)}
                                  title="Reject Request"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          <div className="col-lg-3">
            <section className="card admin-side-card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-danger-soft p-3 rounded-circle me-3">
                    <FaShieldAlt className="text-danger" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Safety Center</h6>
                    <small className="text-muted">{stats.flaggedContent} high-priority items</small>
                  </div>
                </div>
                
                <div className="moderation-item p-3 rounded-4 mb-3 bg-light border-0">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-danger text-white rounded-pill px-2">High Risk</span>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>2h ago</span>
                  </div>
                  <h6 className="small fw-bold mb-1">Moderation Required</h6>
                  <p className="small text-muted mb-3">Hackathon description contains restricted keywords.</p>
                  <button className="btn btn-sm btn-dark w-100 rounded-pill py-2">Audit Report</button>
                </div>

                <div className="moderation-item p-3 rounded-4 bg-light border-0">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-warning text-dark rounded-pill px-2">Medium</span>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>5h ago</span>
                  </div>
                  <h6 className="small fw-bold mb-1">Spam Report</h6>
                  <p className="small text-muted mb-3">Multiple reports for "Cultural Fest" metadata.</p>
                  <button className="btn btn-sm btn-outline-dark w-100 rounded-pill py-2">Investigate</button>
                </div>
              </div>
            </section>

            <section className="card admin-side-card border-0 shadow-sm overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <h6 className="fw-bold mb-0">Resource Monitoring</h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted fw-500">System Load</span>
                    <span className="fw-bold text-dark">24%</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: "6px" }}>
                    <div className="progress-bar bg-success rounded-pill" style={{ width: "24%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted fw-500">Storage Capacity</span>
                    <span className="fw-bold text-dark">68%</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: "6px" }}>
                    <div className="progress-bar bg-warning rounded-pill" style={{ width: "68%" }}></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">{modalConfig.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body py-4">
                  <p className="text-muted mb-0">{modalConfig.message}</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button 
                    type="button" 
                    className={`btn btn-${modalConfig.type} rounded-pill px-4`} 
                    onClick={modalConfig.onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
