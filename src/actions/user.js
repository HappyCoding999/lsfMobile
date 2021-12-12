import { maxBy } from "lodash";
import moment from "moment";

import {
  FETCHING_DATA,
  FETCHING_DATA_FAILURE,
  FETCHING_DATA_SUCCESS,
  INITIALIZE_USER_DATA,
  INITIALIZE_USER_DATA_SUCCESS,
  UPDATE_USER_DATA_SUCCESS,
  INITIALIZE_USER_DATA_FAILURE,
  GOAL_UPDATE,
  COMPLETED_WORKOUT_UPDATE,
  COMPLETED_WORKOUT_RESET,
  USER_LVL_UPDATE,
  UPDATE_WEEKLY_PROGRAM,
  UPDATE_WEEKLY_SCHEDULE,
  MAKE_PURCHASE,
  ADD_SWEAT_LOG,
  UPDATE_SWEAT_LOG,
  ADD_MEASUREMENT,
  UPDATE_MEASUREMENT,
  UPDATE_ACHIEVEMENT,
  BUMP_LEVEL,
  BUMP_WEEK,
  HISTORICAL_WEIGHT_UPDATE,
  COMPLETE_BONUS_CHALLENGE,
  USER_SSU_CHALLENGE_WORKOUT,
  SAVE_SSU_CHALLENGE,
  SAVE_CHALLENGE_FLAG,
  SAVE_CHALLENGE_WORKOUT,
  SAVE_WORKOUT_FOR_CHALLENGE,
  UPDATE_CHALLENGE_ACTIVE,
  UPDATE_JOINED_CHALLENGE,
} from "./types";

import {
  getWeeklyWorkoutSchedule,
  getWeeklyWorkoutScheduleAfterSkipWeek,
  skipWorkout as _skipWorkout,
  completeTodaysWorkout,
} from "../utils";
import { checkWeightGoals, checkWorkoutGoals } from "./goals";

const levelWeeks = {
  Beginner: 8,
  Intermediate: 24,
  Advanced: 24,
};

export default function (API) {
  const initUserData = () => {
    return (dispatch) => {
      dispatch({ type: INITIALIZE_USER_DATA });

      return API.getUserObj()
        .then((userObj) => {
          let user = {
            userName: userObj.username,
            level: userObj.level,
            email: userObj.email,
            currentWeek: userObj.currentWeek,
            avatar: userObj.avatar,
            name: userObj.name,
            lastname: userObj.lastname,
            goals: userObj.goals,
            achievements: userObj.achievements,
            measurements: userObj.measurements
              ? Object.values(userObj.measurements)
              : [],
            historicalWeight: userObj.weight
              ? Object.values(userObj.weight)
              : [],
            weeklyProgram: userObj.weeklyProgram,
            completedWorkouts: userObj.completedWorkouts
              ? Object.values(userObj.completedWorkouts)
              : [],
            challangeWorkoutDetails: userObj.challangeWorkoutDetails
              ? Object.values(userObj.challangeWorkoutDetails)
              : [],
            notificationQueue: userObj.notificationQueue || [],
            selfCareLogs: userObj.selfCareLogs
              ? Object.values(userObj.selfCareLogs)
              : [],
            sweatLogs: userObj.sweatLogs
              ? Object.values(userObj.sweatLogs)
              : [],
            completedBonusChallenges: userObj.completedBonusChallenges
              ? Object.values(userObj.completedBonusChallenges)
              : [],
            purchaseHistory: userObj.purchaseHistory
              ? Object.values(userObj.purchaseHistory)
              : [],

            ssuChallenges: userObj.ssuChallenges
              ? Object.values(userObj.ssuChallenges)
              : [],
            ssuChallenge:
              userObj.ssuChallenge == undefined ? false : userObj.ssuChallenge,

            bootyChallenge:
              userObj.bootyChallenge == undefined
                ? false
                : userObj.bootyChallenge,
            bootyChallenges: userObj.bootyChallenges
              ? Object.values(userObj.bootyChallenges)
              : [],

            sleighChallenge:
              userObj.sleighChallenge == undefined
                ? false
                : userObj.sleighChallenge,
            sleighChallenges: userObj.sleighChallenges
              ? Object.values(userObj.sleighChallenges)
              : [],

            refreshIn21Challenge:
              userObj.refreshIn21Challenge == undefined
                ? false
                : userObj.refreshIn21Challenge,
            refreshIn21Challenges: userObj.refreshIn21Challenges
              ? Object.values(userObj.refreshIn21Challenges)
              : [],

            lotsOfLoveChallenge:
              userObj.lotsOfLoveChallenge == undefined
                ? false
                : userObj.lotsOfLoveChallenge,
            lotsOfLoveChallenges: userObj.lotsOfLoveChallenges
              ? Object.values(userObj.lotsOfLoveChallenges)
              : [],

            springSlimDownChallenge:
              userObj.springSlimDownChallenge == undefined
                ? false
                : userObj.springSlimDownChallenge,
            springSlimDownChallenges: userObj.springSlimDownChallenges
              ? Object.values(userObj.springSlimDownChallenges)
              : [],
          };

          // reset weeks for redux state
          if (user.currentWeek > levelWeeks[user.level]) {
            user.currentWeek = 1;
          }

          // filter challenge logs
          user.filteredChallengeLogs = [
            ...user.bootyChallenges,
            ...user.sleighChallenges,
            ...user.refreshIn21Challenges,
            ...user.lotsOfLoveChallenges,
            ...user.springSlimDownChallenges,
          ].filter((log) => log.validPurchase == true);

          if (!userObj.onBoarded) {
            const err = {
              type: "USER_NOT_ONBOARDED",
              message: "user not onboarded",
            };
            return dispatch({
              type: INITIALIZE_USER_DATA_FAILURE,
              payload: { err },
            });
          }

          if (user.purchaseHistory.length === 0) {
            // return checkForAppStoreSubscription(dispatch, user);
            return getWeeklyWorkoutSchedule(user.weeklyProgram || [], true)
              .then((weeklyWorkoutSchedule) => ({
                ...user,
                weeklyWorkoutSchedule,
              }))
              .then((initialUserData) =>
                checkForAppStoreSubscription(initialUserData)
              )
              .then((userData) =>
                dispatch({
                  type: INITIALIZE_USER_DATA_SUCCESS,
                  payload: { user: userData },
                })
              );
          } else {
            return API.checkPurchaseHistory(user.purchaseHistory)
              .then((isValidPurchase) => {
                if (isValidPurchase) {
                  return { ...user, validPurchase: true };
                }

                return checkForAppStoreSubscription(user);
              })
              .then((userData) => {
                return getWeeklyWorkoutSchedule(user.weeklyProgram || [])
                  .then((weeklyWorkoutSchedule) => {
                    return { ...userData, weeklyWorkoutSchedule };
                  })
                  .then((initialUserData) => {
                    const tzOffset = moment().utcOffset();

                    // get now time
                    const localTime = moment().utcOffset(tzOffset).valueOf();

                    // start/end of week millisecond timestamp
                    var startOfTheWeek = moment()
                      .startOf("week")
                      .utcOffset(tzOffset);

                    // get monday 12:01AM of starting week to check if we need to reset our counter
                    const weeklyResetDateTime = startOfTheWeek
                      .add({ days: 1, minutes: 1 })
                      .valueOf();

                    // get timestamp
                    startOfTheWeek = startOfTheWeek.valueOf();

                    const { lastReset } = initialUserData.goals.weeklyWorkout;
                    const lastResetWithTz = moment(lastReset)
                      .utcOffset(tzOffset)
                      .valueOf();

                    // reset user weekly workout status if we are on a new week
                    // if last reset is before this current week and we are now in a new week after our reset time, then reset
                    if (
                      lastResetWithTz <= weeklyResetDateTime &&
                      localTime >= weeklyResetDateTime
                    ) {
                      const weeklyWorkout = {
                        target: 7,
                        lastReset: Date.now(),
                        current: 0,
                      };

                      // change user data object
                      initialUserData.goals.weeklyWorkout = weeklyWorkout;
                    }

                    // check reset of water bottle logs
                    const { lastReset: lastWaterReset } =
                      initialUserData.goals.dailyWaterIntake;

                    var shouldResetWaterGoal =
                      moment(Date.now())
                        .startOf("day")
                        .diff(moment(lastWaterReset).startOf("day"), "days") >=
                      1;

                    if (shouldResetWaterGoal) {
                      const waterGoal = {
                        target: 4,
                        current: 0,
                        lastReset: Date.now(),
                      };

                      initialUserData.goals.dailyWaterIntake = waterGoal;
                    }

                    return dispatch({
                      type: INITIALIZE_USER_DATA_SUCCESS,
                      payload: { user: initialUserData },
                    });
                  });
              });
          }
        })
        .catch((err) => {
          console.log(err.stack);
          dispatch({ type: INITIALIZE_USER_DATA_FAILURE, payload: { err } });
        });
    };
  };

  const checkChallengeDate = (
    challengeStartDate,
    challengeEndDate,
    challengeReady
  ) => {
    const start = moment(challengeStartDate).startOf("day").valueOf();
    const end = moment(challengeEndDate).endOf("day").valueOf();
    const currentTime = moment().valueOf();
    const challengeActive = currentTime >= start && currentTime <= end;

    return (dispatch) => {
      dispatch({
        type: UPDATE_CHALLENGE_ACTIVE,
        payload: { active: challengeReady && challengeActive },
      });
    };
  };

  const checkForAppStoreSubscription = (user) => {
    console.log("checkForAppStoreSubscription called");
    console.log(user);
    console.log("checkForAppStoreSubscription called --1");
    // return API.getAvailablePurchases()
    //   .then(resp => {
    //     console.log("checkForAppStoreSubscription called --3");
    //     console.log(resp)
    //   });
    // console.log("checkForAppStoreSubscription called --2");
    // return Promise.resolve(user);
    return API.getAvailablePurchases()
      .then((resp) => {
        console.log("checkForAppStoreSubscription called --3");
        maxBy(resp, (p) => p.transactionDate);
      })
      .then((latestReceipt) => {
        console.log("checkForAppStoreSubscription called 1");
        if (latestReceipt) {
          console.log("checkForAppStoreSubscription called 2");
          const {
            originalTransactionDateIOS,
            productId,
            transactionDate,
            transactionReceipt,
          } = latestReceipt;
          if (originalTransactionDateIOS) {
            const purchase = {
              platform: "ios",
              productId,
              transactionDate,
              transactionReceipt,
            };
            console.log("checkForAppStoreSubscription called 4");
            console.log(purchase);
            return API.checkPurchaseHistory([purchase]).then(
              (isValidPurchase) => {
                updatedUser = {
                  ...user,
                  validPurchase: isValidPurchase,
                  purchaseHistory: [purchase],
                };
                console.log("checkForAppStoreSubscription called 5");
                if (isValidPurchase) {
                  API.savePurchase(purchase).catch((err) =>
                    console.log(err.stack)
                  );
                }

                return Promise.resolve(updatedUser);
              }
            );
          }
        }
        console.log("checkForAppStoreSubscription called 3");
        return Promise.resolve(user);
      });
  };
  /*
  const saveBottleCount = (count,bottleSize) => {
    
    if (bottleSize != undefined) 
    {
          return dispatch => {
            API.saveBottleCountWithSize(count,bottleSize).catch(err => console.log(err.stack));
            const payload = {
              key: "dailyWaterIntakeWithSize",
              data: { count: count, bottoleOunces: bottleSize}
            };
            dispatch({ type: GOAL_UPDATE, payload });
          };

    }
    else
    {
      return dispatch => {
        API.saveBottleCount(count).catch(err => console.log(err.stack));
        const payload = {
          key: "dailyWaterIntake",
          data: { count }
        };

        dispatch({ type: GOAL_UPDATE, payload });
      };

    }
  }
  */
  const saveBottleCount = (count) => {
    return (dispatch) => {
      API.saveBottleCount(count).catch((err) => console.log(err.stack));
      const payload = {
        key: "dailyWaterIntake",
        data: { count },
      };

      dispatch({ type: GOAL_UPDATE, payload });
    };
  };

  const saveWeeklyWorkout = (payload) => {
    return (dispatch) => {
      dispatch({
        type: UPDATE_WEEKLY_SCHEDULE,
        weeklyWorkoutSchedule: payload,
      });
    };
  };

  const setHasSeenHowItWorks = () => {
    return async () => {
      try {
        await API.setHasSeenHowItWorks(true);
      } catch (e) {
        console.log("error saving hasSeenHowItWorks", e);
      }
    };
  };
  const updateUserData = (newUserData) => {
    return (dispatch, getState) => {
      const userDataTemp = getState().userData;
      const myUserData = {
        ...userDataTemp,
        userName: newUserData.username,
        name: newUserData.name,
        avatar: newUserData.avatar,
        lastname: newUserData.lastname,
      };

      const payload = { user: myUserData };
      try {
        dispatch({ type: UPDATE_USER_DATA_SUCCESS, payload });
      } catch (err) {
        console.log(err.stack);
      }
    };
  };
  const saveWeightGoal = (weightGoal) => {
    return (dispatch, getState) => {
      const { didSetGoal } = getState().userData.achievements;
      const payload = {
        key: "weight",
        data: { weight: weightGoal },
      };

      API.saveWeightGoal(weightGoal).catch((err) => console.log(err.stack));

      if (didSetGoal === false) {
        dispatch({ type: GOAL_UPDATE, payload });
        dispatch({ type: UPDATE_ACHIEVEMENT, payload: { didSetGoal: true } });
      } else {
        dispatch({ type: GOAL_UPDATE, payload });
      }
    };
  };

  const saveWeight = (weight, weightUnit) => {
    // const saveWeight = weight => {
    return (dispatch) => {
      const payload = {
        weight: {
          weight,
          createdAt: Date.now(),
        },
      };

      API.saveWeight(weight, weightUnit).catch((err) => console.log(err.stack));

      dispatch({ type: HISTORICAL_WEIGHT_UPDATE, payload });
    };
  };

  const skipWorkout = (workout) => {
    return (dispatch, getState) => {
      let userData = getState().userData;
      const { weeklyProgram, level } = userData;
      const maxWeeks = levelWeeks[level];

      return _skipWorkout(workout)
        .then(() => getWeeklyWorkoutSchedule(weeklyProgram))
        .then((weeklyWorkoutSchedule) => {
          // If there are still workouts this week
          if (weeklyWorkoutSchedule.today) {
            return dispatch({
              type: UPDATE_WEEKLY_SCHEDULE,
              payload: { weeklyWorkoutSchedule },
            });
          }

          // If this the current week doesn't match this workout, then fix it
          if (userData.currentWeek != workout.week) {
            userData.currentWeek = workout.week;
          }

          // If this is the last week of the program
          if (userData.currentWeek >= maxWeeks) {
            // return bumpLevel(userData, dispatch);

            var lvl = userData.level;
            if (lvl.toLowerCase() === "beginner") {
              lvl = "Intermediate";
            } else if (lvl.toLowerCase() === "intermediate") {
              lvl = "Advanced";
            }

            const updatedGoals = checkWorkoutGoals(workout, {
              ...userData,
              // currentWeek: 0,
              currentWeek: 1,
              level: lvl,
            });
            dispatch({
              type: GOAL_UPDATE,
              payload: { key: "weeklyWorkout", data: updatedGoals },
            });

            API.updateLevel({ lvl }).catch((err) => console.log(err.stack));

            return bumpWeek(
              { ...userData, currentWeek: 1, level: lvl },
              dispatch
            );
          }

          const updatedGoals = checkWorkoutGoals(workout, {
            ...userData,
            currentWeek: userData.currentWeek + 1,
          });

          dispatch({
            type: GOAL_UPDATE,
            payload: { key: "weeklyWorkout", data: updatedGoals },
          });
          API.saveGoalsObj(updatedGoals).catch((err) => console.log(err.stack));
          return bumpWeek(userData, dispatch);
        });
    };
  };

  const completeBonusChallenge = (bonusChallenge) => {
    return (dispatch) => {
      dispatch({
        type: COMPLETE_BONUS_CHALLENGE,
        payload: { completeBonusChallenge: bonusChallenge },
      });
    };
  };

  const skipToNextWeek = () => {
    return async (dispatch, getState) => {
      let userData = getState().userData;

      const { weeklyProgram, completedWorkouts, level } = userData;
      const newCompletedWorkouts = completedWorkouts;
      const maxWeeks = levelWeeks[level];
      if (userData.currentWeek >= maxWeeks) {
        var lvl = userData.level;
        if (lvl.toLowerCase() === "beginner") {
          lvl = "Intermediate";
        } else if (lvl.toLowerCase() === "intermediate") {
          lvl = "Advanced";
        }

        console.log("Level: " + lvl);

        skipRestWeek(
          { ...userData, completedWorkouts: [], currentWeek: 1, level: lvl },
          dispatch
        );
        userData.currentWeek = 1;
        userData.level = lvl;

        API.updateLevel({ lvl }).catch((err) => console.log(err.stack));
      } else {
        skipRestWeek(
          {
            ...userData,
            completedWorkouts: [],
            currentWeek: userData.currentWeek + 1,
          },
          dispatch
        );
        // userData.currentWeek++;
        userData.currentWeek = userData.currentWeek + 1;
      }

      const updatedGoals = checkWorkoutGoals([], userData);
      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "weeklyWorkout", data: updatedGoals },
      });
      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "workoutStreak", data: updatedGoals },
      });

      API.saveGoalsObj(updatedGoals).catch((err) => console.log(err.stack));
    };
  };

  const restartLevel = (completedWorkouts) => {
    return async (dispatch, getState) => {
      let userData = getState().userData;

      // console.log(
      //   "completedWorkouts: " + JSON.stringify(userData.completedWorkouts)
      // );

      // var completedWorkouts = userData.completedWorkouts;

      for (let i = 0; i < completedWorkouts.length; i++) {
        if (
          completedWorkouts[i]["level"].toLowerCase() ===
          userData.level.toLowerCase()
        ) {
          completedWorkouts[i]["flag"] = false;

          API.resetCompletedWorkout(completedWorkouts[i]["createdAt"]).catch(
            (err) => console.log(err.stack)
          );
        }
      }

      // console.log("completedWorkouts: " + JSON.stringify(completedWorkouts));

      skipRestWeek(
        { ...userData, completedWorkouts: completedWorkouts, currentWeek: 1 },
        dispatch
      );
      userData.currentWeek = 1;

      const updatedGoals = checkWorkoutGoals([], userData);

      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "weeklyWorkout", data: updatedGoals },
      });
      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "workoutStreak", data: updatedGoals },
      });
      dispatch({ type: COMPLETED_WORKOUT_RESET, payload: completedWorkouts });
      API.saveGoalsObj(updatedGoals).catch((err) => console.log(err.stack));
    };
  };

  const skipRestWeek = (userData, dispatch) => {
    const { level, currentWeek, completedWorkouts } = userData;
    // alert("Skipping week to " + currentWeek);
    API.saveWeek(currentWeek).catch((err) => console.log(err.stack));
    return API.getProgramWithExercises(currentWeek, level)
      .then((_weeklyProgram) => {
        dispatch({
          type: UPDATE_WEEKLY_PROGRAM,
          payload: { weeklyProgram: _weeklyProgram },
        });
        getWeeklyWorkoutScheduleAfterSkipWeek(_weeklyProgram, true).then(
          (_weeklyWorkoutSchedule) => {
            dispatch({
              type: UPDATE_WEEKLY_SCHEDULE,
              payload: { weeklyWorkoutSchedule: _weeklyWorkoutSchedule },
            });
          }
        );
      })
      .catch((err) => console.log(err.stack));
  };

  const bumpWeek = (userData, dispatch) => {
    // const { level, currentWeek, completedWorkouts } = userData;
    const { level, currentWeek } = userData;
    // dispatch({ type: BUMP_WEEK });

    API.saveWeek(currentWeek + 1).catch((err) => console.log(err.stack));
    return API.getProgramWithExercises(currentWeek + 1, level)
      .then((_weeklyProgram) => {
        console.log(_weeklyProgram);
        dispatch({
          type: UPDATE_WEEKLY_PROGRAM,
          payload: { weeklyProgram: _weeklyProgram },
        });
        getWeeklyWorkoutSchedule(_weeklyProgram).then(
          (_weeklyWorkoutSchedule) => {
            console.log(_weeklyWorkoutSchedule);
            dispatch({
              type: UPDATE_WEEKLY_SCHEDULE,
              payload: { weeklyWorkoutSchedule: _weeklyWorkoutSchedule },
            });
          }
        );
      })
      .catch((err) => console.log(err.stack));
  };

  const saveCompletedWorkout = (workout) => {
    return async (dispatch, getState) => {
      const newWorkout = { ...workout, createdAt: Date.now(), flag: true };
      const payload = { workout: newWorkout };
      // save completed workouts before getting user state in order to correctly track completed workouts
      dispatch({ type: COMPLETED_WORKOUT_UPDATE, payload });

      let userData = getState().userData;

      const { weeklyProgram, completedWorkouts, level } = userData;

      var dummy = [];
      var newCompletedWorkouts = [];

      if (
        completedWorkouts == undefined ||
        completedWorkouts == null ||
        completedWorkouts.length <= 0
      ) {
        newCompletedWorkouts = dummy.push(newWorkout);
      } else if (Array.isArray(completedWorkouts)) {
        newCompletedWorkouts = completedWorkouts.concat(newWorkout);
      } else {
        newCompletedWorkouts = dummy.push(newWorkout);
      }

      // alert(
      //   "completedWorkouts: " +
      //     completedWorkouts.length.toString() +
      //     "\n\n" +
      //     "newCompletedWorkouts: " +
      //     newCompletedWorkouts.length.toString()
      // );

      // newCompletedWorkouts =
      //   completedWorkouts == undefined ||
      //   completedWorkouts == null ||
      //   completedWorkouts.length <= 0
      //     ? dummy.push(newWorkout)
      //     : Array.isArray(completedWorkouts)
      //     ? completedWorkouts.concat(newWorkout)
      //     : dummy.push(newWorkout);

      // If this the current week doesn't match this workout, then fix it
      if (userData.currentWeek != workout.week) {
        userData.currentWeek = workout.week;
      }
      if (workout.isToday) {
        await completeTodaysWorkout();
      }
      const weeklyWorkoutSchedule = await getWeeklyWorkoutSchedule(
        weeklyProgram
      );

      const { today } = weeklyWorkoutSchedule;

      var len = 0;
      var days = [];

      try {
        // len = completedWorkouts.filter((e) => e.flag).length;

        for (let i = 0; i < completedWorkouts.length; i++) {
          var e = completedWorkouts[i];
          if (
            e.flag &&
            e.week === userData.currentWeek &&
            days.indexOf(e.day) == -1
          ) {
            days.push(e.day);
            len += 1;
          }
        }

        len = len === undefined || len === null || len === 0 ? 1 : len;

        // alert(
        //   "Save:\n\nLength: " +
        //     len.toString() +
        //     "\n\nDays: " +
        //     JSON.stringify(days) +
        //     "\n\n\nWeek: " +
        //   userData.currentWeek
        // );
      } catch (ex) {
        len = 1;
      }

      // If there are no workouts this week
      // if (!today || workout.day == 7) {
      // if (workout.day == 7) {
      // if (completedWorkouts.length % 7 == 0) {

      // COMMENTED - week should not change after 7 workouts done
      // if (len == 7) {
      //   const maxWeeks = levelWeeks[level];

      //   if (userData.currentWeek >= maxWeeks) {
      //     var lvl = userData.level;
      //     if (lvl.toLowerCase() === "beginner") {
      //       lvl = "Intermediate";
      //     } else if (lvl.toLowerCase() === "intermediate") {
      //       lvl = "Advanced";
      //     }

      //     bumpWeek(
      //       {
      //         ...userData,
      //         completedWorkouts: newCompletedWorkouts,
      //         // currentWeek: 0,
      //         currentWeek: 1,
      //         level: lvl,
      //       },
      //       dispatch
      //     );
      //     userData.currentWeek = 1;
      //     userData.level = lvl;

      //     API.updateLevel({ lvl }).catch((err) => console.log(err.stack));
      //   } else {
      //     bumpWeek(
      //       {
      //         ...userData,
      //         completedWorkouts: newCompletedWorkouts,
      //       },
      //       dispatch
      //     );
      //     userData.currentWeek++;
      //   }
      // }

      const updatedGoals = checkWorkoutGoals(workout, userData);

      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "weeklyWorkout", data: updatedGoals },
      });
      dispatch({
        type: GOAL_UPDATE,
        payload: { key: "workoutStreak", data: updatedGoals },
      });
      // dispatch({
      //   type: UPDATE_WEEKLY_SCHEDULE,
      //   payload: { weeklyWorkoutSchedule },
      // });

      API.saveGoalsObj(updatedGoals).catch((err) => console.log(err.stack));
      API.saveCompletedWorkout(workout).catch((err) => console.log(err.stack));
    };
  };

  const saveChallengeWorkout = (logData) => {
    return (dispatch) => {
      return API.saveChallengeWorkout(logData)
        .then(() => {
          dispatch({
            type: SAVE_CHALLENGE_WORKOUT,
            payload: {
              challenge: {
                createdAt: logData.createdAt,
                validPurchase: logData.validPurchase,
              },
            },
          });
        })
        .catch((err) => console.log("Challenge Workout Log Error: ", err));
    };
  };

  const saveWorkoutForChallenge = (logData) => {
    return (dispatch) => {
      return API.saveWorkoutForChallenge(logData)
        .then(() => {
          dispatch({
            type: SAVE_WORKOUT_FOR_CHALLENGE,
            payload: {
              challengeWorkout: {
                createdAt: logData.createdAt,
                validPurchase: logData.validPurchase,
                workoutName: logData.name,
              },
            },
          });
        })
        .catch((err) => console.log("Challenge Workout Log Error: ", err));
    };
  };

  const flagChallenge = () => {
    return (dispatch) => {
      return API.getLatestChallenge().then((latestData) => {
        return API.flagChallenge().then(() => {
          // saves challenge flag from latest challenge data in db
          dispatch({
            type: SAVE_CHALLENGE_FLAG,
            payload: { challengeData: latestData },
          });
        });
      });
    };
  };

  const saveLevel = (level) => {
    return (dispatch) => {
      const payload = { level };

      API.updateWeekAndLevel({ week: 1, level }).catch((err) =>
        console.log(err.stack)
      );

      dispatch({ type: USER_LVL_UPDATE, payload });
      dispatch({ type: FETCHING_DATA });

      return API.getProgramWithExercises(1, level)
        .then((weeklyProgram) => {
          dispatch({ type: FETCHING_DATA_SUCCESS });
          dispatch({ type: UPDATE_WEEKLY_PROGRAM, payload: { weeklyProgram } });

          // set new workout schedule in state and override cache
          return getWeeklyWorkoutSchedule(weeklyProgram, true).then(
            (weeklyWorkoutSched) => {
              dispatch({
                type: UPDATE_WEEKLY_SCHEDULE,
                payload: { weeklyWorkoutSchedule: weeklyWorkoutSched },
              });
            }
          );
        })
        .catch((err) => {
          console.log(err.stack);
          dispatch({ type: FETCHING_DATA_FAILURE, payload: { err } });
        });
    };
  };

  const savePurchase = (purchase) => {
    return (dispatch) => {
      API.savePurchase(purchase).catch((err) => console.log(err.stack));

      dispatch({ type: MAKE_PURCHASE, payload: { purchase } });
    };
  };

  const saveSweatLog = (sweatLog) => {
    console.log("saveSweatLog::::=- 2: " + JSON.stringify(sweatLog));
    return (dispatch) => {
      API.saveSweatLog(sweatLog).catch((err) => console.log(err.stack));

      if (sweatLog.createdAt != undefined && sweatLog.createdAt != "") {
        dispatch({
          type: UPDATE_SWEAT_LOG,
          payload: { sweatLogUpdate: sweatLog },
        });
      } else {
        const newSweatLog = { ...sweatLog, createdAt: Date.now() };
        dispatch({ type: ADD_SWEAT_LOG, payload: { sweatLog: newSweatLog } });
      }
    };
  };

  const updateMeasurement = (measurements) => {
    return (dispatch, getState) => {
      try {
        API.updateMeasurement(measurements).catch((err) =>
          console.log(err.stack)
        );
        dispatch({
          type: UPDATE_MEASUREMENT,
          payload: { measurementsArray: measurements },
        });
      } catch (err) {
        console.log(err.stack);
      }
    };
  };
  const saveMeasurement = (measurement) => {
    return (dispatch, getState) => {
      try {
        const newMeasurement = { ...measurement, createdAt: Date.now() };
        const { goals, newHistoricalWeight } = checkWeightGoals(
          newMeasurement,
          getState().userData
        );
        API.saveMeasurement(measurement).catch((err) => console.log(err.stack));

        if (goals) {
          API.saveGoalsObj(goals).catch((err) => console.log(err.stack));
          dispatch({
            type: GOAL_UPDATE,
            payload: { key: "weight", data: goals },
          });
        }

        if (newHistoricalWeight) {
          API.saveWeight(newHistoricalWeight);
        }

        dispatch({
          type: ADD_MEASUREMENT,
          payload: { measurement: newMeasurement },
        });
      } catch (err) {
        console.log(err.stack);
      }
    };
  };

  const setJoinedChallenge = (flag) => {
    return (dispatch) => {
      dispatch({ type: UPDATE_JOINED_CHALLENGE, payload: { flag: flag } });
    };
  };

  return {
    initUserData,
    updateUserData,
    saveBottleCount,
    saveWeeklyWorkout,
    saveCompletedWorkout,
    saveLevel,
    savePurchase,
    saveSweatLog,
    saveMeasurement,
    updateMeasurement,
    saveWeightGoal,
    saveWeight,
    skipWorkout,
    skipToNextWeek,
    restartLevel,
    completeBonusChallenge,
    flagChallenge,
    saveChallengeWorkout,
    saveWorkoutForChallenge,
    checkChallengeDate,
    setJoinedChallenge,
    setHasSeenHowItWorks,
  };
}

function getNextLevel(level) {
  return {
    Beginner: "Intermediate",
    Intermediate: "Advanced",
    Advanced: "Advanced",
  }[level];
}
