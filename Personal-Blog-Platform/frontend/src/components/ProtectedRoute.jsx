import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { postsAPI } from "../services/api";

export default function ProtectedRoute({ children, user }) {
  const [isValid, setIsValid] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkAuth = async () => {
    if (!user?.token) {
      //jab user hai to checking ki value true ho rahne dena.
      setChecking(false);
      return;
    }

    try {
      // Test the token by making a protected API call
      await postsAPI.getMyPosts();
      setChecking(false);
      setIsValid(true);
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem("token");
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [user]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
