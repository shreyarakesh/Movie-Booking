import axios from "axios";

// Function to get all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get(`/movie`);

    if (res.status !== 200) {
      throw new Error("Failed to fetch movies");
    }

    const data = res.data;
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to handle user authentication (signup/login)
export const sendUserAuthRequest = async (data, isSignup) => {
  try {
    const res = await axios.post(`/user/${isSignup ? "signup" : "login"}`, {
      name: isSignup ? data.name : "",
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Unexpected error occurred");
    }

    const resData = res.data;
    return resData;
  } catch (err) {
    console.error(`Error during ${isSignup ? "signup" : "login"}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to handle admin authentication (login only)
export const sendAdminAuthRequest = async (data) => {
  try {
    const res = await axios.post(`/admin/login`, {
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Unexpected error occurred");
    }

    const resData = res.data;
    return resData;
  } catch (err) {
    console.error("Error during admin login:", err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to get movie details by id
export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`/movie/${id}`);

    if (res.status !== 200) {
      throw new Error("Unexpected error occurred");
    }

    const resData = res.data;
    return resData;
  } catch (err) {
    console.error(`Error fetching movie details for id ${id}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to handle new booking
export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      date: data.bookingDate,
      user: localStorage.getItem("userId"),
    });

    if (res.status !== 201) {
      throw new Error("Unexpected error occurred");
    }

    const resData = res.data;
    return resData;
  } catch (err) {
    console.error("Error during booking:", err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};
