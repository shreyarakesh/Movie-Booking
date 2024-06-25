import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minLenght: 6
    },
    bookings: [{
      type: mongoose.Types.ObjectId,
      ref: "Bookings"
  
  }
]
  });
  
  const User = mongoose.model('User', userSchema);
  
  export default User;