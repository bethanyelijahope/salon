import React, { useState, useEffect } from "react";
import { url } from "../constants";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You must be logged in to view your appointments.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${url}/api/appointment`, {
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
        setMessage("An error occurred while fetching your appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // const handleViewServiceDetails = (serviceId) => {
  //   navigate(`/services/${serviceId}`);
  // };

  const handleCancelAppointment = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${url}/api/appointment/${id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === id
              ? { ...appointment, status: "Cancelled" }
              : appointment
          )
        );
        setMessage("Appointment canceled successfully.");
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to cancel the appointment.");
      }
    } catch (error) {
      setMessage("An error occurred while canceling the appointment.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments at the moment.</p>
      ) : (
        <ul className="list-group">
          {appointments.map((appointment) => (
            <li
              key={appointment._id}
              className="list-group-item p-3 mb-3 shadow-sm rounded"
              style={{ border: "1px solid #ddd" }}
            >
              <div>
                {}
                <h5>
                  Service: {appointment.serviceId?.name || "Service not found"}
                </h5>
                <p>
                  <strong>Date of Service:</strong>{" "}
                  {new Date(appointment.appointmentTime).toLocaleString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
                <p>
                  <strong>Price:</strong> ${appointment.serviceId.price}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status || "Pending"}
                </p>
                <div>
                  {}
                  {appointment.status !== "Approved" &&
                    appointment.status !== "Cancelled" &&
                    appointment.status !== "Completed" && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointment;
