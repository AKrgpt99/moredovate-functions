const {
  isEmpty,
  isEmail,
  isGender,
  isFitnessLevel,
  toArray,
  isFormatted,
  isNumber,
  isISOString
} = require("./helpers");

const validateSignup1 = data => {
  let errors = {};

  if (isEmpty(data.name)) {
    errors.name = "Must not be empty";
  }

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be valid";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Must match password";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validateSignup2 = data => {
  let errors = {};

  if (isEmpty(data.weight)) {
    errors.weight = "Must not be empty";
  } else if (isNaN(data.weight)) {
    errors.weight = "Must be a number";
  }

  if (isEmpty(data.height)) {
    errors.height = "Must not be empty";
  } else if (isNaN(data.height)) {
    errors.height = "Must be a number";
  }

  if (isEmpty(data.gender)) {
    errors.gender = "Must not be empty";
  } else if (!isGender(data.gender)) {
    errors.gender = "Must be valid";
  }

  if (isEmpty(data.fitnessLevel)) {
    errors.fitnessLevel = "Must not be empty";
  } else if (!isFitnessLevel(data.fitnessLevel)) {
    errors.fitnessLevel = "Must be valid";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validateLogin = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be valid";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validateExercises = data => {
  let errors = {};

  Object.keys(data).map(exercise => {
    if (typeof data[exercise] === "object") {
      if (isEmpty(data[exercise].reps)) {
        errors.reps = "Must not be empty";
      } else if (!isFormatted(data[exercise].reps)) {
        errors.reps = "Must be formatted correctly";
      }

      if (isEmpty(data[exercise].rest)) {
        errors.rest = "Must not be empty";
      } else if (!isFormatted(data[exercise].rest)) {
        errors.rest = "Must be formatted correctly";
      } else if (
        toArray(data[exercise].rest).length <
        toArray(data[exercise].reps).length - 1
      ) {
        errors.rest = "Missing an entry";
      } else if (
        toArray(data[exercise].rest).length >
        toArray(data[exercise].reps).length - 1
      ) {
        errors.rest = "Too many entries";
      }

      if (isEmpty(data[exercise].weight)) {
        errors.weight = "Must not be empty";
      } else if (!isFormatted(data[exercise].weight)) {
        errors.weight = "Must be formatted correctly";
      } else if (
        toArray(data[exercise].weight).length <
        toArray(data[exercise].reps).length
      ) {
        errors.weight = "Missing an entry";
      } else if (
        toArray(data[exercise].weight).length >
        toArray(data[exercise].reps).length
      ) {
        errors.weight = "Too many entries";
      }

      if (isEmpty(data[exercise].heartrate)) {
        errors.heartrate = "Must not be empty";
      } else if (!isFormatted(data[exercise].heartrate)) {
        errors.heartrate = "Must be formatted correctly";
      } else if (
        toArray(data[exercise].heartrate).length <
        toArray(data[exercise].reps).length
      ) {
        errors.heartrate = "Missing an entry";
      } else if (
        toArray(data[exercise].heartrate).length >
        toArray(data[exercise].reps).length
      ) {
        errors.heartrate = "Too many entries";
      }
    }
  });

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validateNutrition = data => {
  let errors = {};

  if (data.calories && !isNumber(data.calories)) {
    errors.calories = "Must be a number, in caloric units";
  }

  if (data.protein && !isNumber(data.protein)) {
    errors.protein = "Must be a number, in grams";
  }

  if (data.carbs && !isNumber(data.carbs)) {
    errors.carbs = "Must be a number, in grams";
  }

  if (data.fat && !isNumber(data.fat)) {
    error.fat = "Must be a number, in grams";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validateGoal = data => {
  let errors = {};

  if (data.startedAt && isEmpty(data.startedAt)) {
    errors.startedAt = "Must not be empty";
  } else if (data.startedAt && !isISOString(data.startedAt)) {
    errors.startedAt = "Must be formatted correctly";
  }

  if (data.finishedAt && isEmpty(data.finishedAt)) {
    errors.finishedAt = "Must not be empty";
  } else if (data.finishedAt && !isISOString(data.finishedAt)) {
    errors.finishedAt = "Must be formatted correctly";
  }

  if (data.weightStart && !isNumber(data.weightStart)) {
    errors.weightStart = "Must not be a number, in pounds";
  }

  if (data.weightEnd && !isNumber(data.weightEnd)) {
    errors.weightEnd = "Must not be empty";
  }

  if (typeof data.workoutDays === "string") {
    if (isEmpty(data.workoutDays)) {
      errors.workoutDays = "Must not be empty";
    } else if (!isFormatted(data.workoutDays)) {
      errors.workoutDays = "Must be formatted correctly";
    } else if (toArray(data.workoutDays).length < 7) {
      errors.workoutDays = "Missing a day";
    } else if (toArray(data.workoutDays).length > 7) {
      errors.workoutDays = "Too many days";
    }
  }

  if (data.maxCalories && !isNumber(data.maxCalories)) {
    errors.maxCalories = "Must be a number, in caloric units";
  }

  if (data.minCalories && !isNumber(data.minCalories)) {
    errors.minCalories = "Must be a number, in grams";
  }

  if (data.maxProtein && !isNumber(data.maxProtein)) {
    errors.maxProtein = "Must be a number, in grams";
  }

  if (data.minProtein && !isNumber(data.minProtein)) {
    errors.minProtein = "Must be a number, in grams";
  }

  if (data.maxCarbs && !isNumber(data.maxCarbs)) {
    errors.maxCarbs = "Must be a number, in grams";
  }

  if (data.minCarbs && !isNumber(data.minCarbs)) {
    errors.minCarbs = "Must be a number, in grams";
  }

  if (data.maxFat && !isNumber(data.maxFat)) {
    errors.maxFat = "Must be a number, in grams";
  }

  if (data.minFat && !isNumber(data.minFat)) {
    errors.minFat = "Must be a number, in grams";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

module.exports = {
  validateSignup1,
  validateSignup2,
  validateLogin,
  validateExercises,
  validateNutrition,
  validateGoal
};
