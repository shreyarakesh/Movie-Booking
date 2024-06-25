import express from 'express';

const movieRouter = express.Router();

import { 
    addMovie,
    getAllMovies,
    getMovieById
} from '../controllers/movie-controller.js';


movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);


export default movieRouter;