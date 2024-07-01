import express from 'express';

const adminRouter = express.Router();

import { 
    addAdmin,
    adminLogin,
    getAllAdmins,
    getAdminById
    

} from '../controllers/admin-controller.js';

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAllAdmins);
adminRouter.get("/:adminId", getAdminById);


export default adminRouter;
