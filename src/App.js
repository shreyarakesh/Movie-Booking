import React, { useEffect } from "react";
import Header from "./components/Header";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies/Movies";

import Admin from "./components/Admin/Admin";
import Auth from "./components/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "./store";
import Booking from "./components/Bookings/Bookings";


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
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/booking/:id" element={<Booking />} />
          
          
         
        </Routes>
      </section>
    </div>
  );
}

export default App;
