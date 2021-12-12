import { flow } from "lodash/fp";
import moment from "moment";

export default function (waterLog, userObj) {
  const { waterBottleLogs, goals, achievements } = userObj;
  const dailyWaterGoal = goals.dailyWaterIntake.target;

  return flow(
    checkWaterDailyGoal(waterLog, goals.dailyWaterIntake),
    checkOneWeekHydration(waterBottleLogs, dailyWaterGoal),
    checkWaterGoalTwo(waterLog, userObj),
    checkWaterGoalThree(waterLog, userObj)
  )(achievements);
}

const checkWaterDailyGoal = (waterLog, dailyWaterIntake) => achievements => {
  const { count } = waterLog;
  const { current, target } = dailyWaterIntake;
  const { didHitWaterDailyGoal }  = achievements;

  if (didHitWaterDailyGoal === true) { return achievements; }

  return {
    ...achievements,
    didHitWaterDailyGoal: current + count >= target
  };
};

const checkOneWeekHydration = (logs, dailyGoal) => achievements => {
  const { didHitOneWeekHydrationGoal, didHitWaterDailyGoal} = achievements;

  if (didHitOneWeekHydrationGoal === true || didHitWaterDailyGoal === false) { return achievements; }

  const weekChunks = chunkLogsByWeek(logs);
  const contiguousWeeks = weekChunks.filter(week => isContiguousWeek(week));

  for (let week of contiguousWeeks) {
    if (weekAtGoal(week, dailyGoal)) {
      return {
        ...achievements,
        didHitOneWeekHydrationGoal: true
      }
    }
  }

  return {
    ...achievements,
    didHitOneWeekHydrationGoal: false
  };
}

const checkWaterGoalTwo = (waterLog, userObj) => achievements => {
  const { didHitWaterGoalTwo, didHitWaterDailyGoal } = achievements;

  if (didHitWaterGoalTwo === true || didHitWaterDailyGoal === false) { return achievements; }

  const { bottleCount } = userObj;

  return {
    ...achievements,
    didHitWaterGoalTwo: (waterLog.count + bottleCount) % 4 >= 120
  };
}

const checkWaterGoalThree = (waterLog, userObj) => achievements => {
  const { didHitWaterGoalTwo, didHitWaterGoalThree } = achievements;

  if (didHitWaterGoalTwo === false || didHitWaterGoalThree === true) { return achievements; }

  const { bottleCount } = userObj;

  return {
    ...achievements,
    didHitWaterGoalTwo: (waterLog.count + bottleCount) % 4 >= 720
  };
}

const chunkLogsByWeek = logs => {
  let chunks = [];
  let p1 = 0;
  while (p1 < logs.length) {
    let p2 = p1 + 1;
    while (p2 < logs.length && daysPassed(logs[p1], logs[p2]) < 7) {
      p2++;
    }
    const chunk = logs.slice(p1, p2);
    chunks.push(chunk);
    p1 = p2;
  }

  return chunks;
};

const isContiguousWeek = week => {
  let weekDays = {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false
  };

  let count = 0;

  for (let log of week) {
    const day = (new Date(log.createdAt)).getDay();
    if (weekDays[day] === false) {
      count++;
      weekDays[day] = true;
    }
  }

  return count === 7;
}

const weekAtGoal = (weekLogs, dailyGoal) => {
  let p1 = 0;
  let daysAtGoal = 0;
  while (p1 < weekLogs.length) {
    let p2 = p1 + 1;
    let countForDay = weekLogs[p1].count;
    while (p2 < weekLogs.length && daysPassed(weekLogs[p1], weekLogs[p2]) < 1) {
      countForDay += weekLogs[p2].count;
      p2++;
    }
    if (countForDay >= dailyGoal) { daysAtGoal++; }
    p1 = p2;
  }

  return daysAtGoal === 7;
}

function daysPassed(logA, logB) {
  const { createdAt: t0 } = logA;
  const { createdAt: t1 } = logB;

  return Math.abs(moment(t0).diff(moment(t1), "days"));
}