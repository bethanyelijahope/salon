const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Cancelled", "Approved", "Completed"],
    default: "Pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
