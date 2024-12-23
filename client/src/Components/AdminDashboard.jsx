import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../constants";
// import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to view the dashboard.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setRole(decodedToken.role);

      try {
        const response = await fetch(`${url}/api/appointment/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          const error = await response.json();
          setMessage(error.message || "Failed to fetch appointments.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching appointments.");
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${url}/api/appointment/${id}/cancel/admin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === id
              ? { ...appointment, status: "Cancelled" }
              : appointment
          )
        );
        toast.success("Appointment canceled successfully.");
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      setMessage("An error occurred while canceling the appointment.");
    }
  };

  const handleApproveAppointment = async (id) => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${url}/api/appointment/${id}/approve/admin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === id
              ? { ...appointment, status: "Approved" }
              : appointment
          )
        );
        toast.success(
          "Appointment approved successfully. The user has been notified!"
        );
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to approve appointment.");
      }
    } catch (error) {
      setMessage("An error occurred while approving the appointment.");
    }
  };

  const handleDoneAppointment = async (id) => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${url}/api/appointment/${id}/completed/admin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === id
              ? { ...appointment, status: "Completed" }
              : appointment
          )
        );
        toast.success("Appointment marked as done.");
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to mark appointment as done.");
      }
    } catch (error) {
      setMessage("An error occurred while marking the appointment as done.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User</th>
              <th>Service</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment._id}</td>
                <td>{appointment.user?.name || "Unknown User"}</td>
                <td>{appointment.serviceId?.name || "Unknown Service"}</td>
                <td>
                  {appointment.appointmentTime
                    ? new Date(appointment.appointmentTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>{appointment.status || "Pending"}</td>
                <td>
                  {}
                  {role === "admin" && (
                    <>
                      {}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={
                          appointment.status === "Cancelled" ||
                          appointment.status === "Completed"
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-success ml-2"
                        onClick={() =>
                          handleApproveAppointment(appointment._id)
                        }
                        disabled={
                          appointment.status === "Cancelled" ||
                          appointment.status === "Approved" ||
                          appointment.status === "Completed"
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-primary ml-2"
                        onClick={() => handleDoneAppointment(appointment._id)}
                        disabled={
                          appointment.status === "Cancelled" ||
                          appointment.status === "Completed"
                        }
                      >
                        Done
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {}
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
