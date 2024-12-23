const Service = require("../models/service");

const createService = async (req, res) => {
  const { name, description, type, price, duration } = req.body;

  try {
    const newService = new Service({
      name,
      description,
      type,
      price,
      duration,
    });

    await newService.save();
    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    res.status(200).json({
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, type, price, duration } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, type, price, duration },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service deleted successfully",
      service: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
