import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ChakraProvider, Image, VStack, StackDivider } from "@chakra-ui/react";
import { getAdminDetails, getMovieDetails } from "../api-helpers/api-helpers";

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

const AdminProfile = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [movieTitles, setMovieTitles] = useState({});

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        // Fetch admin details
        const adminData = await getAdminDetails();
        setAdminDetails(adminData);

        // Fetch details of each movie added by the admin
        const moviePromises = adminData.addedMovies.map(async (movieId) => {
          try {
            const movieData = await getMovieDetails(movieId);
            return movieData.movie; // Extract the movie object from the response
          } catch (err) {
            console.error(`Error fetching movie details for ID ${movieId}:`, err);
            throw err;
          }
        });

        const moviesData = await Promise.all(moviePromises);
        // Sort movies by release date in descending order
        moviesData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setMovies(moviesData);
      } catch (err) {
        console.error("Error fetching admin profile data:", err);
        setError(err.message);
      }
    };

    fetchAdminProfile();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const fetchMovieTitles = async () => {
        const movieTitlesMap = {};
        for (const movie of movies) {
          const movieId = movie._id;
          try {
            movieTitlesMap[movieId] = movie.title || "Title not available";
          } catch (err) {
            console.error(`Error setting title for movie ID ${movieId}:`, err);
          }
        }
        setMovieTitles(movieTitlesMap);
      };
      fetchMovieTitles();
    }
  }, [movies]);

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          {adminDetails ? (
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, width: '80%', maxWidth: '600px' }}>
              <Typography variant="h6" textAlign="center">
                Email: {adminDetails.email}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="h6" textAlign="center">
              Loading admin profile...
            </Typography>
          )}

          <Box width="80%" maxWidth="800px">
            <Typography variant="h6" textAlign="center" marginBottom={2}>
              Movies Added by Admin
            </Typography>
            <Grid container spacing={2}>
              {movies.map((movie, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={2} sx={{ padding: 2 }}>
                    <Box my={2} display="flex" justifyContent="center">
                      {movie.posterUrl && (
                        <Image
                          src={`/poster/${movie.posterUrl}`} 
                          alt={`Poster for ${movie.title}`}
                          boxSize="250px"
                          objectFit="cover"
                          marginBottom={-2}
                        />
                      )}
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {movie.title || "Title not available"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Description:</strong> {movie.description || "Description not available"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Release Date:</strong>{" "}
                      {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "Release Date not available"}
                    </Typography>
                  </Paper>
                  
                </Grid>
                
              ))}
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default AdminProfile;
