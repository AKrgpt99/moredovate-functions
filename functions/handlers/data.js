const { db } = require("../util/admin");

const { getSumFromString, toArray } = require("../util/helpers");
const {
  validateExercises,
  validateNutrition,
  validateGoal
} = require("../util/validators");

const getDailyWorkoutInfo = (req, res) => {
  const workoutData = {
    workoutVolume: [],
    avgRestTime: [],
    avgHeartrate: []
  };

  db.collection("workouts")
    .where("uid", "==", req.user.uid)
    .orderBy("performedAt", "desc")
    .limit(10)
    .get()
    .then(data => {
      data.docs.map(workoutDoc => {
        let workout = workoutDoc.data(),
          workoutPerformedAt = new Date(workout.performedAt),
          today = new Date(),
          unwantedKeys = ["uid", "createdAt", "performedAt"],
          exercises = Object.keys(workout).filter(exercise => {
            if (unwantedKeys.indexOf(exercise) < 0) {
              return exercise;
            }
          }),
          repSum = 0,
          setSum = 0,
          weightSum = 0,
          restSum = 0,
          heartrateSum = 0;

        if (
          workoutPerformedAt.getFullYear() === today.getFullYear() &&
          workoutPerformedAt.getMonth() === today.getMonth() &&
          workoutPerformedAt.getDate() === today.getDate()
        ) {
          exercises.map(exercise => {
            repSum = getSumFromString(workout[exercise].reps);
            setSum = toArray(workout[exercise].reps).length;
            weightSum = getSumFromString(workout[exercise].weight);
            restSum = getSumFromString(workout[exercise].rest);
            heartrateSum = getSumFromString(workout[exercise].heartrate);
            console.log({ repSum, setSum, weightSum, restSum, heartrateSum });

            workoutData.workoutVolume.push(
              Math.round(repSum * setSum * weightSum)
            );
            workoutData.avgRestTime.push(
              Math.round(restSum / toArray(workout[exercise].rest).length)
            );
            workoutData.avgHeartrate.push(
              Math.round(
                heartrateSum / toArray(workout[exercise].heartrate).length
              )
            );
          });

          workoutData.workoutVolume = Math.round(
            workoutData.workoutVolume.reduce((total, currentVolume) => {
              return total + currentVolume;
            })
          );
          workoutData.avgRestTime = Math.round(
            workoutData.avgRestTime.reduce((total, currentRestTime) => {
              return total + currentRestTime;
            }) / workoutData.avgRestTime.length
          );
          workoutData.avgHeartrate = Math.round(
            workoutData.avgHeartrate.reduce((total, currentHeartrate) => {
              return total + currentHeartrate;
            }) / workoutData.avgHeartrate.length
          );
        }
      });

      return res.json(workoutData);
    })
    .catch(err => {
      console.error("Failed fetching docs ", err);
      return res
        .status(400)
        .json({ error: "Could not get daily workout info" });
    });
};

const getDailyNutritionInfo = (req, res) => {
  const nutritionData = {
    caloriesToday: 0,
    proteinToday: 0,
    carbsToday: 0,
    fatToday: 0,
    maxCalories: parseInt(req.user.nutrition.maxCalories),
    minCalories: parseInt(req.user.nutrition.minCalories),
    maxProtein: parseInt(req.user.nutrition.maxProtein),
    minProtein: parseInt(req.user.nutrition.minProtein),
    maxCarbs: parseInt(req.user.nutrition.maxCarbs),
    minCarbs: parseInt(req.user.nutrition.minCarbs),
    maxFat: parseInt(req.user.nutrition.maxFat),
    minfat: parseInt(req.user.nutrition.minFat)
  };

  db.collection("nutrition")
    .where("uid", "==", req.user.uid)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get()
    .then(data => {
      data.docs.map(nutritionDoc => {
        let nutrition = nutritionDoc.data(),
          nutritionRecordedDate = new Date(nutrition.createdAt),
          today = new Date();

        if (
          nutritionRecordedDate.getFullYear() === today.getFullYear() &&
          nutritionRecordedDate.getMonth() === today.getMonth() &&
          nutritionRecordedDate.getDate() === today.getDate()
        ) {
          nutritionData.caloriesToday += parseInt(nutrition.calories);
          nutritionData.proteinToday += parseInt(nutrition.protein);
          nutritionData.carbsToday += parseInt(nutrition.carbs);
          nutritionData.fatToday += parseInt(nutrition.fat);

          return nutrition;
        }
      });

      return res.json(nutritionData);
    })
    .catch(err => {
      console.error("Failed fetching document ", err);
      return res
        .status(400)
        .json({ error: "Could not get daily nutrition info" });
    });
};

const addWorkout = (req, res) => {
  let workoutData = {
      uid: req.user.uid,
      createdAt: new Date().toISOString(),
      performedAt: "n/a"
    },
    { errors, valid } = validateExercises(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(workoutData, req.body);

  db.collection("workouts")
    .add(workoutData)
    .then(data => {
      return res.json({ docId: data.id });
    })
    .catch(err => {
      console.error("Failed adding document ", err);
      return res.status(400).json({ error: "Could not add workout" });
    });
};

const getWorkout = (req, res) => {
  const workoutData = {
    docId: req.params.docId
  };

  db.collection("workouts")
    .doc(workoutData.docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        let { errors, valid } = validateExercises(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        Object.assign(workoutData, doc.data());

        return res.json(workoutData);
      }

      return res
        .status(400)
        .json({ error: "Could not get workout, document does not exist" });
    })
    .catch(err => {
      console.error("Failed loading document ", err);
      return res.status(400).json({ error: "Could not get workout" });
    });
};

const getPastWorkouts = (req, res) => {
  let workouts = [],
    limit = parseInt(req.params.limit),
    isAsc = req.params.asc ? req.params.asc : "desc";

  db.collection("workouts")
    .where("uid", "==", req.user.uid)
    .where("performedAt", "<", "n/a")
    .orderBy("performedAt", isAsc)
    .limit(limit)
    .get()
    .then(data => {
      data.docs.map(doc => {
        let workoutData = {
            docId: doc.id
          },
          { errors, valid } = validateExercises(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        const workoutPerformedAt = new Date(workoutData.performedAt),
          today = new Date();

        if (
          workoutPerformedAt.getFullYear() <= today.getFullYear() &&
          workoutPerformedAt.getMonth() <= today.getMonth() &&
          workoutPerformedAt.getDate() <= today.getDate()
        ) {
          workouts.push(workoutData);
          return workoutData;
        }
      });

      return res.json({ workouts });
    })
    .catch(err => {
      console.error("Failed loading past workouts ", err);
      return res.status(400).json({ error: "Could not get workouts" });
    });
};

const updateWorkout = (req, res) => {
  let workoutData = {
      docId: req.params.docId
    },
    { errors, valid } = validateExercises(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(workoutData, req.body);

  db.collection("workouts")
    .doc(workoutData.docId)
    .update(changesObject)
    .then(() => {
      return res.json({
        message: `Successfully updated document ${workoutData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed updating document ", err);
      return res.status(400).json({ error: "Could not update workout" });
    });
};

const deleteWorkout = (req, res) => {
  const workoutData = {
    docId: req.params.docId
  };

  db.collection("workouts")
    .doc(workoutData.workoutId)
    .delete()
    .then(() => {
      return res.json({
        message: `Successfully deleted document ${workoutData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed deleting document ", err);
      return res.status(400).json({ error: "Could not delete workout" });
    });
};

const addNutrition = (req, res) => {
  let nutritionData = {
      uid: req.user.uid,
      createdAt: new Date().toISOString()
    },
    { errors, valid } = validateNutrition(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(nutritionData, req.body);

  db.collection("nutrition")
    .add(nutritionData)
    .then(doc => {
      return res.json({ docId: doc.id });
    })
    .catch(err => {
      console.error("Failed adding document ", err);
      return res.status(400).json({ error: "Could not add nutrition" });
    });
};

const getNutrition = (req, res) => {
  const nutritionData = {
    docId: req.params.docId
  };

  db.collection("nutrition")
    .doc(nutritionData.docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        let { errors, valid } = validateExercises(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        Object.assign(nutritionData, doc.data());

        return res.json(nutritionData);
      }

      return res
        .status(400)
        .json({ error: "Could not get nutrition, document does not exist" });
    })
    .catch(err => {
      console.error("Failed loading document ", err);
      return res.status(400).json({ error: "Could not get nutrition" });
    });
};

const getPastNutrition = (req, res) => {
  let nutrition = [],
    limit = parseInt(req.params.limit),
    isAsc = req.params.asc ? req.params.asc : "desc";

  db.collection("nutrition")
    .where("uid", "==", req.user.uid)
    .orderBy("createdAt", isAsc)
    .limit(limit)
    .get()
    .then(data => {
      data.docs.map(doc => {
        let nutritionData = {
            docId: doc.id
          },
          { errors, valid } = validateNutrition(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        Object.assign(nutritionData, doc.data());

        const nutritionCreatedAt = new Date(nutritionData.createdAt),
          today = new Date();

        if (
          nutritionCreatedAt.getFullYear() <= today.getFullYear() &&
          nutritionCreatedAt.getMonth() <= today.getMonth() &&
          nutritionCreatedAt.getDate() <= today.getDate()
        ) {
          nutrition.push(nutritionData);
          return nutritionData;
        }
      });

      return res.json({ nutrition });
    })
    .catch(err => {
      console.error("Failed loading documents ", err);
      return res.status(400).json({ error: "Could not get nutrition" });
    });
};

const updateNutrition = (req, res) => {
  let nutritionData = {
      docId: req.params.docId
    },
    { errors, valid } = validateNutrition(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(nutritionData, req.body);

  db.collection("nutrition")
    .doc(nutritionData.docId)
    .update(req.body)
    .then(() => {
      return res.json({
        message: `Successfully updated document ${nutritionData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed updating document ", err);
      return res.status(400).json({ error: "Could not update nutrition" });
    });
};

const deleteNutrition = (req, res) => {
  const nutritionData = {
    docId: req.params.docId
  };

  db.collection("nutrition")
    .doc(nutritionData.docId)
    .delete()
    .then(() => {
      return res.json({
        message: `Successfully deleted document ${nutritionData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed deleting document ", err);
      return res.status(400).json({ error: "Could not delete nutrition" });
    });
};

const addGoal = (req, res) => {
  const goalData = {
      uid: req.user.uid,
      createdAt: new Date().toISOString()
    },
    { errors, valid } = validateGoal(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(goalData, req.body);

  db.collection("goals")
    .add(goalData)
    .then(doc => {
      return res.json({ docId: doc.id });
    })
    .catch(err => {
      console.error("Failed adding document ", err);
      return res.status(400).json({ error: "Could not add goal" });
    });
};

const getGoal = (req, res) => {
  const goalData = {
    docId: req.params.docId
  };

  db.collection("goasls")
    .doc(goalData.docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        let { errors, valid } = validateGoal(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        Object.assign(goalData, doc.data());

        return res.json(goalData);
      }

      return res
        .status(400)
        .json({ error: "Could not get goal, document does not exist" });
    })
    .catch(err => {
      console.error("Failed loading document ", err);
      return res.status(400).json({ error: "Could not get goal" });
    });
};

const getPastGoals = (req, res) => {
  let goals = [],
    limit = parseInt(req.params.limit),
    isAsc = req.params.asc ? req.params.asc : "desc";

  db.collection("goals")
    .where("uid", "==", req.user.uid)
    .orderBy("createdAt", isAsc)
    .limit(limit)
    .get()
    .then(data => {
      data.docs.map(doc => {
        let goalData = {
            docId: doc.id
          },
          { errors, valid } = validateGoal(doc.data());

        if (!valid) {
          return res.status(400).json(errors);
        }

        Object.assign(goalData, doc.data());

        const goalCreatedAt = new Date(goalData.createdAt),
          today = new Date();

        if (
          goalCreatedAt.getFullYear() <= today.getFullYear() &&
          goalCreatedAt.getMonth() <= today.getMonth() &&
          goalCreatedAt.getDate() <= today.getDate()
        ) {
          goals.push(goalData);
          return goalData;
        }
      });

      return res.json({ goals });
    })
    .catch(err => {
      console.error("Failed loading documents ", err);
      return res.status(400).json({ error: "Could not get goals" });
    });
};

const updateGoal = (req, res) => {
  let goalData = {
      docId: req.params.docId
    },
    { errors, valid } = validateGoal(req.body);

  if (!valid) {
    return res.status(400).json(errors);
  }

  Object.assign(goalData, req.body);

  db.collection("goals")
    .doc(goalData.docId)
    .update(req.body)
    .then(() => {
      return res.json({
        message: `Successfully updated document ${goalData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed updating document ", err);
      return res.status(400).json({ error: "Could not update goal" });
    });
};

const deleteGoal = (req, res) => {
  const goalData = {
    docId: req.params.docId
  };

  db.collection("goals")
    .doc(goalData.docId)
    .delete()
    .then(() => {
      return res.json({
        message: `Successfully deleted document ${goalData.docId}`
      });
    })
    .catch(err => {
      console.error("Failed deleting document ", err);
      return res.status(400).json({ error: "Could not delete nutrition" });
    });
};

module.exports = {
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
};
