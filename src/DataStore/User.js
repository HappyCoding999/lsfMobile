import {
  validateSelfCareLog,
  validateSweatLogData,
  validateSweatLogDataForOutsideWorkout,
  validateMeasurements,
  validateBonusChallenge,
  validateWeight,
  validateAchievements,
  validateWeightGoal,
  validateDailyWaterIntake,
  validateWeeklyWorkout,
  validateWorkoutStreak,
  validateGoalsObj,
  validatePurchase,
} from "./validators";

export default function (dataStore) {
  const {
    getCurrentUser,
    getProgram,
    getExercisesByTags,
    mapTagsToExercises,
    getProgramWithExercises,
    UserSchema,
    getLatestChallenge,
  } = dataStore;

  const basePath = () => {
    const user = getCurrentUser();
    if (user) {
      return `users/${user.uid}`;
    }

    throw new Error("Current User not present.  Something went wrong");
  };

  function findById(id) {
    const ref = dataStore.ref(`users/${id}`);
    return ref.once("value").then((snapshot) => snapshot.val());
  }

  function create(userData) {
    const { authorizedID } = userData;
    if (authorizedID) {
      const ref = dataStore.ref(`users/${authorizedID}`);
      try {
        const newUser = UserSchema(userData);

        return ref.update(newUser);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(
      new Error("userData must have an authorizedID property")
    );
  }

  function saveCompletedWorkout(workout) {
    const ref = dataStore.ref(`${basePath()}/completedWorkouts`);
    const timeStamp = Date.now();
    return ref.push({ ...workout, createdAt: timeStamp, flag: true });

    // var day = new Date(timeStamp);
    // if (day.getDay() == workout.day)
    // {
    //    return ref.push({ ...workout, createdAt: timeStamp, flag: true });l̥
    // }
    // else
    // {
    //   return Promise.reject(new Error("Another day's workout completed"));
    // }
  }

  // function resetCompletedWorkout(createdAt) {
  //   const ref = dataStore.ref(`${basePath()}`);
  //   return ref.update({ completedWorkouts: [] });
  // }

  function resetCompletedWorkout(createdAt) {
    if (createdAt != undefined && createdAt != "") {
      const ref = dataStore.ref(`${basePath()}/completedWorkouts`);

      return Promise.all([
        ref.once("value").then((snapshot) => {
          var key = "";
          if (snapshot.val() === null) {
          } else {
            snapshot.forEach(function (childSnapshot) {
              // childData will be the actual contents of the child
              var childData = childSnapshot.val();
              if (childData.createdAt == createdAt) {
                key = childSnapshot.key;
              }
            });
          }
          if (key != "") {
            var path = `${basePath()}/completedWorkouts/${key}`;

            const ref1 = dataStore.ref(path);
            return ref1.update({ flag: false });
          }
        }),
      ]);
    }

    // return ref.update({ completedWorkouts: [] });
  }

  function saveBonusChallenge(data) {
    const timeStamp = Date.now();
    const ref = dataStore.ref(`${basePath()}/completedBonusChallenges`);
    const bonusChallenge = {
      ...validateBonusChallenge(data),
      createdAt: timeStamp,
    };

    return ref.push(bonusChallenge);
  }

  function saveSweatLog(data) {
    console.log("saveSweatLog::::=- 1: " + JSON.stringify(data));

    if (data.createdAt != undefined && data.createdAt != "") {
      const ref = dataStore.ref(`${basePath()}/sweatLogs`);
      return Promise.all([
        ref.once("value").then((snapshot) => {
          // if (snapshot.val() === null) return [];
          var key = "";
          if (snapshot.val() === null) {
          } else {
            snapshot.forEach(function (childSnapshot) {
              // childData will be the actual contents of the child
              var childData = childSnapshot.val();
              if (childData.createdAt == data.createdAt) {
                key = childSnapshot.key;
              }
            });
          }
          var path = `${basePath()}/sweatLogs`;
          if (key != "") {
            path = `${basePath()}/sweatLogs/${key}`;
            console.log(path);
            const ref = dataStore.ref(path);
            return ref.update(data);
          } else {
            console.log(path);
            const ref = dataStore.ref(path);
            return ref.push(data);
          }
        }),
      ]);
    } else {
      const timeStamp = Date.now();
      const ref = dataStore.ref(`${basePath()}/sweatLogs`);
      if (
        data.outsideWorkoutTitle != undefined &&
        data.outsideWorkoutTitle != ""
      ) {
        const sweatLog = {
          ...validateSweatLogDataForOutsideWorkout(data),
          createdAt: timeStamp,
        };
        return ref.push(sweatLog);
      } else {
        const sweatLog = {
          ...validateSweatLogData(data),
          createdAt: timeStamp,
        };
        return ref.push(sweatLog);
      }
    }
  }

  function saveSelfCareLog(data) {
    const timeStamp = Date.now();
    const ref = dataStore.ref(`${basePath()}/selfCareLogs`);
    const selfCareLog = { ...validateSelfCareLog(data), createdAt: timeStamp };

    return ref.push(selfCareLog);
  }

  function saveMeasurement(data) {
    const timeStamp = Date.now();
    const ref = dataStore.ref(`${basePath()}/measurements`);
    const measurements = {
      ...validateMeasurements(data),
      createdAt: timeStamp,
    };

    return ref.push(measurements);
  }

  function updateMeasurement(data) {
    const ref = dataStore.ref(`${basePath()}`);
    return ref.update({ measurements: data });
  }

  function savePurchase(purchase) {
    const ref = dataStore.ref(`${basePath()}/purchaseHistory`);

    try {
      const newPurchase = validatePurchase(purchase);
      return ref.push(newPurchase);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function saveBottleCount(count) {
    const logRef = dataStore.ref(`${basePath()}/waterBottleLogs`);
    const countRef = dataStore.ref(`${basePath()}/bottleCount`);

    const timeStamp = Date.now();
    const newLog = { count, createdAt: timeStamp };

    return Promise.all([
      logRef.push(newLog),
      countRef.once("value").then((snapshot) => {
        const currentCount = snapshot.val() || 0;
        return countRef.set(currentCount + count);
      }),
    ]);
  }

  function saveBottleCountWithSize(count, bottle_size) {
    // return;
    const logRef = dataStore.ref(`${basePath()}/waterBottleLogs`);
    const countRef = dataStore.ref(`${basePath()}/bottleCount`);

    const timeStamp = Date.now();
    const newLog = { count, createdAt: timeStamp, bottoleOunces: bottleSize };

    return Promise.all([
      logRef.push(newLog),
      countRef.once("value").then((snapshot) => {
        const currentCount = snapshot.val() || 0;
        return countRef.set(currentCount + count);
      }),
    ]);
  }

  function updateUserData(userData) {
    const ref = dataStore.ref(`${basePath()}`);
    return ref.update(userData);
  }

  function saveLevel(level) {
    const ref = dataStore.ref(`${basePath()}/level`);

    return ref.set(level);
  }

  function updateWeekAndLevel({ week, level }) {
    const ref = dataStore.ref(`${basePath()}`);

    return ref.update({ currentWeek: week, level });
  }

  function updateLevel({ lvl }) {
    const ref = dataStore.ref(`${basePath()}`);

    return ref.update({ level: lvl });
  }

  function saveWeek(week) {
    const ref = dataStore.ref(`${basePath()}/currentWeek`);

    return ref.set(week);
  }

  // function saveWeight(weight) {
  function saveWeight(weight, weightUnit) {
    const ref = dataStore.ref(`${basePath()}/weight`);
    try {
      const newWeight = validateWeight({
        weight,
        createdAt: Date.now(),
        weightUnit,
      });
      return ref.push(newWeight);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function saveGoal(goal, type) {
    const goalValidators = {
      weight: validateWeightGoal,
      workoutStreak: validateWorkoutStreak,
      dailyWaterIntake: validateDailyWaterIntake,
      weeklyWorkout: validateWeeklyWorkout,
    };

    const validateGoal = goalValidators[type];

    if (validateGoal) {
      const ref = dataStore.ref(`${basePath()}/goals/${type}`);
      try {
        const newGoal = validateGoal(goal);
        return ref.update(newGoal);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const types = "Weight, WorkoutStreak, dailyWaterIntake, or weeklyWorkout";

    return Promise.reject(new Error(`Goal type must be one of ${types}`));
  }

  function saveGoalsObj(goalObj) {
    const ref = dataStore.ref(`${basePath()}/goals`);

    try {
      const newGoal = validateGoalsObj(goalObj);
      return ref.set(newGoal);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function saveWeightGoal(goal) {
    return saveGoal(goal, "weight");
  }

  function flushNotificationQueue() {
    const ref = dataStore.ref(`${basePath()}/notificationQueue`);
    return ref.remove();
  }

  function getCompletedWorkouts() {
    const ref = dataStore
      .ref(`${basePath()}/completedWorkouts`)
      .orderByChild("createdAt");

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];
      return Object.values(snapshot.val());
    });
  }

  function getSweatLogs() {
    const ref = dataStore.ref(`${basePath()}/sweatLogs`);

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];
      return Object.values(snapshot.val());
    });
  }

  function getCompletedBonusChallenges() {
    const ref = dataStore.ref(`${basePath()}/completedBonusChallenges`);

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];
      return Object.values(snapshot.val());
    });
  }
  //********************************************************************************************* */
  /**
   *
   *  Private
   */
  function getUserCompletedWorkoutsForLevel(level) {
    const ref = dataStore.ref(`${basePath()}/completedWorkouts`);

    return ref
      .orderByChild("level")
      .equalTo(level)
      .once("value")
      .then((snapshot) => {
        return snapshot.val() || [];
      });
  }

  function getUserCurrentWeek() {
    const ref = dataStore.ref(`${basePath()}`);
    return ref
      .child("currentWeek")
      .once("value")
      .then((snapshot) => snapshot.val());
  }

  function appendWeeklyProgram(userObj) {
    const { currentWeek, level } = userObj;
    return getProgramWithExercises(currentWeek, level).then(
      (programForWeek) => {
        return {
          ...userObj,
          weeklyProgram: programForWeek,
        };
      },
      (err) => console.log(err.stack)
    );
  }

  function getWeeklyProgram(level) {
    return getUserCurrentWeek()
      .then((week) => {
        return getProgram(week, level).then((programForWeek) =>
          mapTagsToExercises(programForWeek)
        );
      })
      .catch((err) => console.log(err.stack));
  }
  //******************************************************************************************* */

  function getMostRecentMeasurements(days) {
    const ref = dataStore.ref(`${basePath()}/measurements`);
    const today = Date.now();
    const milliseconds = days * 24 * 60 * 60 * 1000;
    const startDate = today - milliseconds;

    return ref
      .orderByChild("timeStamp")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() === null) return [];
        return Object.values(snapshot.val());
      });
  }

  function getUserLevel() {
    const ref = dataStore.ref(`${basePath()}`);
    return ref
      .child("level")
      .once("value")
      .then((snapshot) => snapshot.val());
  }

  function getAvatar() {
    const ref = dataStore.ref(`${basePath()}/avatar`);
    return ref.once("value").then((snapshot) => snapshot.val());
  }

  async function getUserWorkoutDataForWeek() {
    const [currentWeek, userLevel] = await Promise.all([
      getUserCurrentWeek(),
      getUserLevel(),
    ]);

    const [completedWorkouts, programForWeek] = await Promise.all([
      getUserCompletedWorkoutsForLevel(userLevel),
      getProgram(currentWeek, userLevel),
    ]);

    const completedWorkoutsForWeek = Object.values(completedWorkouts).filter(
      (workout) => workout.week === currentWeek
    );

    return Promise.resolve({
      completedWorkouts: completedWorkoutsForWeek,
      program: programForWeek,
    });
  }

  function getUserObj() {
    const ref = dataStore.ref(`${basePath()}`);

    return ref
      .once("value")
      .then(
        (snapshot) => snapshot.val(),
        (err) => console.log(err.stack)
      )
      .then((userObj) => appendWeeklyProgram(userObj));
  }

  function getGoals() {
    const ref = dataStore.ref(`${basePath()}/goals`);
    return ref.once("value").then((snapshot) => snapshot.val());
  }

  function updateAchievements(updates) {
    const ref = dataStore.ref(`${basePath()}/achievements`);

    return ref.update(validateAchievements(updates));
  }

  function onCompletedWorkoutsUpdate(fn) {
    const ref = dataStore.ref(`${basePath()}/completedWorkouts`);

    ref.on("child_added", fn);
  }

  function onMeasurementsUpdate(fn) {
    const ref = dataStore.ref(`${basePath()}/measurements`);

    ref.on("child_added", fn);
  }

  function onLevelChange(fn) {
    const ref = dataStore.ref(`${basePath()}/level`);

    ref.on("value", fn);
  }

  function onAvatarChange(fn) {
    const ref = dataStore.ref(`${basePath()}/avatar`);

    ref.on("value", fn);
  }

  function getWorkoutForChallenge() {
    const ref = dataStore
      .ref(`${basePath()}/challangeWorkoutDetails`)
      .orderByChild("createdAt");

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];
      return Object.values(snapshot.val());
    });
  }

  function saveWorkoutForChallenge(logData) {
    const ref = dataStore.ref(`${basePath()}/challangeWorkoutDetails`);
    return ref.push({
      createdAt: logData.createdAt,
      validPurchase: logData.validPurchase,
      workoutName: logData.name,
    });
  }

  function saveChallengeWorkout(logData) {
    const ref = dataStore.ref(`${basePath()}/springSlimDownChallenges`);
    return ref.push({
      createdAt: logData.createdAt,
      validPurchase: logData.validPurchase,
    });
  }

  function flagChallenge() {
    return getLatestChallenge().then((latestChallengeData) => {
      const ref = dataStore.ref(
        `${basePath()}/${latestChallengeData.challengeFlag}`
      );
      return ref.set(true);
    });
  }

  function getJoinedChallenge(challengeFlag) {
    const ref = dataStore.ref(`${basePath()}/${challengeFlag}`);
    return ref.once("value").then((snapshot) => snapshot.val());
  }

  async function setHasSeenHowItWorks(hasSeen) {
    const ref = dataStore.ref(`${basePath()}/hasSeenHowItWorks`);

    return ref.set(hasSeen);
  }

  async function getHasSeenHowItWorks() {
    const ref = dataStore.ref(`${basePath()}/hasSeenHowItWorks`);

    const snapshot = await ref.once("value");

    return snapshot.val();
  }

  return {
    getUserWorkoutDataForWeek,
    getMostRecentMeasurements,
    getCompletedWorkouts,
    getWorkoutForChallenge,
    getSweatLogs,
    getCompletedBonusChallenges,
    getAvatar,
    getUserObj,
    getUserLevel,
    getGoals,
    getWeeklyProgram,

    onLevelChange,
    onMeasurementsUpdate,
    onCompletedWorkoutsUpdate,
    onAvatarChange,

    updateUserData,
    updateAchievements,
    updateWeekAndLevel,
    updateLevel,
    saveLevel,
    saveWeek,
    saveMeasurement,
    updateMeasurement,
    saveCompletedWorkout,
    resetCompletedWorkout,
    saveSweatLog,
    saveBottleCount,
    saveBottleCountWithSize,
    saveSelfCareLog,
    saveBonusChallenge,
    saveWeight,
    saveWeightGoal,
    saveGoal,
    saveGoalsObj,
    savePurchase,
    flagChallenge,
    saveChallengeWorkout,
    saveWorkoutForChallenge,
    getJoinedChallenge,

    flushNotificationQueue,

    create,

    findById,

    setHasSeenHowItWorks,
    getHasSeenHowItWorks,
  };
}
