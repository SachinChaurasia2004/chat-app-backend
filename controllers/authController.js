import {User} from "../models/user.js";
import { generateToken } from "../utils/tokenHelper.js";

export const register = async(req, res, next) => {
  try {
    const {username, email, password} = req.body

    const userExists = await User.findOne({ email });
    if(userExists) return res.status(400).json({ message: "User already exists" });
    
    const user = await User.create({ username, email, password});
    res.status(201).json({
        success: true,
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
    })
  } catch (e) {
    next(e);
  }
};

export const login = async(req, res, next) => {
   try {
    const {email, password } = req.body

    const user = await User.findOne({ email});
    if(user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password"
      });
    }

   } catch (e) {
    next(e);
   }
};

export const getUser = async(req, res, next) => {
  try {

    const user = await User.findById(req.user.id).select("-password");
    if(!user) return res.status(404).json({ message: "User not found"});

    res.json({
      success: true,
      id: user._id,
      username: user.username,
      email: user.email,
    });

  } catch (e) {
    next(e);
  }
};