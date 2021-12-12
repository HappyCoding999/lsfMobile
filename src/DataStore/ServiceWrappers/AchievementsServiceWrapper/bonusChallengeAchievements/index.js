import { flow } from "lodash/fp";

export default function (bonusChallenge, userObj) {
  const { achievements } = userObj;
  const completedBonusChallenges = userObj.completedBonusChallenges
    ? Object.values(userObj.completedBonusChallenges)
    : [];

  return flow(
    checkBikiniAbLadder(bonusChallenge),
    checkFifteenBonusChallenges(completedBonusChallenges.concat(bonusChallenge))
  )(achievements);
}

const checkBikiniAbLadder = (bonusChallenge) => (achievements) => {
  const { didBikiniAbLadder } = achievements;

  if (didBikiniAbLadder === true) {
    return achievements;
  }

  return {
    ...achievements,
    didBikiniAbLadder:
      bonusChallenge.title.toLowerCase() === "bikini ab ladder",
  };
};

const checkFifteenBonusChallenges = (bonusChallenges) => (achievements) => {
  const { didFifteenBonusChallenges } = achievements;

  if (didFifteenBonusChallenges === true) {
    return achievements;
  }

  return {
    ...achievements,
    didFifteenBonusChallenges: bonusChallenges.length >= 15,
  };
};
