import mongoose from 'mongoose'
import { string } from 'zod'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    name: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: ''
    },
    weight: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    dietPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
        default: ''
    },
    allergies: {
        type: [String],
        default: []
    },
    diseases: {
        type: [String],
        default: []
    }
});

const questionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true }, // Array of strings for options
    answer: { type: String, required: true }
  });
  
  const quizSchema = new mongoose.Schema({
    title: { type: String },
    userId: { type: String },
    question: [questionSchema],
    score: { type: [Number], required: true }
  });

export const User = mongoose.model('User' , userSchema)
export const Quiz = mongoose.model('Quiz' , quizSchema)
