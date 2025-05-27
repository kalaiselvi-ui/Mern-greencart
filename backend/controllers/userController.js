import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Required Fields are Missing",
      });
    }
    const excistingUser = await User.findOne({ email });

    if (excistingUser) {
      return res.json({ success: false, message: "The user already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      cartItems: {},
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true, //prevent js to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //   CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });
    await user.save();

    return res.json({
      success: true,
      message: "The user successfully created",
      token,
      user: { email: user.email, name: user.name, cartItems: user.cartItems },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

//login user : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { email: user.email },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

//check auth :/api/user/isAuth
export const isAuth = async (req, res) => {
  try {
    // const { userId } = req.userId;
    console.log(req.userId, "userId");
    console.log(typeof req.userId); // "string"

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

//logout user : /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};
