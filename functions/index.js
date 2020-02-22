const functions = require("firebase-functions");
const firebase = require("firebase");
const express = require("express");

const { FBAuth } = require("./util/fbAuth");
const firebaseConfig = require("./util/config");
const { db } = require("./util/admin");

const { signup1, signup2, login } = require("./handlers/users");
const {
  getDailyWorkoutInfo,
  getDailyNutritionInfo,
  addWorkout,
  getWorkout,
  getPastWorkouts,
  updateWorkout,
  deleteWorkout,
  addNutrition,
  getNutrition,
  getPastNutrition,
  updateNutrition,
  deleteNutrition,
  addGoal,
  getGoal,
  getPastGoals,
  updateGoal,
  deleteGoal
} = require("./handlers/data");

firebase.initializeApp(firebaseConfig);

let app = express();

// User routes
app.post("/signup/1", signup1);
app.post("/signup/2", FBAuth, signup2);
app.post("/login", login);

// Custom data routes
app.get("/workouts/daily-info", FBAuth, getDailyWorkoutInfo);
app.get("/nutrition/daily-info", FBAuth, getDailyNutritionInfo);

// Workout routes
app.post("/workouts", FBAuth, addWorkout);
app.get("/workouts/:docId", FBAuth, getWorkout);
app.get("/workouts/all/:limit", FBAuth, getPastWorkouts);
app.get("/workouts/all/:limit/:asc", FBAuth, getPastWorkouts);
app.put("/workouts/:docId", FBAuth, updateWorkout);
app.delete("/workouts/:docId", FBAuth, deleteWorkout);

// Nutrition routes
app.post("/nutrition", FBAuth, addNutrition);
app.get("/nutrition/:docId", FBAuth, getNutrition);
app.get("/nutrition/all/:limit", FBAuth, getPastNutrition);
app.get("/nutrition/all/:limit/:asc", FBAuth, getPastNutrition);
app.put("/nutrition/:docId", FBAuth, updateNutrition);
app.delete("/nutrition/:docId", FBAuth, deleteNutrition);

// Goal routes
app.post("/goal", FBAuth, addGoal);
app.get("/goal/:docId", FBAuth, getGoal);
app.get("/goal/all/:limit", FBAuth, getPastGoals);
app.get("/goal/all/:limit/:asc", FBAuth, getPastGoals);
app.put("/goal/:docId", FBAuth, updateGoal);
app.delete("/goal/:docId", FBAuth, deleteGoal);

exports.api = functions.region("us-east4").https.onRequest(app);
