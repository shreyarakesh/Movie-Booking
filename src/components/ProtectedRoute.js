// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ condition, children }) => {
  return condition ? children : <Navigate to="/error" />;
};

export default ProtectedRoute;
