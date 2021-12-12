import featuredChallengeAchivements from ".";

describe("featuredChallengeAchievements", () => {
  let userObj = {
    achievements: {
      didSummerShapeUp: false,
      didSpringSlim: false,
      didSleighTheHoliday: false,
      didRefreshInTwentyOne: false
    }
  };

  it("should return didSummerShapeUp true", () => {
    const challenge = {
      challengeName: "sumMer ShApe up"
    };

    const expected = {
      didSummerShapeUp: true,
      didSpringSlim: false,
      didSleighTheHoliday: false,
      didRefreshInTwentyOne: false
    }

    return expect(featuredChallengeAchivements(challenge, userObj))
      .toEqual(expected);
  });

  it("should return didSpringSlim true", () => {
    const challenge = {
      challengeName: "spring slim"
    };

    const expected = {
      didSummerShapeUp: false,
      didSpringSlim: true,
      didSleighTheHoliday: false,
      didRefreshInTwentyOne: false
    }

    return expect(featuredChallengeAchivements(challenge, userObj))
      .toEqual(expected);
  });

  it("should return didSleighTheHoliday should return true", () => {
    const challenge = {
      challengeName: "sleIgh thE Holiday"
    };

    const expected = {
      didSummerShapeUp: false,
      didSpringSlim: false,
      didSleighTheHoliday: true,
      didRefreshInTwentyOne: false
    }

    return expect(featuredChallengeAchivements(challenge, userObj))
      .toEqual(expected);
  });

  it("should return didRefreshInTwentyOne true", () => {
    const challenge = {
      challengeName: "rEFresh in 21"
    };

    const expected = {
      didSummerShapeUp: false,
      didSpringSlim: false,
      didSleighTheHoliday: false,
      didRefreshInTwentyOne: true
    }

    return expect(featuredChallengeAchivements(challenge, userObj))
      .toEqual(expected);
  });

});