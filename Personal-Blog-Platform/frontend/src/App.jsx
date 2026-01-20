import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import PostList from "./pages/PostList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-pink-200 to-emerald-200">
          <Routes>
            <Route
              path="/login"
              element={
                !user ? (
                  <Login setUser={setUser} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route path="/posts" element={<PostList />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/posts" />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
