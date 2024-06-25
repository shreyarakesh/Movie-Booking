import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    addedMovies: [{
            type: mongoose.Types.ObjectId,
            ref: "Movies"
        
        }
    ]
  });


  const Admin = mongoose.model('Admin', adminSchema);
  
  export default Admin;