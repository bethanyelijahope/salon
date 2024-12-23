import { Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import ServiceList from "./Components/ServiceList";
import Login from "./Components/Login";
import AppointmentForm from "./Components/AppointmentForm";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import Appointment from "./Components/Appointment";
import Dashboard from "./Components/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/register"
        element={
          <>
            <Register />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Login />
          </>
        }
      />

      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />

      <Route
        path="/service"
        element={
          <>
            <Navbar />
            <ServiceList />
          </>
        }
      />

      <Route
        path="/appointment"
        element={
          <>
            <Appointment />
          </>
        }
      />

      <Route
        path="/appointment/:id"
        element={
          <>
            <AppointmentForm />
          </>
        }
      />

      <Route
        path="/profile"
        element={
          <>
            <Navbar />
            <Profile />
          </>
        }
      />

      <Route
        path="/dashboard"
        element={
          <>
            <Dashboard />
          </>
        }
      />
    </Routes>
  );
}

export default App;
