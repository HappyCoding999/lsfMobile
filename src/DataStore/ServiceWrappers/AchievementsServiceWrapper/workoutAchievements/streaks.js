import { sortBy, flow } from "lodash/fp";
import moment from "moment";

export default completedWorkouts => achievements => {
  const workouts = sortBy(completedWorkouts, workout => workout.createdAt);

  return flow(
    checkThreeStreak(workouts),
    checkSevenStreak(workouts),
    checkTwentyStreak(workouts),
    checkThirtyStreak(workouts),
    checkFortyStreak(workouts),
    checkSixtyWorkoutStreak(workouts),
    checkEightyStreak(workouts),
    checkOneHundredStreak(workouts)
  )(achievements);
}

const checkThreeStreak = completedWorkouts => achievements => {
  const { didThreeWorkoutStreak } = achievements;
  let streak = 1;

  if (didThreeWorkoutStreak === false) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 3) {
        return {
          ...achievements,
          didThreeWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
}

const checkSevenStreak = completedWorkouts => achievements => {
  const { didThreeWorkoutStreak } = achievements;
  let streak = 1;

  if (didThreeWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 7) {
        return {
          ...achievements,
          didSevenWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
};

const checkTwentyStreak = completedWorkouts => achievements => {
  const { didSevenWorkoutStreak } = achievements;
  let streak = 1;

  if (didSevenWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 20) {
        return {
          ...achievements,
          didTwentyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
};

const checkThirtyStreak = completedWorkouts => achievements => {
  const { didTwentyWorkoutStreak } = achievements;
  let streak = 1;

  if (didTwentyWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 30) {
        return {
          ...achievements,
          didThirtyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
}

const checkFortyStreak = completedWorkouts => achievements => {
  const { didThirtyWorkoutStreak } = achievements;
  let streak = 1;

  if (didThirtyWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 40) {
        return {
          ...achievements,
          didFortyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
}

const checkSixtyWorkoutStreak = completedWorkouts => achievements => {
  const { didFortyWorkoutStreak } = achievements;
  let streak = 1;

  if (didFortyWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 60) {
        return {
          ...achievements,
          didSixtyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
};

const checkEightyStreak = completedWorkouts => achievements => {
  const { didSixtyWorkoutStreak } = achievements;
  let streak = 1;

  if (didSixtyWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 80) {
        return {
          ...achievements,
          didEightyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
};

const checkOneHundredStreak = completedWorkouts => achievements => {
  const { didEightyWorkoutStreak } = achievements;
  let streak = 1;

  if (didEightyWorkoutStreak === true) {
    for (let i = completedWorkouts.length - 1; i > 0; i--) {
      const { createdAt: startDate } = completedWorkouts[i];
      const { createdAt: endDate } = completedWorkouts[i - 1];
      const daysBetween = moment(startDate).diff(moment(endDate), "days");

      if (streak >= 100) {
        return {
          ...achievements,
          didEightyWorkoutStreak: true
        };
      } else if (daysBetween > 1) {
        return achievements;
      } else if (daysBetween === 1) {
        streak++;
      }
    }
  }

  return achievements;
}
