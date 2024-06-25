import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config({path: './config.env'});


export const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    let existingAdmin;

    try{
        existingAdmin = await Admin.findOne({email});

    }catch(err){
        return console.log(err);
    }

    if(existingAdmin){
        return res.status(400).json({ message : "Admin already exist" });
    }

    let admin;
    const hashPassword = bcrypt.hashSync(password);

    try{

        admin = new Admin({ email, password: hashPassword });
        admin = await admin.save();

    }catch(err){
        return console.log(err);
    }

    if(!admin){ 
        return res.status(500).json({ message: "Unable to store admin"});
    }
    return res.status(201).json({ admin });
};

//adminLogin
export const adminLogin = async (req, res, next) => {
   
    const { email, password } = req.body;

    if(!email &&
        email.trim() === "" &&
        !password &&
        password.trim() === ""
    ){
        return res.status(422).json({message: "Invalid Inputs"})
    }
  
    let existingAdmin;

    try{
        existingAdmin = await Admin.findOne({email});

    }catch(err){
        return console.log(err);
    }

    if(!existingAdmin){
        return res.status(400).json({ message : "Unable to find Admin from this ID" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);

    if(!isPasswordCorrect){
        return res.status(400).json({ message : "Incorrect AdminPassword" });
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, 
        { expiresIn: "7d" });


    return res.status(200).json({ 
        message : "Admin Login Successfully " , token, id:existingAdmin._id}); 
};

export const getAllAdmins = async(req,res,next) => {
    let admins;
    try{
        admins = await Admin.find();
    }catch(err){
        return console.log(err);
    }
    if(!admins){
        return res.status(500).json({ message: "Unexpected Error Occured"});
    }

    return res.status(200).json({ admins });
};

