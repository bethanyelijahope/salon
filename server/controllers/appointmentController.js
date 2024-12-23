const Appointment = require("../models/appointment");
const Service = require("../models/service");

const createAppointment = async (req, res) => {
  const { serviceId, name, phone, appointmentTime } = req.body;

  if (!serviceId || !name || !phone || !appointmentTime) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    const existingAppointment = await Appointment.findOne({
      serviceId,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked for the selected service.",
      });
    }

    const newAppointment = new Appointment({
      serviceId,
      name,
      phone,
      appointmentTime,
      user: req.userId,
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      message: "Error booking appointment.",
      error: error.message,
    });
  }
};

const getUserAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).populate(
      "serviceId"
    );

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("serviceId")
      .populate("user");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const cancelAppointmentByUser = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "This appointment is already cancelled." });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not authorized to cancel this appointment.",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment canceled successfully." });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return res.status(500).json({
      message: "An error occurred while canceling the appointment.",
      error: error.message,
    });
  }
};

const cancelAppointmentByAdmin = async (req, res) => {
  const { appointmentId } = req.params;
  const { role } = req;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "This appointment is already cancelled." });
    }

    if (role === "admin") {
      await appointment.deleteOne();
      return res
        .status(200)
        .json({ message: "Appointment deleted successfully by admin." });
    }

    return res.status(403).json({
      message: "Only admins are allowed to delete appointments.",
    });
  } catch (error) {
    console.error("Error canceling or deleting appointment:", error);
    return res.status(500).json({
      message: "An error occurred while canceling or deleting the appointment.",
      error: error.message,
    });
  }
};

const approveAppointmentByAdmin = async (req, res) => {
  const { appointmentId } = req.params;
  const { role } = req.user;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status === "Approved") {
      return res
        .status(400)
        .json({ message: "This appointment is already approved." });
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can approve appointments." });
    }

    appointment.status = "Approved";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment approved successfully by admin." });
  } catch (error) {
    console.error("Error approving appointment:", error);
    return res.status(500).json({
      message: "An error occurred while approving the appointment.",
      error: error.message,
    });
  }
};

const completeAppointmentByAdmin = async (req, res) => {
  const { appointmentId } = req.params;
  const { role } = req.user;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status === "Completed") {
      return res
        .status(400)
        .json({ message: "This appointment is already approved." });
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can approve appointments." });
    }

    appointment.status = "Completed";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment approved successfully by admin." });
  } catch (error) {
    console.error("Error approving appointment:", error);
    return res.status(500).json({
      message: "An error occurred while approving the appointment.",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getUserAppointment,
  getAllAppointments,
  cancelAppointmentByUser,
  cancelAppointmentByAdmin,
  approveAppointmentByAdmin,
  completeAppointmentByAdmin,
};
