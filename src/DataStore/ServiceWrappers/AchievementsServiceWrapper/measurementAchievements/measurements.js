import { flow, last, sortBy } from "lodash/fp";
import Achievements from "../../../Achievements";

export default measurement => userObj => {
  const { achievements, measurements } = userObj;

  const newAchievements = flow(
    checkFirstMeasurement(),
    checkWeightLoss(measurement, userObj),
    checkPhotos(measurements)
  )(achievements);

  return {
    ...userObj,
    achievements: newAchievements
  };
}

const checkFirstMeasurement = () => achievements => {
  const { didInputMeasurement } = achievements;

  if (didInputMeasurement === false) {
    return {
      ...achievements,
      didInputMeasurement: true
    };
  }

  return achievements;
};

const checkWeightLoss = (measurement, userObj) => achievements => {
  const { didLoseWeight } = achievements;

  if (didLoseWeight === false) {
    const { weight: historicalWeight } = userObj;
    const startingWeight = flow(
      a => Object.values(a),
      sortBy(a => a.createdAt),
      last
    )(historicalWeight);
    const { weight: currentWeight } = measurement;

    return {
      ...achievements,
      didLoseWeight: currentWeight < startingWeight
    };
  }

  return achievements;
};

const checkPhotos = measurements => achievements => {
  const { didPhotosForThreeMonths, didInputMeasurement } = achievements;
  
  if (didPhotosForThreeMonths === true && didInputMeasurement === false) { return achievements; }

  const months = {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "9": false,
    "10": false,
    "11": false
  };

  let monthCount = 0;

  for (let measurement of Object.values(measurements || {})) {
    const month = (new Date(measurement.createdAt)).getMonth();
    const containsPics = (measurement.backImage || measurement.frontImage || measurement.sideImage);

    if (months[month] === false && containsPics)  {
      monthCount++;
      months[month] = true;
    }
  }

  return {
    ...achievements,
    didPhotosForThreeMonths: monthCount >= 3,
    didPhotosForSixMonths: monthCount >= 6,
    didPhotosForNineMonths: monthCount >= 9,
    didPhotosForTwelveMonths: monthCount >= 12
  };
};