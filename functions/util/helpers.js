// Input Validation Helpers

const isEmpty = string => {
  if (string.trim() === "") {
    return true;
  }
  return false;
};

const isEmail = string => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (string.match(regEx)) {
    return true;
  }

  return false;
};

const isNumber = integer => {
  return (
    Number.isInteger(integer) && !isNaN(integer) && typeof integer === "number"
  );
};

const isISOString = string => {
  const regEx = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

  if (string.match(regEx)) {
    return true;
  }

  return false;
};

const isGender = string => {
  if (
    string.trim() === "male" ||
    string.trim() === "female" ||
    string.trim() === "other"
  ) {
    return true;
  }

  return false;
};

const isFitnessLevel = string => {
  if (
    string.trim() === "beginner" ||
    string.trim() === "intermediate" ||
    string.trim() === "advanced"
  ) {
    return true;
  }

  return false;
};

// Custom Helpers

/* Checks to see if a string is formatted
according to project spec.

Special string format example: "5 5 5 5 5", a
simple string representing the reps of an
exercise. Must contain numeric characters and
spaces only.

Usage
    string: String
        a string formatted correctly using the
        special string format used for this
        project
    return: Boolean
        whether the string is formatted correctly
*/
const isFormatted = string => {
  const regEx = /(\d+\s*)/;

  if (string.trim().match(regEx)) {
    return true;
  }

  return false;
};

/* Converts a specially formatted string into an
array

Special string format example: "5 5 5 5 5", a
simple string representing the reps of an
exercise. Must contain numeric characters and
spaces only.

Usage
    string: String
        a string formatted correctly using the
        special string format used for this
        project
    return: Array
        containing the integers gathered from
        the input string
*/
// TODO: validate input string
const toArray = string => {
  return string.split(" ").map(rep => {
    return parseInt(rep);
  });
};

/* Get the sums of an array containing
integers

Usage
    array: Array
        contains the numeric characters or
        integers to be summed
    return: Integer
        the sum of the numeric characters or
        integers in the string
*/
// TODO: validate array data
const getSumFromArray = array => {
  return array.reduce(
    (accumulutorValue, currentValue) =>
      parseInt(accumulutorValue) + parseInt(currentValue),
    0
  );
};

/* Get the sums of a specific string format
used for this project

Special string format example: "5 5 5 5 5", a
simple string representing the reps of an
exercise. Must contain numeric characters and
spaces only.

Usage
    string: String
        a string formatted correctly using the
        special string format used for this
        project
    return: Integer
        the sum of the numeric characters in the
        string
*/
// TODO: validate string format
const getSumFromString = string => {
  return getSumFromArray(toArray(string));
};

module.exports = {
  isEmpty,
  isEmail,
  isNumber,
  isISOString,
  isGender,
  isFitnessLevel,
  toArray,
  getSumFromArray,
  getSumFromString,
  isFormatted
};
