import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

import Bookings from '../models/Bookings.js';
import Movie from '../models/Movies.js';
import Users from '../models/User.js';

import mongoose from 'mongoose';

dotenv.config({path: './config.env'});

export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user, showDate, showTime } = req.body;

    let existingMovie;
    let existingUser;

    try {
        existingMovie = await Movie.findById(movie);
        existingUser = await Users.findById(user);
    } catch (err) {
        return console.log(err);
    }
    if (!existingMovie) { 
        return res.status(404).json({ message: "Unable to find movie with this id" });
    }

    if (!existingUser) { 
        return res.status(404).json({ message: "Unable to find user with this id" });
    }

    let newBooking;

    try {
        const parsedDate = Date.parse(date);
        if (isNaN(parsedDate)) {
            return res.status(422).json({ message: 'Invalid date format for date' });
        }

        const parsedShowDate = new Date(showDate);
        if (isNaN(parsedShowDate.getTime())) {
            return res.status(422).json({ message: 'Invalid date format for showDate' });
        }

        // Format the showDate to YYYY-MM-DD
        const formattedShowDate = parsedShowDate.toISOString().split('T')[0];

        // Check for duplicate booking
        const existingBooking = await Bookings.findOne({
            movie,
            seatNumber,
            showDate: new Date(formattedShowDate),
            showTime
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Duplicate booking entry for the same seat, show date, and show time for this movie' });
        }

        newBooking = new Bookings({ 
            movie, 
            date: new Date(parsedDate), 
            seatNumber,
            user,
            showDate: new Date(formattedShowDate), 
            showTime
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(newBooking);
        existingMovie.bookings.push(newBooking);

        await existingUser.save({ session });
        await existingMovie.save({ session });
        await newBooking.save({ session });

        await session.commitTransaction();
    } catch (err) {
        if (err.code === 11000 && err.keyPattern) {
            // Handle duplicate key error (E11000)
            return res.status(400).json({ message: 'Duplicate booking entry' });
        } else {
            console.error('Error creating booking:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    if (!newBooking) { 
        return res.status(500).json({ message: "Unable to create booking" });
    }
    return res.status(201).json({ Booking: newBooking });
};


export const getAllBoking = async (req, res, next) => {

    let bookings;

    try{
        bookings = await Bookings.find();
    } catch ( err ){
        return console.log(err);
    }

    if(!bookings){
        return res.status(500).json({ message: "No movie add till now."});
    }
    return res.status(200).json({ bookings });
};
 


export const getBookingById = async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    let booking;

    try{
        booking = await Bookings.findById(id);
    } catch ( err ){
        return console.log(err);
    }

    if(!booking){
        return res.status(404).json({ message: "No movie foung for this id."});
    }
    return res.status(200).json({ booking }); 
};


export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;

    try{
        booking = await Bookings.findByIdAndDelete(id).populate("user movie");

        if (!booking) {
            return res.status(404).json({ message: "No booking found for this id." });
        }

        console.log(booking);

        const session = await mongoose.startSession();
        session.startTransaction();

        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);

        await booking.user.save({ session });
        await booking.movie.save({session });

        await session.commitTransaction();


    } catch ( err ){
        return console.log(err);
    }

    if(!Bookings){
        return res.status(404).json({ message: "Unable to delete"});
    }
    return res.status(200).json({ booking }); 
};





    
