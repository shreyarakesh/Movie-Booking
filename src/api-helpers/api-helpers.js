import axios from "axios";

// Function to get all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get('/movie');

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
    console.log(`Fetched movie details for ID ${id}:`, resData); // Add logging here
    return resData;
  } catch (err) {
    console.error(`Error fetching movie details for id ${id}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};
 
// Function to handle new booking
export const newBooking = async (data) => {
  try {
    console.log("Data received for new booking:", data); // Add logging to inspect data received

    // Check if the seat is already booked for the selected movie, showDate, and showTime
    const existingBooking = await getExistingBooking(data.movie, data.showDate, data.showTime, data.seatNumber);

    if (existingBooking) {
      throw new Error('This seat is already booked for the selected date and show time.');
    }else{

        const res = await axios.post("/booking", {
        movie: data.movie,
        seatNumber: data.seatNumber,
        date: data.bookingDate,
        user: localStorage.getItem("userId"),
        showDate: new Date(data.showDate), // Ensure showDate is passed as a Date object
        showTime: data.showTime // Ensure showTime is provided in the expected format
      });
  
      if (res.status !== 201) {
        throw new Error("Unexpected error occurred");
      }
  
      const resData = res.data;
      return resData;
    }

    // If no existing booking, proceed with creating new booking
   
  } catch (err) {
    console.error("Error during booking:", err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};


// Function to get all booking details by userId
export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  try {
    const res = await axios.get(`/user/bookings/${id}`);

    if (res.status !== 200) {
      throw new Error("Unexpected error occurred");
    }

    const resData = res.data;
    return resData;
  } catch (err) {
    console.error(`Error fetching booking details for id ${id}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to get user details by user ID
export const getUserDetails = async (userId) => {
  try {
    const res = await axios.get(`/user/${userId}`);

    if (res.status !== 200) {
      throw new Error("Failed to fetch user details");
    }

    return res.data;
  } catch (err) {
    console.error(`Error fetching user details for id ${userId}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};

// Function to delete a booking by ID
export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);

    if (res.status !== 200) {
      throw new Error("Failed to delete booking");
    }

    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
    throw err;
  }
};

// Example implementation of getBookings in api-helpers
export const getBookings = async (movieId, bookingDate, seatNumber) => {
  try {
    const res = await axios.get('/user/bookings', {
      params: {
        movieId,
        bookingDate,
        seatNumber,
      },
    });
    return res.data.bookings;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Function to check if a booking already exists for the given parameters
const getExistingBooking = async (movieId, showDate, showTime, seatNumber) => {
  try {
    const res = await axios.get('/booking', {
      params: {
        movieId,
        showDate,
        showTime,
        seatNumber
      },
    });

    if (res.status !== 200) {
      throw new Error("Failed to fetch existing booking");
    }

    return res.data.booking; // Assuming the API returns the existing booking if found
  } catch (err) {
    console.error("Error checking existing booking:", err);
    throw err;
  }
};

// Function to add a new movie
export const addMovie = async (movieData) => {
  try {
    const res = await axios.post("/movie", {
      title: movieData.title,
      description: movieData.description,
      actors: movieData.actors,
      releaseDate: movieData.releaseDate,
      posterUrl: movieData.posterUrl,
      featured: movieData.featured,
      admin: localStorage.getItem("adminid")
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.status !== 201) {
      throw new Error("Failed to add movie");
    }

    return res.data;
  } catch (err) {
    console.error("Error adding movie:", err);
    throw err;
  }
};

// Function to get user details by admin

export const getAdminDetails = async () => {
  const adminId = localStorage.getItem("adminId");
  try {
    const res = await axios.get(`/admin/${adminId}`);

    if (res.status !== 200) {
      throw new Error("Failed to fetch admin details");
    }

    return res.data;
  } catch (err) {
    console.error(`Error fetching admin details for id ${adminId}:`, err);
    throw err; // Re-throw the error to propagate it to the caller
  }
};
