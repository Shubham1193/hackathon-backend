import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import mongoose from "mongoose";

dotenv.config();


mongoose
  .connect(
    process.env.MONGO
  ).then(() => {
    console.log("Database connected")
  }).catch((err) => {
    console.log(err)
  })


const app = express();
app.use(cors())


app.use(express.json())

app.use("/api/auth" , authRoutes)
app.use("/api/user", userRoutes)


app.use((err , req , res , next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  res.status(statusCode).json({
      success : false,
      statusCode,
      message
  })
})

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
