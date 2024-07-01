import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
});

// Compound index to ensure uniqueness of combination of movie, showDate, showTime, seatNumber
bookingSchema.index({ movie: 1, showDate: 1, showTime: 1, seatNumber: 1 }, { unique: true });

const Booking = mongoose.model('movbookings', bookingSchema);

export default Booking;
