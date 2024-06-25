import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import MovieItem from "./Movies/MovieItems"; 
import { getAllMovies } from '../api-helpers/api-helpers.js';

const HomePage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.log(err));
    }, []);

    return (
        <Box width={"100%"} height={"100%"} margin="auto" marginTop={1}>
            <Box margin="auto" textAlign="center">
                <Typography variant="h4">Coming Soon...</Typography>
            </Box>
            <Box width={"80%"} height={"40vh"} display="flex" margin="auto" marginTop={2}>
                <Box width="50%" height="100%" display="flex" margin="auto" paddingRight={1} sx={{ borderRadius: 5, overflow: 'hidden' }}>
                    <img
                        src="./poster/love-in-bloom.jpg"
                        alt="Coming Soon"
                        width={"100%"}
                        height={"40vh"}
                    />
                </Box>
                <Box width="50%" height="100%" display="flex" margin="auto" paddingLeft={1} sx={{ borderRadius: 5, overflow: 'hidden' }}>
                    <img
                        src="./poster/ies1.jpg"
                        alt="Coming Soon"
                        width={"100%"}
                        height={"40vh"}
                    />
                </Box>
            </Box>
            <Box padding={5} margin="auto" textAlign="center">
                <Typography variant="h4">Latest Releases</Typography>
            </Box>
            <Box display="flex" width="80%" margin="auto" justifyContent={"center"} flexWrap="wrap">
                {movies && movies.slice(0, 4).map((movie) => (
                    <MovieItem
                        key={movie._id} // Ensure each movie has a unique id
                        id={movie._id}
                        title={movie.title}
                        releaseDate={movie.releaseDate}
                        posterUrl={movie.posterUrl} 
                    />
                ))}
            </Box>
            <Box display="flex" padding={5} margin="auto" justifyContent="center">
                <Button
                    component={Link}
                    to="/movies"
                    variant="outlined"
                    sx={{
                        color: "#ff007a",
                        borderColor: "#f971a3",
                        ':hover': {
                            bg: "#2b2d42",
                            color: "white"
                        }
                    }}
                >
                    View All Movies
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
