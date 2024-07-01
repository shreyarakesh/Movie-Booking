import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ChakraProvider, Image, VStack, StackDivider } from "@chakra-ui/react";
import { getUserBooking, getUserDetails, getMovieDetails, deleteBooking } from "../api-helpers/api-helpers";

// Create a MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
});

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [movieTitles, setMovieTitles] = useState({});

  useEffect(() => {
    getUserBooking()
      .then((res) => {
        console.log("Bookings Response:", res);
        setBookings(res.bookings || []);
        if (res.bookings && res.bookings.length > 0) {
          // Fetch user details for the first booking's user
          return getUserDetails(res.bookings[0].user);
        }
      })
      .then((user) => {
        if (user) {
          setUserDetails(user.user);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const fetchMovieTitles = async () => {
        const movieTitlesMap = {};
        for (const booking of bookings) {
          const movieId = booking.movie;
          try {
            const movieResponse = await getMovieDetails(movieId);
            console.log(`Fetched movie details for ID ${movieId}:`, movieResponse); // Log the fetched movie details
            if (movieResponse && movieResponse.movie && movieResponse.movie.title) {
              movieTitlesMap[movieId] = movieResponse.movie.title;
            } else {
              console.error(`No title found for movie ID ${movieId}`);
            }
          } catch (err) {
            console.error(`Error fetching details for movie ID ${movieId}:`, err);
          }
        }
        setMovieTitles(movieTitlesMap);
        console.log("Movie Titles Map:", movieTitlesMap); // Log the movie titles map
      };
      fetchMovieTitles();
    }
  }, [bookings]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={2}
          bgcolor="#f5f5f5"
          minHeight="100vh"
        >
          {bookings.length > 0 && userDetails ? (
            <Fragment>
              <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, width: '80%', maxWidth: '600px' }}>
                <VStack spacing={4} divider={<StackDivider borderColor="gray.200" />}>
                  <Image
                    boxSize="250"
                    src="./logo/movlogo2.png"
                    alt="userLogo"
                    marginBottom={-2}
                  />
                  <Typography variant="h6" textAlign="center">
                    Name: {userDetails.name}
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    Email: {userDetails.email}
                  </Typography>
                </VStack>
              </Paper>
              <Box width="80%" maxWidth="800px">
                <Typography variant="h6" textAlign="center" marginBottom={2}>
                  Booking details for user: {userDetails.name}
                </Typography>
                <Grid container spacing={2}>
                  {bookings.map((booking, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Movie:</strong> {movieTitles[booking.movie] || booking.movie}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Seat Number:</strong> {booking.seatNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Show Date:</strong> {new Date(booking.showDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Show Time:</strong> {booking.showTime}
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          Delete Booking
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fragment>
          ) : (
            <Typography variant="h6" textAlign="center">
              No bookings found or user details not available.
            </Typography>
          )}
        </Box>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default UserProfile;
