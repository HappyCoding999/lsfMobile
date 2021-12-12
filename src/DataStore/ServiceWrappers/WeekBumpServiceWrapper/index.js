import { chain } from "lodash";
import { getWeeklyWorkoutSchedule } from "../../../utils/workouts";

export default function (_API, dataStore) {
  const { getCurrentUser, getProgramForLevel } = dataStore;
  const basePath = () => {
    const user = getCurrentUser();
    if (user) {
      return `users/${user.uid}`;
    }

    throw new Error("Current User not present.  Something went Wrong");
  };

  function bumpWeek(currentWeek) {
    const ref = dataStore.ref(`${basePath()}/week`);

    return ref.set(currentWeek + 1);
  }

  function getNextLevel(level) {
    return {
      "Beginner": "Intermediate",
      "Intermediate": "Advanced",
      "Advanced": "Beginner"
    }[level];
  }

  function bumpLevel(level) {
    const levelRef = dataStore.ref(`${basePath()}/level`);
    const weekRef = dataStore.ref(`${basePath()}/week`);

    weekRef.set(1);

    return levelRef.set(getNextLevel(level));
  }

  function bump(userObj) {
    const { currentWeek, weeklyProgram, completedWorkouts, level } = userObj;
    // const { today } = getWeeklyWorkoutSchedule(completedWorkouts, weeklyProgram);
    return getWeeklyWorkoutSchedule(weeklyProgram || [])
      .then(({ today }) => {
        return getProgramForLevel(level)
          .then(program => {

            if (today) {
              return Promise.resolve();
            }

            const maxWeeks = chain(program)
              .maxBy(p => p.week)
              .value().week;

            if (currentWeek >= maxWeeks) {
              return bumpLevel(level);
            }

            return bumpWeek(currentWeek);
          });
      })

  }

  function saveCompletedWorkout(workout, userObj) {
    const { completedWorkouts } = userObj;
    const newCompletedWorkouts = Object.values(completedWorkouts || {}).concat({ ...workout, createdAt: Date.now() });
    return bump({ ...userObj, completedWorkouts: newCompletedWorkouts });

    // return getProgramForLevel(level)
    //   .then(program => {

    //     if (upcomming.length > 0) {
    //       return Promise.resolve();
    //     }

    //     const maxWeeks = chain(program)
    //       .maxBy(p => p.week)
    //       .value().week;

    //     if (currentWeek >= maxWeeks) {
    //       return bumpLevel(level);
    //     }


    //     return bumpWeek(currentWeek);
    //   })

  }

  function getUserObj(userObj) {
    // return bump(userObj);
  }

  return {
    getUserObj
  };
}
