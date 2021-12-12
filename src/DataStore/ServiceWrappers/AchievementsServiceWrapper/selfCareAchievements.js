import { flow } from "lodash/fp";

export default function (log, userObj) {
  const { achievements } = userObj;

  return flow(
    checkCustomSelfCareLog(log),
    checkTenConsecutiveSelfCareLogs(userObj),
    checkFriendTime(userObj)
  )(achievements);
}

const checkCustomSelfCareLog = log => achievements => {
  const availableActivities = {
    "EXERCISE": true,
    "FRIEND TIME": true,
    "TREAT": true,
    "FACE MASK": true,
    "NEW OUTFIT": true,
    "TIME OUTSIDE": true
  };

  const { didEnterCustomSelfCareLog } = achievements;

  if (didEnterCustomSelfCareLog === false) {
    const { activities } = log;
    return {
      ...achievements,
      didEnterCustomSelfCareLog: activities.split(",").some(a => !availableActivities[a])
    };
  }

  return achievements;
}

const checkTenConsecutiveSelfCareLogs = userObj => achievements => {
  const { didTenConsecutiveSelfcare } = achievements;
  const { selfCareLogs } = userObj;

  if (selfCareLogs && didTenConsecutiveSelfcare === false) {
    return {
      ...achievements,
      didTenConsecutiveSelfcare: Object.keys(selfCareLogs).length + 1 >= 10
    };
  }

  return achievements;
};

const checkFriendTime = userObj => achievements => {
  const { didFriendTimeTenTimes } = achievements;
  const { selfCareLogs } = userObj;

  if (selfCareLogs && didFriendTimeTenTimes === false) {
    const count = Object.values(selfCareLogs).reduce((accum, log) => {
      const { activities } = log;
      if (activities.split(",").some(a => a === "FRIEND TIME")) {
        return accum + 1;
      }

      return accum;
    }, 0);

    return {
      ...achievements,
      didFriendTimeTenTimes: count >= 10
    }
  }

  return achievements;
};