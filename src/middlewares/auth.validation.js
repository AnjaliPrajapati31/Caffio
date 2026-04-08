import User from "../models/user.model.js";


export const isValidEmail = (email) => typeof email === "string" && email.includes("@");

export const validateSignup = async (req, res, next) => {
    try {
        const { name, email, password, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        if(role=='admin' || role=='staff' ){
            return res.status(400).json({ message: "Invalid role" });
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const validateLogin = async (req, res, next) => {
    try {
        const { email, password} = req.body;

        if (!email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        next();
    } catch (error) {
        next(error);
    }

};


