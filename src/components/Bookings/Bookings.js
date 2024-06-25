import { Typography, Box, FormLabel, TextField, Button, Grid } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";

const Booking = () => {
    const [movie, setMovie] = useState(null);
    const [inputs, setInputs] = useState({ seatNumber: "", bookingDate: "" });
    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        getMovieDetails(id)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.log(err));
        console.log("Component mounted or id changed", id);
    }, [id]);

    console.log(movie);

    // Function to correct the posterUrl path
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

        try {
            const res = await newBooking({ ...inputs, movie: movie._id });
            console.log("Booking successful:", res);
        } catch (err) {
            console.error("Error during booking:", err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            {movie && (
                <Fragment>
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
                            padding={3}
                            width="50%"
                            marginRight="auto"
                        >
                            <img
                                width="80%"
                                src={correctPosterUrl(movie.posterUrl)}
                                alt={movie.title}
                                style={{ marginBottom: "20px" }}
                            />
                            <Box padding={2} width="80%" marginTop={3}>
                                <Typography paddingTop={1}>{movie.description}</Typography>
                                <Typography paddingTop={3} fontWeight="bold">
                                    Starrer: {movie.actors.join(", ")}
                                </Typography>
                                <Typography paddingTop={2} fontWeight="bold">
                                    Release Date: {new Date(movie.releaseDate).toDateString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            padding={3}
                            width="50%"
                            marginLeft="auto"
                        >
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3} direction="column">
                                    <Grid item>
                                        <FormLabel>Seat Number</FormLabel>
                                        <TextField
                                            name="seatNumber"
                                            type="number"
                                            margin="normal"
                                            variant="standard"
                                            fullWidth
                                            value={inputs.seatNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormLabel>Booking Date</FormLabel>
                                        <TextField
                                            name="bookingDate"
                                            type="date"
                                            margin="normal"
                                            variant="standard"
                                            fullWidth
                                            value={inputs.bookingDate}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
                                            Book Now
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Box>
                </Fragment>
            )}
        </div>
    );
};

export default Booking;
