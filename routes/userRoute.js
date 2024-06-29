import express from 'express'
import   { GoogleGenerativeAI }  from '@google/generative-ai';
import dotenv from 'dotenv'
import { verifyToken } from '../utils/verify.js';
import {Quiz} from '../models/userModel.js'
dotenv.config();
import fixer from 'json-fixer'

const router = express.Router()

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
});

router.post('/generate-Diet', async (req, res) => {

    try {
      const texts = req.body.text
  
      const prompt = `Generate health cusine with calories nutrition breakdown in json format for one day 3 course with this ${texts} keeping in mind in json format. Do not add any additional text or commentary before or after the JSON.`;
      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      
        console.log(response.text())
        res.send(response.text());
      
      
      // console.log(response.text())
      // res.send(response.text());
    } catch (e) {
      console.error(e);
      res.status(500).send('Error processing PDF');
    }
  });

router.post('/submit-mcq' , verifyToken , async (req,res ,next) => {
  const user = req.user
  const data = req.body
  console.log(data)
  const newQuiz = new Quiz(data)
  try {
    await newQuiz.save()
    res.json('Quiz entered successfully')
  }
  catch(e) {
    next(e)
  }
})

router.put("/update-score/:quizId" , verifyToken , async (req,res,next) => {
  // console.log(req.params.quizId)
  const  quizId  = req.params.quizId
  const  {score}  = req.body
 
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId , 
      { $push : {score : score}},
      { new: true }
    )
   
    // console.log(updatedQuiz)
    res.status(200).json(updatedQuiz)
  }catch(e) {
    next(e)
  }
})

router.get("/get-quiz" , verifyToken , async (req, res, next) => {
  const userId = req.user.id
  console.log(userId)
  try {
    const data = await Quiz.find({userId : userId})
    res.json(data)
  }catch(e){
    next(e)
  }
})


router.get("/get-singlequiz/:quizId" , verifyToken , async (req, res, next) => {
  const  quizId  = req.params.quizId
  // console.log(userId)
  try {
    const data = await Quiz.findById(quizId)
    res.json(data)
  }catch(e){
    next(e)
  }
})

export default router