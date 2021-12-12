import { last, flow, sortBy } from "lodash/fp";

export default measurement => userObj => {
  const { achievements } = userObj;

  const newAchievements =  flow(
    checkHalfWeightGoal(measurement, userObj),
    checkFirstWeightGoal(measurement, userObj),
    checkSecondWeightGoal(measurement, userObj),
    checkThirdWeightGoal(measurement, userObj)
  )(achievements);

  return {
    ...userObj,
    achievements: newAchievements
  };
}

const checkHalfWeightGoal = (measurement, userObj) => achievements => {
  const { didSetGoal, didHitHalfWeightGoal } = achievements;
  const { goals, weight: historicalWeight } = userObj;


  if (didSetGoal === true && didHitHalfWeightGoal === false) {
    const currentWeight = measurement.weight;
    const targetWeight = goals.weight.target;
    // const startingWeight = last(Object.values(historicalWeight)).weight;
    const startingWeight = flow(
      a => Object.values(a),
      sortBy(w => w.createdAt),
      last
    )(historicalWeight);

    return {
      ...achievements,
      didHitHalfWeightGoal: attainedHalfWeightGoal(startingWeight, currentWeight, targetWeight)
    };
  }

  return achievements;
};

const checkFirstWeightGoal = (measurement, userObj) => achievements => {
  const { didHitHalfWeightGoal, didMeetWeightGoalFirstTime } = achievements;
  const { goals, weight: historicalWeight } = userObj;

  if (didHitHalfWeightGoal === true && didMeetWeightGoalFirstTime === false) {
    const currentWeight = measurement.weight;
    const targetWeight = goals.weight.target;
    const startingWeight = last(historicalWeight).weight;

    return {
      ...achievements,
      didMeetWeightGoalFirstTime: attainedWeightGoal(startingWeight, currentWeight, targetWeight)
    };
  }

  return achievements;
}

const checkSecondWeightGoal = (measurement, userObj) => achievements => {
  const { didMeetWeightGoalFirstTime, didMeetWeightGoalSecondTime } = achievements;
  const { goals, weight: historicalWeight } = userObj;

  if (didMeetWeightGoalFirstTime === true && didMeetWeightGoalSecondTime === false) {
    const currentWeight = measurement.weight;
    const targetWeight = goals.weight.target;
    const startingWeight = last(historicalWeight).weight;

    return {
      ...achievements,
      didMeetWeightGoalSecondTime: attainedWeightGoal(startingWeight, currentWeight, targetWeight)
    };
  }

  return achievements;
}

const checkThirdWeightGoal = (measurement, userObj) => achievements => {
  const { didMeetWeightGoalSecondTime, didMeetWeightGoalThirdTime } = achievements;
  const { goals, weight: historicalWeight } = userObj;

  if (didMeetWeightGoalSecondTime === true && didMeetWeightGoalThirdTime === false) {
    const currentWeight = measurement.weight;
    const targetWeight = goals.weight.target;
    const startingWeight = last(historicalWeight).weight;

    return {
      ...achievements,
      didMeetWeightGoalThirdTime: attainedWeightGoal(startingWeight, currentWeight, targetWeight)
    };
  }

  return achievements;
}

function attainedWeightGoal(startingWeight, currentWeight, targetWeight) {
  const isTargetingLoss = startingWeight > targetWeight;

  if (isTargetingLoss) {
    return currentWeight <= targetWeight;
  }

  return currentWeight >= targetWeight;
}

function attainedHalfWeightGoal(startingWeight, currentWeight, targetWeight) {
  const isTargetingLoss = startingWeight > targetWeight;

  if (isTargetingLoss) {
    return (startingWeight - currentWeight) >= (startingWeight - targetWeight) / 2;
  }

  return (currentWeight - startingWeight) >= (targetWeight - startingWeight) / 2;
}