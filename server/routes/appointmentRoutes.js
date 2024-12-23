const express = require("express");
const router = express.Router();
const appointmentRoutes = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

router.post("/", authMiddleware, appointmentRoutes.createAppointment);
router.get("/", authMiddleware, appointmentRoutes.getUserAppointment);
router.get(
  "/all",
  authMiddleware,
  isAdmin,
  appointmentRoutes.getAllAppointments
);

router.post(
  "/:appointmentId/cancel",
  authMiddleware,
  appointmentRoutes.cancelAppointmentByUser
);

router.post(
  "/:appointmentId/cancel/admin",
  authMiddleware,
  isAdmin,
  appointmentRoutes.cancelAppointmentByAdmin
);

router.post(
  "/:appointmentId/approve/admin",
  authMiddleware,
  isAdmin,
  appointmentRoutes.approveAppointmentByAdmin
);

router.post(
  "/:appointmentId/complete/admin",
  authMiddleware,
  isAdmin,
  appointmentRoutes.completeAppointmentByAdmin
);

module.exports = router;
