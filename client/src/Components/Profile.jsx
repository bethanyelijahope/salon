import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../constants";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to fetch profile.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/api/users/profile/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });
      if (response.ok) {
        setMessage("Email updated successfully.");
        fetchProfile();
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to update email.");
      }
    } catch (error) {
      setMessage("An error occurred while updating email.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/api/users/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (response.ok) {
        setMessage("Password updated successfully.");
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to update password.");
      }
    } catch (error) {
      setMessage("An error occurred while updating password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div> Loading...</div>;
  }

  if (!user) {
    return <div>{message || ""}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <h3>Change Email</h3>
      <div className="mb-3">
        <label htmlFor="newEmail" className="form-label">
          New Email
        </label>
        <input
          type="email"
          className="form-control"
          id="newEmail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleChangeEmail}>
          Update Email
        </button>
      </div>
      <h3>Change Password</h3>
      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">
          New Password
        </label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleChangePassword}>
          Update Password
        </button>
      </div>
      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
