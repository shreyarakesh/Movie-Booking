import express from 'express';

const bookingRouter = express.Router();

import { 
    newBooking,
    getAllBoking,
    getBookingById,
    deleteBooking

    
} from '../controllers/booking-controller.js';



bookingRouter.post("/", newBooking);
bookingRouter.get("/", getAllBoking);
bookingRouter.get("/:id", getBookingById);
bookingRouter.delete("/:id", deleteBooking);

export default bookingRouter;