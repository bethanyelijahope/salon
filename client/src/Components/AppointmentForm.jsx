import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../constants";

const AppointmentForm = () => {
  const { id } = useParams();
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to book an appointment.");
      setIsLoading(false);
      return;
    }

    const appointmentTime = new Date(`${serviceDate}T${serviceTime}:00`);

    try {
      const response = await fetch(`${url}/api/appointment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: id,
          name,
          phone,
          appointmentTime,
        }),
      });

      setIsLoading(false);
      if (response.ok) {
        setMessage("Appointment created successfully!");
        setServiceDate("");
        setServiceTime("");
        setName("");

        setPhone("");
      } else {
        const error = await response.json();
        setMessage(error.message || "Error creating appointment.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating appointment:", error);
      setMessage("An error occurred while creating the appointment.");
    }
  };

  return (
    <div className="container">
      <h1>Appointment Form</h1>
      <form onSubmit={handleSubmit}>
        {}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label htmlFor="serviceDate" className="form-label">
            Service Date
          </label>
          <input
            type="date"
            className="form-control"
            id="serviceDate"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label htmlFor="serviceTime" className="form-label">
            Service Time
          </label>
          <input
            type="time"
            className="form-control"
            id="serviceTime"
            value={serviceTime}
            onChange={(e) => setServiceTime(e.target.value)}
            required
          />
        </div>

        {}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Reserving..." : "Reserve"} {}
        </button>
      </form>

      {}
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
