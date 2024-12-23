import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../constants";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${url}/api/service/getAllServices`);
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>{error}</p>;

  const groupServicesByType = (services) => {
    return services.reduce((grouped, service) => {
      const { type } = service;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(service);
      return grouped;
    }, {});
  };

  const groupedServices = groupServicesByType(services);

  const handleBookNowClick = (serviceId) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(`/appointment/${serviceId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <h1>Available Services</h1>

      {}
      {Object.keys(groupedServices).map((type) => (
        <div key={type} className="service-type-group">
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="row">
            {groupedServices[type].map((service) => (
              <div key={service._id} className="col-12 col-md-6 col-lg-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">{service.name}</h5>
                    <p className="card-text">{service.description}</p>
                    <p className="card-text">
                      <strong>Price: ${service.price}</strong>
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBookNowClick(service._id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
