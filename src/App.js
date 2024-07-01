import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "./store";

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies/Movies";
import Admin from "./components/Admin/Admin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Bookings";
import UserProfile from "./profile/UserProfile";
import AddMovie from "./components/Movies/AddMovie";
import AdminProfile from "./profile/AdminProfile";
import MovieDetails from "./components/Movies/MovieDetails";
import ErrorPage from "./components/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Retrieve login states from the Redux store
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  console.log("isAdminLoggedIn", isAdminLoggedIn);
  console.log("isUserLoggedIn", isUserLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(userActions.login());
    } else if (localStorage.getItem("adminId")) {
      dispatch(adminActions.login());
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <section>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          {!isAdminLoggedIn && !isUserLoggedIn && (
            <>
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
            </>
          )}
          <Route
            path="/user"
            element={
              <ProtectedRoute condition={!isAdminLoggedIn && isUserLoggedIn}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute condition={!isAdminLoggedIn && isUserLoggedIn}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute condition={isAdminLoggedIn && !isUserLoggedIn}>
                <AddMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-user"
            element={
              <ProtectedRoute condition={isAdminLoggedIn && !isUserLoggedIn}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/error" element={<ErrorPage />} /> {/* Error page route */}
          <Route path="*" element={<Navigate to="/error" />} /> {/* Catch-all route */}
        </Routes>
      </section>
    </div>
  );
}

export default App;
