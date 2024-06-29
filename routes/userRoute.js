import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { verifyToken } from "../utils/verify.js";
import { Quiz, User } from "../models/userModel.js";
dotenv.config();


const router = express.Router();


router.post("/get-dishes", async (req, res) => {
  try {
    const texts = req.body.text;
    const user = req.body.userr;
    const frequency = req.body.frequency;
    console.log(req.body);

    console.log(response.text());
    res.send(response.text());
  } catch (e) {
    console.error(e);
    res.status(500).send("Error processing PDF");
  }
});



router.put("/update-details", verifyToken, async (req, res, next) => {
  const user = req.user;
  const data = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: data.name || "",
        gender: data.gender || "",
        weight: data.weight || 0,
        height: data.height || 0,
        dietPreference: data.dietPreference || "",
        allergies: data.allergies || [],
        diseases: data.diseases || [],
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/get-user", verifyToken, async (req, res, next) => {
  const userid = req.user.id;
  console.log(userid);
  try {
    const user = await User.findById(userid);
    const {
      name,
      gender,
      weight,
      height,
      dietPreference,
      allergies,
      diseases,
    } = user;

    const response = {
      name,
      gender,
      weight,
      height,
      dietPreference,
      allergies,
      diseases,
    };

    console.log(response);
    res.json(response);
  } catch (e) {
    next(e);
  }
});

export default router;
