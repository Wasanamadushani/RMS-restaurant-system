import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  allowedRoles,
  children,
  loginPath = "/login",
  unauthorizedPath = "/",
}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return children;
}

export default ProtectedRoute;