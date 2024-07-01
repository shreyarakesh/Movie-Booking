import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import Movie from '../models/Movies.js';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';

dotenv.config({path: './config.env'});

export const addMovie = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(token, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const { title, description, actors, releaseDate, posterUrl, featured } = req.body;

  if (!title || !description || !posterUrl) {
    return res.status(422).json({ message: 'Invalid Inputs 1' });
  }

  if (title.trim() === '' || description.trim() === '' || posterUrl.trim() === '') {
    return res.status(422).json({ message: 'Invalid Inputs 2' });
  }

  const parsedDate = Date.parse(releaseDate);
  if (isNaN(parsedDate)) {
    return res.status(422).json({ message: 'Invalid date format for releaseDate' });
  }

  let movie;
  try {
    movie = new Movie({ 
      title, 
      description, 
      actors,
      releaseDate: new Date(parsedDate), 
      posterUrl, 
      featured,
      admin: adminId 
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);

    session.startTransaction();

    await movie.save({ session });

    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add movie" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;
  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "No movie add till now." });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "No movie found for this id." });
  }
  return res.status(200).json({ movie });
};
