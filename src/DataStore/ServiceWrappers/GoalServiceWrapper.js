import moment from "moment";
import { sortBy, filter, last } from "lodash";
import { flow } from "lodash/fp";

export default function (User, _dataStore) {

  const updateWeeklyWorkoutGoal = workout => user => {
    const { completedWorkouts, goals } = user;
    const { weeklyWorkout } = goals;
    const { lastReset } = weeklyWorkout;
    const timeStamp = Date.now();
    const workouts = sortBy(Object.values(completedWorkouts || {}),
      completedWorkout => completedWorkout.createdAt).concat({ ...workout, createdAt: timeStamp });
    const completedWorkoutsPassedWeek = filter(workouts, completedWorkout => completedWorkout.createdAt >= lastReset);
    const daysElapsed = moment(lastReset).diff(moment(timeStamp), "days");
    let updatedWeeklyWorkoutGoal = {};


    if (daysElapsed >= 7) {
      updatedWeeklyWorkoutGoal = {
        ...weeklyWorkout,
        lastReset: timeStamp,
        current: 0
      };
    } else {
      updatedWeeklyWorkoutGoal = {
        ...weeklyWorkout,
        current: 1 + completedWorkoutsPassedWeek.length
      };
    }

    const newGoals = {
      ...goals,
      weeklyWorkout: updatedWeeklyWorkoutGoal
    };

    return {
      ...user,
      goals: newGoals
    };
  }

  const updateWorkoutStreakGoal = workout => user => {
    const { completedWorkouts, goals } = user;
    const { workoutStreak } = goals;
    const { longest } = workoutStreak;
    const timeStamp = Date.now();
    const workouts = sortBy(Object.values(completedWorkouts || {}),
      completedWorkout => completedWorkout.createdAt).concat({ ...workout, createdAt: timeStamp });

    let streak = 1;
    for (let i = workouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = workouts[i];
      const { createdAt: endDate } = workouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (daysBetween > 1) {
        break;
      } else if (daysBetween === 1) {
        streak++;
      }
    }

    const newLongest = streak > longest ? streak : longest;
    const newGoals = {
      ...goals,
      workoutStreak: { longest: newLongest, current: streak }
    };

    return {
      ...user,
      goals: newGoals
    };
  }

  function saveCompletedWorkout(workout, userObj) {
    const { goals: newGoals } = flow(
      updateWeeklyWorkoutGoal(workout),
      updateWorkoutStreakGoal(workout)
    )(userObj);

    return User.saveGoalsObj(newGoals);
  }

  function saveMeasurement(data, userObj) {
    const { goals, achievements, weight: historicalWeight } = userObj;
    const startingWeight = last(sortBy(Object.values(historicalWeight), w => w.createdAt)).weight;
    const { weight } = goals;
    const { target, goalAchieved } = weight;
    const { weight: newWeight } = data;
    const userWantsToLoseWeight = startingWeight > target;

    if (goalAchieved === false && achievements.didSetGoal === true) {

      let achieved;

      if (userWantsToLoseWeight && newWeight <= target) {
        achieved = true;
      } else if (userWantsToLoseWeight) {
        achieved = false;
      } else if (newWeight >= target) {
        achieved = true;
      } else {
        achieved = false;
      }

      return User.saveGoal({ target, goalAchieved: achieved, current: parseFloat(newWeight) }, "weight")
        .then(() => {
          if (userWantsToLoseWeight && target >= newWeight) {
            return User.saveWeight({ weight: parseFloat(newWeight) })
          }

          if (!userWantsToLoseWeight && target <= newWeight) {
            return User.saveWeight({ weight: parseFloat(newWeight)})
          }

          return Promise.resolve(data);

        })
        .catch(err => console.log(err.stack));
    }

    return Promise.resolve(data);
  }

  function saveBottleCount(count, userObj) {

    const { goals } = userObj;
    const { dailyWaterIntake } = goals;
    const { target, current, lastReset } = dailyWaterIntake;

    // add new count to original count for the days water bottle log (resets daily)
    const newCurrent = count + current;

    return User.saveGoal({ target, current: newCurrent, lastReset }, "dailyWaterIntake");
  }

  // function getUserObj(_, userObj) {
  function getUserObj(userObj) {
    const now = Date.now();
    const { goals, weight: historicalWeight } = userObj;
    const { dailyWaterIntake, weeklyWorkout, weight } = goals;
    const { lastReset: lastWaterReset } = dailyWaterIntake;
    const { lastReset: lastWorkoutReset } = weeklyWorkout;

    // const shouldResetWaterGoal = moment(now).diff(moment(lastWaterReset), "days") >= 1;
    var shouldResetWaterGoal = moment(now).startOf('day').diff(moment(lastWaterReset).startOf('day'), "days") >= 1;
    const weightGoalAchieved = last(sortBy(historicalWeight, w => w.createdAt)).weight === weight.target;
    let newGoals = goals;

    // get tz offset
    const tzOffset = moment().utcOffset();

    // get now time
    const localTime = moment().utcOffset(tzOffset).valueOf();

    // start/end of week millisecond timestamp
    var startOfTheWeek = moment().startOf('week').utcOffset(tzOffset);

    // get monday 12:01AM of starting week to check if we need to reset our counter
    const weeklyResetDateTime = startOfTheWeek.add({days: 1, minutes: 1}).valueOf();

    // get timestamp
    startOfTheWeek = startOfTheWeek.valueOf();

    const lastResetWithTz = moment(lastWorkoutReset).utcOffset(tzOffset).valueOf();

    if (weightGoalAchieved === true && weight.goalAchieved === false) {
      const newWeightGoal = {
        ...weight,
        goalAchieved: true
      };

      newGoals = {
        ...newGoals,
        weight: newWeightGoal
      };

      User.saveGoal(newWeightGoal, "weight");
    }

    if (shouldResetWaterGoal) {
      const newWaterGoal = {
        ...dailyWaterIntake,
        current: 0,
        lastReset: now
      };

      newGoals = {
        ...newGoals,
        dailyWaterIntake: newWaterGoal
      };

      User.saveGoal(newWaterGoal, "dailyWaterIntake")
        .catch(err => console.log(err.stack));

    }

    // reset user weekly workout status if we are on a new week
    // if last reset is before this current week and we are now in a new week after our reset time, then reset
    if (lastResetWithTz <= weeklyResetDateTime && localTime >= weeklyResetDateTime) {
      const newWeeklyWorkoutGoal = {
        ...weeklyWorkout,
        current: 0,
        lastReset: now
      };

      newGoals = {
        ...newGoals,
        weeklyWorkout: newWeeklyWorkoutGoal
      };

      User.saveGoal(newWeeklyWorkoutGoal, "weeklyWorkout")
        .catch(err => console.log(err.stack));
    }

    return {
      ...userObj,
      goals: newGoals
    };
  }


  const wrappers = {
    // saveMeasurement,
    // saveCompletedWorkout,
    saveBottleCount,
    getUserObj
  };

  return {
    ...wrappers
  };
}
