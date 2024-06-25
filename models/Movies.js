import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    actors: {
        type: [ {type: String, required: true } ]
    },
    releaseDate: {
        type: Date,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: "Bookings",
    }],
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "Ädmin",
        required: true
    }
  });


  const Movies = mongoose.model('Movies', movieSchema);
  
  export default Movies;