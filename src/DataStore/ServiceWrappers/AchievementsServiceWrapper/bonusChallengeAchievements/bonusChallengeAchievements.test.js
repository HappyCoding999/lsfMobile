import bonusChallengeAchievements from ".";

describe("bonusChallengeAchievements", () => {
  let completedBonusChallenges = {
    "id_1": { a: 1, b: 2 },
    "id_2": { a: 1, b: 2 },
    "id_3": { a: 1, b: 2 },
    "id_4": { a: 1, b: 2 },
    "id_5": { a: 1, b: 2 },
    "id_6": { a: 1, b: 2 },
    "id_7": { a: 1, b: 2 },
    "id_8": { a: 1, b: 2 },
    "id_9": { a: 1, b: 2 },
    "id_10": { a: 1, b: 2 },
    "id_11": { a: 1, b: 2 },
    "id_12": { a: 1, b: 2 },
    "id_13": { a: 1, b: 2 },
    "id_14": { a: 1, b: 2 },
    "id_15": { a: 1, b: 2 }
  };

  let userObj = {
    achievements: {
      didBikiniAbLadder: false,
      didFifteenBonusChallenges: false
    },
    completedBonusChallenges: {}
  };

  it("should return didBikiniAbLadder true", () => {
    const bonusChallenge = {
      title: "BiKini AB ladder"
    };

    const expected = {
      didBikiniAbLadder: true,
      didFifteenBonusChallenges: false
    }

    return expect(bonusChallengeAchievements(bonusChallenge, userObj))
      .toEqual(expected);
  });

  it("should return didFifteenBonusChallenges true", () => {
    const bonusChallenge = {
      title: "some title"
    };

    const expected = {
      didBikiniAbLadder: false,
      didFifteenBonusChallenges: true
    };

    return expect(bonusChallengeAchievements(bonusChallenge, {...userObj, completedBonusChallenges}))
      .toEqual(expected);
  });
});