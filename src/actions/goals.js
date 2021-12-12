import moment from "moment"
import { last, sortBy, filter, chain } from "lodash";
import { flow } from "lodash/fp";

export function checkWeightGoals(data, userObj) {
  const { goals, achievements, historicalWeight } = userObj;
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

    const updatedWeightGoal = {
      target,
      goalAchieved: achieved,
      current: parseFloat(newWeight)
    };

    if (userWantsToLoseWeight && target >= newWeight) {
      return {
        goals: {
          ...goals,
          weight: updatedWeightGoal
        },
        newHistoricalWeight: parseFloat(newWeight)
      };
    }

    if (!userWantsToLoseWeight && target <= newWeight) {
      return {
        goals: {
          ...goals,
          weight: updatedWeightGoal
        },
        newHistoricalWeight: parseFloat(newWeight)
      };
    }

    return { goals: { ...goals, weight: updatedWeightGoal } };


    //   return User.saveGoal({ target, goalAchieved: achieved, current: parseFloat(newWeight) }, "weight")
    //     .then(() => {
    //       if (userWantsToLoseWeight && target >= newWeight) {
    //         return User.saveWeight({ weight: parseFloat(newWeight) })
    //       }

    //       if (!userWantsToLoseWeight && target <= newWeight) {
    //         return User.saveWeight({ weight: parseFloat(newWeight) })
    //       }

    //       return Promise.resolve(data);

    //     })
    //     .catch(err => console.log(err.stack));
    // }

    // return Promise.resolve(data);
  }

  return {};
}


export function checkWorkoutGoals(workout, userObj) {
  const { goals } = flow(
    updateWeeklyWorkoutGoal(workout),
    updateWorkoutStreakGoal(workout)
  )(userObj);

  return goals;
}

const updateWeeklyWorkoutGoal = workout => user => {

  const { completedWorkouts, goals } = user;
  const { weeklyWorkout } = goals;

  const SUNDAY = 0;
  const workoutDays = _createWorkoutDaysMap(Object.values(completedWorkouts || {}));

  // Go back and count each completed workout this week, starting today
  // Monday is the beginning of the week, so stop at Sunday
  let day = moment();
  let completed = 0;
  do {
    let completedToday = workoutDays[day.format('YYYY-MM-DD')];
    if (completedToday) {
      completed += completedToday;
    }
    day.subtract(1, 'days');
  } while (day.day() != SUNDAY);

  const updatedWeeklyWorkoutGoal = {
    ...weeklyWorkout,
    current: completed
  };

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
  const workoutDays = _createWorkoutDaysMap(Object.values(completedWorkouts || {}));

  let day = moment().subtract(1, 'days');
  let streak = 1;
  while (workoutDays[day.format('YYYY-MM-DD')]) {
    streak++;
    day.subtract(1, 'days');
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

// Takes an array of workouts with a createdAt field
// Returns a map day:count for all days that have workouts
// Default format is 'YYYY-MM-DD'
function _createWorkoutDaysMap(workouts, dateFormat='YYYY-MM-DD') {
  let map = {};
  for (let workout of workouts) {
    if (workout.createdAt) {
      let createdDate = moment(workout.createdAt).format(dateFormat);
      if (map[createdDate]) { // this day had other workouts completed on it
        map[createdDate]++;
      } else {
        map[createdDate] = 1;
      }
    }
  }
  return map;
}