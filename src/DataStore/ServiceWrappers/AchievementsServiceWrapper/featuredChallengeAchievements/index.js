import { flow } from "lodash/fp";

export default function(challenge, userObj) {
  const { achievements } = userObj;

  return flow(
    checkSummerShapeUp(challenge),
    checkSpringSlim(challenge),
    checkSleighTheHoliday(challenge),
    checkRefreshInTwentyOne(challenge)
  )(achievements);
}

const checkSummerShapeUp = challenge => achievements => {
  const { didSummerShapeUp } = achievements;

  if (didSummerShapeUp === true) { return achievements; }

  return {
    ...achievements,
    didSummerShapeUp: (challenge.challengeName || "").toLowerCase() === "summer shape up"
  };
};

const checkSpringSlim = challenge => achievements => {
  const { didSpringSlim } = achievements;

  if (didSpringSlim === true) { return achievements; }

  return {
    ...achievements,
    didSpringSlim: (challenge.challengeName || "").toLowerCase() === "spring slim"
  };
};

const checkSleighTheHoliday = challenge => achievements => {
  const { didSleighTheHoliday } = achievements;

  if (didSleighTheHoliday === true) { return achievements; }

  return {
    ...achievements,
    didSleighTheHoliday: (challenge.challengeName || "").toLowerCase() === "sleigh the holiday"
  };
};

const checkRefreshInTwentyOne = challenge => achievements => {
  const { didRefreshInTwentyOne } = achievements;

  if (didRefreshInTwentyOne === true) { return achievements; }

  return {
    ...achievements,
    didRefreshInTwentyOne: (challenge.challengeName || "").toLowerCase() === "refresh in 21"
  };
};

