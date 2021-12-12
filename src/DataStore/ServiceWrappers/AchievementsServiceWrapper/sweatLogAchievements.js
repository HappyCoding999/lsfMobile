import { flow, sortBy } from "lodash/fp";

export default function(sweatLog, userObj) {
  const { achievements, sweatLogs } = userObj;
  const logs = sweatLogs ? Object.values(sweatLogs) : []
  const sortedLogs = sortBy(log => log.createdAt)(logs).concat(sweatLog);

  return flow(
    checkSweatLogText(sortedLogs),
    checkWorkoutDifficulty(sortedLogs),
    checkTreat(sortedLogs),
    checkBadDays(sortedLogs),
    checkLowEffort(sortedLogs),
    checkTenGoodDays(sortedLogs),
    checkTwentyFiveGoodDays(sortedLogs),
    checkTwentySweatLogs(sortedLogs),
    checkSelfCareStreak(sortedLogs)    
  )(achievements)
}

const checkSweatLogText = logs => achievements => {
  const { didAddTextToSweatLog } = achievements;

  if (didAddTextToSweatLog === false) {
    let notesCount = logs.reduce((count, log) => {
      if (log.notes.length > 0) {
        return count + 1;
      }

      return count
    }, 0);

    return {
      ...achievements,
      didAddTextToSweatLog: notesCount >= 5
    };
  }

  return achievements;
};

const checkWorkoutDifficulty = logs => achievements => {
  const { didLogFiveDifficultWorkouts } = achievements;

  if (didLogFiveDifficultWorkouts === false) {
    const count = logs.reduce((accum, log) => {
      if (log.effort > 0.5) {
        return accum + 1;
      }

      return accum;
    }, 0);

    return {
      ...achievements,
      didLogFiveDifficultWorkouts: count >= 5
    };
  }

  return achievements;
}

const checkTreat = logs => achievements => {
  const { didLogTreatFifteenTimes } = achievements;

  if (didLogTreatFifteenTimes === true) { return achievements; }

  const count = logs.reduce((accum, log) => {
    if (log.selfCare.split(",").some(word => word === "treat")) {
      return accum + 1;
    }

    return accum
  }, 0);

  return {
    ...achievements,
    didLogTreatFifteenTimes: count >= 15
  }
};

const checkBadDays = logs => achievements => {
  const { didLogTenBadDays } = achievements;

  if (didLogTenBadDays === true) { return achievements; }

  const count = logs.reduce((accum, log) => {
    if (log.felt < 0.5) {
      return accum + 1;
    }

    return accum;
  }, 0);

  return {
    ...achievements,
    didLogTenBadDays: count >= 10
  };
}

const checkLowEffort = logs => achievements => {
  const { didLogThreeLowEfforts } = achievements;

  if (didLogThreeLowEfforts === true) { return achievements; }

  const count = logs.reduce((accum, log) => {
    if (log.effort < 0.5) {
      accum + 1;
    }

    accum;
  }, 0);

  return {
    ...achievements,
    didLogThreeLowEfforts: count >= 3
  };
};

const checkTenGoodDays = logs => achievements => {
  const { didLogTenGoodDays } = achievements;
  
  if (didLogTenGoodDays === true) { return achievements; }

  const count = logs.reduce((accum, log) => {
    if (log.felt > 0.5) {
      return accum + 1;
    }

    return accum;
  }, 0);

  return {
    ...achievements,
    didLogTenGoodDays: count >= 10
  };
};

const checkTwentyFiveGoodDays = logs => achievements => {
  const { didLogTenGoodDays, didLogTwentyFiveGoodDays } = achievements;

  if ( didLogTenGoodDays === false || didLogTwentyFiveGoodDays === true) { return achievements; }

  const count = logs.reduce((accum, log) => {
    if (log.felt > 0.5) {
      accum + 1;
    }

    return accum;
  }, 0);

  return {
    ...achievements,
    didLogTwentyFiveGoodDays: count >= 25
  };
};

const checkTwentySweatLogs = logs => achievements => {
  const { didTwentyConsecutiveSweatLogs } = achievements;

  if (didTwentyConsecutiveSweatLogs === true) { return achievements; }

  return {
    ...achievements,
    didTwentyConsecutiveSweatLogs: logs.length >= 20
  };
}

const checkSelfCareStreak = logs => achievements => {
  const { didHitSelfCareStreak } = achievements;

  if (didHitSelfCareStreak === true || logs.length < 15) { return achievements; }

  const streak = logs.reduce((accum, log) => {
    if (accum >= 15) { return accum; }

    if (log.selfCare.length > 0) {
      return accum + 1;
    } else {
      return 0;
    }
  }, 0);

  return {
    ...achievements,
    didHitSelfCareStreak: streak >= 15
  };
};