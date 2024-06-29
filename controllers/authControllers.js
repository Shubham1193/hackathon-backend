import {User} from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import {z} from 'zod'
import { errorHandler } from '../utils/error.js';

const signupSchema = z.object({
    username: z
      .string()
      .trim() // Remove leading/trailing whitespace
      .nonempty({ message: 'Username is required' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  });

  const signinSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  });

export const signup = async (req,res,next) => {
    const validationResult = signupSchema.safeParse(req.body)
    if(!validationResult.success){
        const errors = "Input validation Failed"
        return next(errorHandler(400 ,errors))
    }
    const { username, email, password } = validationResult.data;
    const hashedPassword = bcryptjs.hashSync(password , 10)
    const newUser = new User({
        username , 
        email,
        password : hashedPassword
    })
    try {
        await newUser.save();
        res.json('Signup successful');
      } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const validationResult = signinSchema.safeParse(req.body)
    if(!validationResult.success){
        const errors = "User not Verified"
        next(errorHandler(400 ,errors))
    }
    try {
      const {email , password} = validationResult.data
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, "Invalid password"));
      }
      const token = jwt.sign({ id: validUser._id , isAdmin : validUser.isAdmin }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validUser._doc;
      const response = { ...rest, token };
  
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
  

  export const google = async (req, res, next) => {
    const { username , email , googlePhotoUrl } = req.body;
    console.log(email , username , googlePhotoUrl)
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        // const { password, ...rest } = user._doc;
        const { password, ...rest } = user._doc;
        const response = {token , ...rest}
        res
          .status(200).json(response);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            username.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        const response = {token , ...rest}
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  };