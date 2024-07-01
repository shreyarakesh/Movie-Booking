import express from 'express';

import { 
            getAllUsers,
            signup,
            updateUser,
            deleteUser,
            login,
            getBookingsOfUser,
            getUserDetails

} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.get("/bookings/:id", getBookingsOfUser);
userRouter.get('/:id', getUserDetails);


export default userRouter;
