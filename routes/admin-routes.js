import express from 'express';

const adminRouter = express.Router();

import { 
    addAdmin,
    adminLogin,
    getAllAdmins
    

} from '../controllers/admin-controller.js';

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAllAdmins);

export default adminRouter;