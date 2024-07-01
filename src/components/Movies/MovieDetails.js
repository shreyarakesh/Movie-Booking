import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from "../../api-helpers/api-helpers";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { ChakraProvider, Image, VStack, StackDivider } from '@chakra-ui/react';

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

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [posterError, setPosterError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieDetails(id);
        console.log(movieData);
        setMovie(movieData.movie);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        // Handle error state if needed
      }
    };

    fetchMovie();
  }, [id]);

  const handleImageError = (event) => {
    event.target.src = '/poster/default.jpg'; // Fallback image if the poster image is not found
  };

  const handleBookClick = () => {
    const userId = localStorage.getItem("userId");
    const adminId = localStorage.getItem("adminId");

    if (!userId && !adminId) {
      navigate("/auth"); // Redirect to login if userId is not present in localStorage
    } else if (adminId) {
      setOpenDialog(true); // Open dialog for admins
    } else {
      navigate(`/booking/${id}`); // Navigate to booking page if userId is present
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!movie) {
    return <div>Loading...</div>;
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
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, width: '80%', maxWidth: '600px' }}>
            <VStack spacing={4} divider={<StackDivider borderColor="gray.200" />}>
              <Image 
                boxSize="300px"
                src={`/poster/${movie.posterUrl}`} 
                alt={movie.title}
                marginBottom={-2}
                onError={handleImageError}
              />
              <Typography variant="h6" textAlign="center">
                {movie.title}
              </Typography>
              <Typography variant="body1" textAlign="center">
                {movie.description}
              </Typography>
              <Typography variant="body1" textAlign="center">
                Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
              </Typography>
              {/* Add more details as needed */}
            </VStack>
          </Paper>
          <Button 
            onClick={handleBookClick} 
            sx={{ marginTop: 3 }} 
            size="large" 
            variant="contained" 
            color="primary"
          >
            Book
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Admin Action</DialogTitle>
            <DialogContent>
              <Typography>
                Admins cannot book tickets. Please login as a user to book a ticket.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default MovieDetails;
