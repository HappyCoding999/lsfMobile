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
  MAKE_PURCHASE,
  ADD_SWEAT_LOG,
  UPDATE_SWEAT_LOG,
  ADD_MEASUREMENT,
  UPDATE_MEASUREMENT,
  UPDATE_ACHIEVEMENT,
  COMPLETE_BONUS_CHALLENGE,
  BUMP_LEVEL,
  BUMP_WEEK,
  HISTORICAL_WEIGHT_UPDATE,
  UPDATE_WEEKLY_SCHEDULE,
  SAVE_CHALLENGE_FLAG,
  SAVE_CHALLENGE_WORKOUT,
  SAVE_WORKOUT_FOR_CHALLENGE,
  UPDATE_CHALLENGE_ACTIVE,
  UPDATE_JOINED_CHALLENGE,
  CHALLENGE_WORKOUT_DETAILS,
  SELECTED_TAB_INDEX,
} from "../actions/types";

const initialState = {
  userName: "",
  level: "",
  avatar: "",
  name: "",
  lastname: "",
  goals: null,
  achievements: null,
  measurements: [],
  historicalWeight: [],
  weeklyProgram: [],
  completedWorkouts: [],
  notificationQueue: [],
  selfCareLogs: [],
  quote: "",
  sweatLogs: [],
  completedBonusChallenges: [],
  challangeWorkoutDetails: [],
  purchaseHistory: [],
  error: null,
  isFetching: false,
  initializing: false,
  initialized: false,
  validPurchase: false,
  currentWeek: 1,
  weeklyWorkoutSchedule: {},
  // challenge information
  challengeActive: false,
  filteredChallengeLogs: [],
  joinedChallenge: false,

  bootyChallenge: null,
  bootyChallenges: [],

  sleighChallenge: null,
  sleighChallenges: [],

  refreshIn21Challenge: null,
  refreshIn21Challenges: [],

  lotsOfLoveChallenge: null,
  lotsOfLoveChallenges: [],

  springSlimDownChallenge: null,
  springSlimDownChallenges: [],

  selected_tab_index: 0,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_USER_DATA:
      return {
        ...initialState,
        initializing: true,
      };

    case INITIALIZE_USER_DATA_SUCCESS:
      return {
        ...initialState,
        ...action.payload.user,
        initializing: false,
        initialized: true,
      };
    case UPDATE_USER_DATA_SUCCESS:
      return {
        ...action.payload.user,
      };
    case INITIALIZE_USER_DATA_FAILURE:
      return {
        ...initialState,
        error: action.payload.err,
        initializing: false,
        initialized: false,
      };

    case FETCHING_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case FETCHING_DATA_FAILURE:
      return {
        ...state,
        error: action.payload.err,
        isFetching: false,
      };

    case FETCHING_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
      };

    case GOAL_UPDATE:
      const { payload } = action;
      const { goals } = state;

      return {
        ...state,
        goals: updateGoal(goals, { type: payload.key, payload: payload.data }),
      };

    case COMPLETED_WORKOUT_UPDATE:
      const { workout } = action.payload;
      const { completedWorkouts } = state;

      if (
        completedWorkouts == undefined ||
        completedWorkouts == null ||
        !Array.isArray(completedWorkouts) ||
        completedWorkouts.length <= 0
      ) {
        var temp = [];
        temp.push(workout);

        // alert("1. " + JSON.stringify(temp));

        return {
          ...state,
          completedWorkouts: temp,
        };
      } else {
        // alert("2. " + JSON.stringify(completedWorkouts.concat(workout)));

        return {
          ...state,
          completedWorkouts: completedWorkouts.concat(workout),
        };
      }

    case COMPLETED_WORKOUT_RESET:
      return {
        ...state,
        completedWorkouts: action.payload,
      };

    case USER_LVL_UPDATE:
      const { level } = action.payload;
      return {
        ...state,
        level,
      };

    case UPDATE_WEEKLY_PROGRAM:
      const { weeklyProgram } = action.payload;
      return {
        ...state,
        weeklyProgram,
      };

    case UPDATE_WEEKLY_SCHEDULE:
      const { weeklyWorkoutSchedule } = action.payload;
      return {
        ...state,
        weeklyWorkoutSchedule,
      };

    case HISTORICAL_WEIGHT_UPDATE:
      const { weight } = action.payload;
      const { historicalWeight } = state;
      return {
        ...state,
        historicalWeight: historicalWeight.concat(weight),
      };

    case MAKE_PURCHASE:
      const { purchase } = action.payload;
      const { purchaseHistory } = state;
      return {
        ...state,
        purchaseHistory: purchaseHistory.concat(purchase),
        validPurchase: true,
      };
    case UPDATE_SWEAT_LOG: {
      const { sweatLogUpdate } = action.payload;
      const { sweatLogs } = state;
      return {
        ...state,
        sweatLogs:
          sweatLogs.length > 0
            ? sweatLogs.concat(sweatLogUpdate)
            : [sweatLogUpdate],
      };
    }
    case ADD_SWEAT_LOG: {
      const { sweatLog } = action.payload;
      const { sweatLogs } = state;
      return {
        ...state,
        sweatLogs: sweatLogs.concat(sweatLog),
      };
    }
    case ADD_MEASUREMENT:
      const { measurement } = action.payload;
      const { measurements } = state;
      return {
        ...state,
        measurements: measurements.concat(measurement),
      };

    case UPDATE_MEASUREMENT:
      const { measurementsArray } = action.payload;
      return {
        ...state,
        measurements: measurementsArray,
      };

    case UPDATE_ACHIEVEMENT:
      const { achievements } = state;
      const update = action.payload;
      return {
        ...state,
        achievements: { ...achievements, ...update },
      };

    case COMPLETE_BONUS_CHALLENGE:
      const { completedBonusChallenges } = state;
      const { completeBonusChallenge } = action.payload;
      return {
        ...state,
        completedBonusChallenges: [
          ...completedBonusChallenges,
          completeBonusChallenge,
        ],
      };

    case BUMP_WEEK:
      const { currentWeek } = state;
      return {
        ...state,
        currentWeek: currentWeek + 1,
      };

    case BUMP_LEVEL:
      return {
        ...state,
        level: getNextLevel(state.level),
        currentWeek: 1,
      };

    case SAVE_WORKOUT_FOR_CHALLENGE:
      const { challengeWorkout } = action.payload;
      const { challangeWorkoutDetails } = state;
      return {
        ...state,
        challangeWorkoutDetails: challangeWorkoutDetails.concat({
          createdAt: challengeWorkout.createdAt,
          validPurchase: challengeWorkout.validPurchase,
          workoutName: challengeWorkout.name,
        }),
      };
    case SAVE_CHALLENGE_WORKOUT:
      let {
        filteredChallengeLogs,
        bootyChallenges,
        sleighChallenges,
        refreshIn21Challenges,
        lotsOfLoveChallenges,
        springSlimDownChallenges,
      } = state;
      const { challenge } = action.payload;
      const filteredLogs = filterLogs([challenge]);

      return {
        ...state,
        springSlimDownChallenges: springSlimDownChallenges.concat({
          createdAt: challenge.createdAt,
          validPurchase: challenge.validPurchase,
        }),
        filteredChallengeLogs: filteredChallengeLogs.concat(filteredLogs),
      };

    case SAVE_CHALLENGE_FLAG:
      // challenge flag used from DB and saved for challenge saves
      const { challengeData } = action.payload;

      return {
        ...state,
        [challengeData.challengeFlag]: true,
        joinedChallenge: true,
      };

    case UPDATE_CHALLENGE_ACTIVE:
      return {
        ...state,
        challengeActive: action.payload.active,
      };

    case UPDATE_JOINED_CHALLENGE:
      console.log("UPDATE_JOINED_CHALLENGE called");
      console.log("payload ", action.payload.flag);

      return {
        ...state,
        joinedChallenge: action.payload.flag,
      };

    // case CHALLENGE_WORKOUT_DETAILS:
    //   return {
    //     ...state,
    //     challangeWorkoutDetails: action.payload,
    //   };

    case SELECTED_TAB_INDEX:
      return {
        ...state,
        selected_tab_index: action.payload,
      };

    default:
      return state;
  }
}

function filterLogs(challengeLogs) {
  return challengeLogs.filter((log) => log.validPurchase == true);
}

function getNextLevel(level) {
  return {
    Beginner: "Intermediate",
    Intermediate: "Advanced",
    Advanced: "Beginner",
  }[level];
}

function updateGoal(goals, action) {
  // alert(JSON.stringify(action) + "\n\n" + JSON.stringify(goals));

  switch (action.type) {
    case "dailyWaterIntake":
      const { count } = action.payload;
      const { dailyWaterIntake } = goals;
      const { target, current, lastReset } = dailyWaterIntake;
      const newCurrent = count + current;

      return {
        ...goals,
        dailyWaterIntake: {
          target,
          current: newCurrent,
          lastReset,
        },
      };

    case "weight":
      const { weight } = action.payload;

      return {
        ...goals,
        weight,
      };

    case "weeklyWorkout":
      const { weeklyWorkout } = action.payload;
      return {
        ...goals,
        weeklyWorkout,
      };

    case "workoutStreak":
      const { workoutStreak } = action.payload;
      return {
        ...goals,
        workoutStreak,
      };

    default:
      return goals;
  }
}
