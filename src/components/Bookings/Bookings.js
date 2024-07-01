import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import {
  Typography,
  Box,
  FormLabel,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChakraProvider, Image, VStack, StackDivider } from "@chakra-ui/react";
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  spacing: 4,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: 'auto',
  maxWidth: 800,
  textAlign: 'center',
}));

const StyledImage = styled('img')(({ theme }) => ({
  margin: theme.spacing(3),
  width: '100%',
  borderRadius: '10px',
}));

const StyledForm = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: '10px',
  boxShadow: theme.shadows[3],
}));

const Booking = () => {
  const [movie, setMovie] = useState(null);
  const [inputs, setInputs] = useState({
    seatNumber: "",
    bookingDate: new Date().toISOString().split("T")[0],
    showTime: "",
    showDate: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
    console.log("Component mounted or id changed", id);
  }, [id]);

  console.log(movie);

  const correctPosterUrl = (url) => {
    if (url.startsWith("./")) {
      return url.replace("./", "../");
    }
    return url;
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().getHours();
    const showDate1 = inputs.showDate;
    const releaseDate = new Date(movie.releaseDate).toISOString().split('T')[0];
    const formattedShowDate = new Date(showDate1).toISOString().split('T')[0];
    let bookAllowed = true;

    if(formattedShowDate < releaseDate){
      setDialogMessage("Booking not allowed before movie release date.");
        bookAllowed = false;
        setOpenDialog(true);
        return;
    }

    if (formattedShowDate < currentDate) {
      setDialogMessage("Show date cannot be in the past.");
      setOpenDialog(true);
      return;
    }

    if (formattedShowDate === currentDate) {
      if (currentTime < 9 && ["Morning", "Noon", "Matinee", "Evening", "Night"].includes(inputs.showTime)) {
        setDialogMessage("Your booking was successful. Do you want to book more tickets?");
        bookAllowed = true;
      } else if (currentTime > 9 && currentTime < 12 && ["Morning"].includes(inputs.showTime)) {
        setDialogMessage("Booking allowed only for Noon, Matinee, Evening and Night shows.");
        bookAllowed = false;
      } else if (currentTime > 12 && currentTime < 15 && ["Morning", "Noon"].includes(inputs.showTime)) {
        setDialogMessage("Booking allowed only for Matinee, Evening and Night shows.");
        bookAllowed = false;
      } else if (currentTime > 15 && currentTime < 18 && ["Morning", "Noon", "Matinee"].includes(inputs.showTime)) {
        setDialogMessage("Booking allowed only for Evening and Night shows.");
        bookAllowed = false;
      } else if (currentTime > 18 && currentTime < 21 && ["Morning", "Noon", "Matinee", "Evening"].includes(inputs.showTime)) {
        setDialogMessage("Booking allowed only for Night shows.");
        bookAllowed = false;
      } else if (currentTime >= 21) {
        setDialogMessage("Booking allowed only for next show date.");
        bookAllowed = false;
      }
    }

    try {
      if(bookAllowed){
        const res = await newBooking({ ...inputs, movie: movie._id });
        console.log("Booking successful:", res);
        setDialogMessage("Your booking was successful. Do you want to book more tickets?");
        setOpenDialog(true);
      }else{
        setOpenDialog(true);
        return;
      }
    } catch (err) {
      if (err.response && err.response.data.message === 'Duplicate booking entry for the same seat, show date, and show time for this movie') {
        setDialogMessage("Duplicate booking entry. This seat is already booked for the selected show date and time.");
      } else {
        setDialogMessage("An error occurred during booking. Please try again.");
      }
      setOpenDialog(true);
      console.error("Error during booking:", err.response ? err.response.data : err.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleModifyBooking = () => {
    setOpenDialog(false);
  };

  const handleRedirectHome = () => {
    setOpenDialog(false);
    navigate('/'); // Redirect to home page
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {movie && (
          <Fragment>
            <StyledPaper>
            
              <Typography
                padding={3}
                fontFamily="fantasy"
                variant="h4"
                textAlign="center"
              >
                Book Tickets for Movie: {movie.title}
              </Typography>
              <Box display="flex" justifyContent="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width="50%"
                >
                  <StyledImage
                    src={`/poster/${movie.posterUrl}`}
                    alt={movie.title}
                  />
                  <Box padding={2} width="80%" textAlign="left">
                    <Typography paddingTop={1}>{movie.description}</Typography>
                    <Typography paddingTop={3} fontWeight="bold">
                      Starrer: {movie.actors.join(", ")}
                    </Typography>
                    <Typography paddingTop={2} fontWeight="bold">
                      Release Date: {new Date(movie.releaseDate).toDateString()}
                    </Typography>
                  </Box>
                </Box>
                <StyledForm>
                  <form onSubmit={handleSubmit}>
                  <Grid item>
                  <Image 
                  boxSize="300px" 
                  src="../logo/mvbooking_transparent.png" 
                  mr={4} 
                  alt="MyLogo" />
                  </Grid>
                 


                    <Grid container spacing={3} direction="column">
                    
                      <Grid item>
                        <FormLabel>Booking Date</FormLabel>
                        <TextField
                          name="bookingDate"
                          type="date"
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          value={inputs.bookingDate}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <FormLabel>Seat Number</FormLabel>
                        <TextField
                          name="seatNumber"
                          type="number"
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          value={inputs.seatNumber}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item>
                        <FormLabel>Show Date</FormLabel>
                        <TextField
                          name="showDate"
                          type="date"
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          value={inputs.showDate}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item>
                        <FormControl fullWidth margin="normal" variant="outlined">
                          <InputLabel id="show-time-label">Show Time</InputLabel>
                          <Select
                            labelId="show-time-label"
                            name="showTime"
                            value={inputs.showTime}
                            onChange={handleChange}
                            label="Show Time"
                          >
                            <MenuItem value="Morning">Morning - 9:00 AM</MenuItem>
                            <MenuItem value="Noon">Noon - 12:00 PM</MenuItem>
                            <MenuItem value="Matinee">Matinee - 3:00 PM</MenuItem>
                            <MenuItem value="Evening">Evening - 6:00 PM</MenuItem>
                            <MenuItem value="Night">Night - 9:00 PM</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                          sx={{ mt: 3 }}
                        >
                          Book Now
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  
                </StyledForm>
                
              </Box>
            </StyledPaper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>{dialogMessage.includes('successful') ? "Booking Successful" : "Booking Error"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {dialogMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {dialogMessage.includes('successful') && (
                  <Button onClick={handleModifyBooking} color="primary">
                    Book More
                  </Button>
                )}
                <Button onClick={handleRedirectHome} color="primary" autoFocus>
                  Go to Home
                </Button>
                {!dialogMessage.includes('successful') && (
                  <Button onClick={handleModifyBooking} color="primary">
                    Modify Booking
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </Fragment>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Booking;
