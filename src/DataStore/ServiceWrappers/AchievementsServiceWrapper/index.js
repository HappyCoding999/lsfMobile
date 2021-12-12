import workoutAchievements from "./workoutAchievements";
import measurementAchievements from "./measurementAchievements";
import selfCareAchievements from "./selfCareAchievements";
import hydrationAchievements from "./hydrationAchievements";
import bonusChallengeAchievements from "./bonusChallengeAchievements";
import featuredChallengeAchievements from "./featuredChallengeAchievements";
import sweatLogAchievements from "./sweatLogAchievements";

export default function (API, dataStore) {
  const { getCurrentUser, getAchievements } = dataStore;
  const basePath = () => {
    const user = getCurrentUser();
    if (user) {
      return `users/${user.uid}`;
    }

    throw new Error("Current user not present. Something went wrong.");
  };

  function addAchievementsToNotificationQueue(userObj, achievements) {
    const notificationQueue = userObj.notificationQueue || [];
    const ref = dataStore.ref(`${basePath()}/notificationQueue`);

    return ref.set([...notificationQueue, ...achievements]);
  }

  function filterNewAchievements(previousAchievements, newAchievements) {
    let filtered = {};
    let newAchievementPresent = false;

    for (let achievement in newAchievements) {
      if (newAchievements[achievement] === true && previousAchievements[achievement] === false) {
        filtered[achievement] = true;
        newAchievementPresent = true;
      }
    }

    return newAchievementPresent ? filtered : null;
  }

  function pushToNotificationQueue(userObj, newAchievements) {

    return getAchievements()
      .then(achievementObjects => {
        const notifications = achievementObjects.filter(achievement => newAchievements[achievement.achievementsField]);

        return addAchievementsToNotificationQueue(userObj, notifications);
      });
  }

  function saveCompletedWorkout(workout, userObj) {
    const { completedWorkouts, achievements } = userObj;
    const workouts = Object.values(completedWorkouts || {}).concat({ ...workout, createdAt: Date.now() });
    const achievementUpdates = workoutAchievements(workouts, achievements);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  function saveBonusChallenge(bonusChallenge, userObj) {
    const { achievements } = userObj;
    const achievementUpdates = bonusChallengeAchievements(bonusChallenge, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  function saveCompletedFeaturedChallenge(challenge, userObj) {
    const achievementUpdates = featuredChallengeAchievements(challenge, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  function saveMeasurement(measurement, userObj) {
    const { achievements } = userObj;
    const achievementUpdates = measurementAchievements(measurement, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  function saveBottleCount(count, userObj) {
    const { goals, achievements } = userObj;
    const { dailyWaterIntake } = goals;
    const { target, current } = dailyWaterIntake;

    if (achievements.didHitWaterDailyGoal) {
      return Promise.resolve(count);
    }

    const achievementUpdates = hydrationAchievements({ count, createdAt: Date.now() }, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates);
      // return API.updateAchievements({
      //   ...achievementUpdates,
      //   didHitWaterDailyGoal: target >= current + count
      // }).then(() => count);
    }

    return Promise.resolve();
  }

  function saveWeightGoal(goal, userObj) {
    const { achievements } = userObj;
    const { target } = goal;
    const { didSetGoal } = achievements;

    if (didSetGoal) {
      return Promise.resolve(goal);
    }

    const achievementUpdates = { didSetGoal: target !== null };
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));
      return API.updateAchievements(achievementUpdates)
        .then(() => goal);
    }

    return Promise.resolve();
  }

  function saveSelfCareLog(log, userObj) {
    const { achievements } = userObj;
    const achievementUpdates = selfCareAchievements(log, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));

      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  function saveSweatLog(log, userObj) {
    const { achievements } = userObj;
    const achievementUpdates = sweatLogAchievements(log, userObj);
    const newAchievements = filterNewAchievements(achievements, achievementUpdates);

    if (newAchievements) {
      pushToNotificationQueue(userObj, newAchievements).catch(err => console.log(err.stack));

      return API.updateAchievements(achievementUpdates);
    }

    return Promise.resolve();
  }

  const wrappers = {
    saveCompletedWorkout,
    saveMeasurement,
    saveWeightGoal,
    saveBottleCount,
    saveSelfCareLog,
    saveSweatLog,
    saveBonusChallenge,
    saveCompletedFeaturedChallenge
  };

  return {
    ...wrappers
  };
};