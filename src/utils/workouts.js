import { sortBy, filter, last, chain, differenceBy } from "lodash";
import { AsyncStorage } from "react-native";
import moment from "moment";

const workoutsForWeek = "workoutsForWeek";

export function checkIfSelfCareCompletedOrNot(
  completedWorkouts,
  completed,
  currentWeek
) {
  var isSelfCareCompleted = false;
  if (
    completedWorkouts != null &&
    completedWorkouts != undefined &&
    completedWorkouts.length > 0
  ) {
    for (let [tag, item] of Object.entries(completedWorkouts)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == currentWeek &&
        day != "Invalid Date" &&
        day.getDay() == item.day
      ) {
        isSelfCareCompleted = true;
      }
    }
  }
  if (completed != null && completed != undefined && completed.length > 0) {
    for (let [tag, item] of Object.entries(completed)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == currentWeek &&
        day != "Invalid Date" &&
        day.getDay() == item.day
      ) {
        isSelfCareCompleted = true;
      }
    }
  }
  return isSelfCareCompleted;
}

export function skipWorkout(workout) {
  return completeTodaysWorkout().then(() =>
    AsyncStorage.getItem("skippedWorkouts")
      .then((_skippedWorkouts) => JSON.parse(_skippedWorkouts))
      .then((parsedSkippedWorkouts) =>
        parsedSkippedWorkouts
          ? parsedSkippedWorkouts.concat(workout)
          : [workout]
      )
      .then((newSkippedWorkouts) => JSON.stringify(newSkippedWorkouts))
      .then((stringifiedWorkouts) =>
        AsyncStorage.setItem("skippedWorkouts", stringifiedWorkouts)
      )
  );
}

export function completeTodaysWorkout() {
  return getWorkoutsForWeek()
    .then((ws) => {
      return ws;
    })
    .then(([_today, ...rest]) => rest)
    .then((updatedWorkoutsForWeek) => JSON.stringify(updatedWorkoutsForWeek))
    .then((newStringifiedWorkouts) =>
      AsyncStorage.setItem(workoutsForWeek, newStringifiedWorkouts)
    );
}

export function getWeeklyWorkoutSchedule(
  weeklyWorkoutProgram,
  resetWorkoutScheduleCache = false
) {
  return getSkippedWorkoutsForWeek()
    .then((skippedWorkouts) => {
      if (resetWorkoutScheduleCache) {
        loadWorkoutsForWeek(weeklyWorkoutProgram);
      }

      return getWorkoutsForWeek().then((workouts) => {
        if (!workouts) {
          return Promise.all([
            loadWorkoutsForWeek(weeklyWorkoutProgram),
            clearSkippedCache(),
          ]).then(() => ({
            skippedWorkouts: [],
            upcomming: weeklyWorkoutProgram,
          }));
        }

        return Promise.resolve({
          skippedWorkouts: skippedWorkouts || [],
          upcomming: workouts,
        });
      });
    })
    .then(({ skippedWorkouts, upcomming }) => {
      if (upcomming.length === 0) {
        return Promise.all([clearWorkoutsForWeek(), clearSkippedCache()]).then(
          () =>
            Promise.resolve({
              today: null,
              upcomming: [],
              completed: [],
            })
        );
      }
      const _upcomming = filterSkipped(skippedWorkouts, upcomming);
      const completed = differenceBy(
        weeklyWorkoutProgram,
        _upcomming.concat(skippedWorkouts),
        (w) => w.day
      );
      return Promise.resolve({
        today: _upcomming[0],
        upcomming: _upcomming.slice(1),
        completed,
      });
    })
    .catch((err) => console.log(err.stack));
}

export function getWeeklyWorkoutScheduleAfterSkipWeek(
  weeklyWorkoutProgram,
  resetWorkoutScheduleCache = false
) {
  return getSkippedWorkoutsForWeek()
    .then((skippedWorkouts) => {
      if (resetWorkoutScheduleCache) {
        loadWorkoutsForWeek(weeklyWorkoutProgram);
      }

      return getWorkoutsForWeek().then((workouts) => {
        if (!workouts) {
          return Promise.all([
            loadWorkoutsForWeek(weeklyWorkoutProgram),
            clearSkippedCache(),
          ]).then(() => ({
            skippedWorkouts: [],
            upcomming: weeklyWorkoutProgram,
          }));
        }

        return Promise.resolve({ skippedWorkouts: [], upcomming: workouts });
      });
    })
    .then(({ skippedWorkouts, upcomming }) => {
      if (upcomming.length === 0) {
        return Promise.all([clearWorkoutsForWeek(), clearSkippedCache()]).then(
          () =>
            Promise.resolve({
              today: null,
              upcomming: [],
              completed: [],
            })
        );
      }
      const _upcomming = upcomming;
      const completed = [];

      return Promise.resolve({
        today: _upcomming[0],
        upcomming: _upcomming.slice(1),
        completed,
      });
    })
    .catch((err) => console.log(err.stack));
}

export function getDataForWeek(
  completedWorkouts,
  weeklyWorkoutSchedule,
  currentWeek
) {
  console.log("getDataForWeek called");
  const { completed } = weeklyWorkoutSchedule;
  var weekData = [];
  var length = completedWorkouts ? completedWorkouts.length : 0;
  if (completedWorkouts.length > 0) {
    for (let [tag, item] of Object.entries(completedWorkouts)) {
      if (item.primaryType != "Rest" && currentWeek == item.week) {
        var isObjectContains = false;
        for (const item1 of weekData) {
          if (
            item1.week == item.week &&
            item1.day == item.day &&
            currentWeek == item.week
          ) {
            isObjectContains = true;
            break;
          }
        }
        if (isObjectContains == false) {
          var day = new Date(item.createdAt);
          if (day != "Invalid Date" && currentWeek == item.week) {
            weekData.push({ ...item, isCompleted: true });
          } else {
            weekData.push({ ...item, isCompleted: false });
          }
        }
      }
    }
  }

  length = completed ? completed.length : 0;

  if (completed.length > 0) {
    for (let [tag, item] of Object.entries(completed)) {
      if (item.primaryType != "Rest" && currentWeek == item.week) {
        var isObjectContains = false;
        for (const item1 of weekData) {
          if (
            item1.week == item.week &&
            item1.day == item.day &&
            currentWeek == item.week
          ) {
            isObjectContains = true;
            break;
          }
        }
        if (isObjectContains == false) {
          var day = new Date(item.createdAt);
          if (day != "Invalid Date" && currentWeek == item.week) {
            // if (day != "Invalid Date" && day.getDay() >= item.day && this.props.screenProps.currentWeek == item.week)
            weekData.push({ ...item, isCompleted: true });
          } else {
            weekData.push({ ...item, isCompleted: false });
          }
        }
      }
    }
  }
  if (weeklyWorkoutSchedule.today) {
    const { today } = weeklyWorkoutSchedule;
    var isObjectContains = false;
    for (const item1 of weekData) {
      if (item1.week == today.week && item1.day == today.day) {
        isObjectContains = true;
        break;
      }
    }
    if (today.primaryType != "Rest") {
      if (isObjectContains == false) {
        weekData.push(today);
      }
    }
  }
  if (weeklyWorkoutSchedule.upcomming) {
    for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
      if (item.primaryType != "Rest") {
        var isObjectContains = false;
        for (const item1 of weekData) {
          if (item1.week == item.week && item1.day == item.day) {
            isObjectContains = true;
            break;
          }
        }
        if (isObjectContains == false) {
          weekData.push(item);
        }
      }
    }
  }
  weekData.sort(function (a, b) {
    return a.day > b.day;
  });
  var weekDataLatest = [];
  var weekDataCompleted = [];
  var isPreviousWorkoutCompleted = false;
  for (let [tag, item] of Object.entries(weekData)) {
    var moveToLast =
      moment(Date.now())
        .startOf("day")
        .diff(moment(item.createdAt).startOf("day"), "days") >= 1;
    if (isPreviousWorkoutCompleted) {
      if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
        weekDataCompleted.push({ ...item, isPreviousWorkoutCompleted: true });
      } else {
        weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: true });
      }
    } else {
      if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
        weekDataCompleted.push({ ...item, isPreviousWorkoutCompleted: false });
      } else {
        weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: false });
      }
    }
    if (item.isCompleted) {
      isPreviousWorkoutCompleted = true;
    } else {
      isPreviousWorkoutCompleted = false;
    }
  }
  return weekDataLatest.concat(weekDataCompleted);
}

function getSkippedWorkoutsForWeek() {
  return AsyncStorage.getItem("skippedWorkouts").then((skippedDays) =>
    JSON.parse(skippedDays)
  );
}

function loadWorkoutsForWeek(workouts) {
  return AsyncStorage.setItem(workoutsForWeek, JSON.stringify(workouts));
}

function getWorkoutsForWeek() {
  return AsyncStorage.getItem(workoutsForWeek).then((workouts) =>
    JSON.parse(workouts)
  );
}

function clearSkippedCache() {
  return AsyncStorage.removeItem("skippedWorkouts");
}

function clearWorkoutsForWeek() {
  return AsyncStorage.removeItem(workoutsForWeek);
}

function filterCompleted({ today, upcomming, completed }) {
  if (completed.length === 0) {
    return {
      today,
      upcomming,
      completed,
    };
  }
  const lastCompleted = last(completed);
  const _upcomming = filter(upcomming, (u) => u.day > lastCompleted.day);

  return {
    today: _upcomming[0],
    upcomming: _upcomming.slice(1),
    completed,
  };
}

function filterSkipped(skipped, upcomming) {
  const lastSkipped = last(skipped);
  if (!lastSkipped) {
    return upcomming;
  }
  const _upcomming = filter(upcomming, (u) => u.day > lastSkipped.day);

  return _upcomming;
}
