import { Box } from "@chakra-ui/react";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers";
import MovieItem from "./MovieItems"; 

const Movies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.log(err));
    }, []);

    return (
        <Box margin={"auto"} marginTop={20}>
            <Typography
                margin={"auto"}
                variant="h4"
                padding={1}
                width="40%"
                bgcolor={"#900c3f"}
                color="white"
                textAlign={"center"}
                borderRadius={2}
            >
                All Movies
            </Typography>
            <Box 
                display={"flex"} 
                width="100%" 
                margin="auto" 
                justifyContent={"center"} 
                flexWrap="wrap"
                padding={5}
            >
                {movies && movies.map((movie, index) => (
                    <MovieItem
                        key={index}
                        id={movie._id} // Ensure 'id' is correctly passed
                        title={movie.title}
                        admin={movie.admin}
                        releaseDate={movie.releaseDate}
                        posterUrl={movie.posterUrl}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Movies;
