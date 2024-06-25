import express from 'express';
import cors from 'cors';
import "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from './routes/user-routes.js'; 
import adminRouter from './routes/admin-routes.js'; 
import movieRouter from './routes/movie-routes.js';  
import bookingRouter from './routes/booking-routes.js'; 


//const userRouter = require('./routes/user-routes')

dotenv.config({path: './config.env'})
const app = express();
const url = process.env.MONGOURI
const port = process.env.PORT || 5005

//const { json } = require('body-parser')

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies or authorization headers to be sent
  }));


app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);

mongoose.connect(url).then(() =>
    app.listen(port, () =>
        console.log("Connected to database and server is running at port " + port + "." )
    )
)
.catch((e) => console.log(e));



 







