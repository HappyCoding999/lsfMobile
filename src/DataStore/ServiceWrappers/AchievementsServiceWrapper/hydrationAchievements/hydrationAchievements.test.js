import hydrationAchievements from "./";

describe("hydrationAchievements", () => {
  const oneDay = 60 * 60 * 24 * 1000;
  let waterLog = { count: 4, createdAt: Date.now() };
  const achievements = {
    didHitOneWeekHydrationGoal: false,
    didHitWaterGoalTwo: false,
    didHitWaterGoalThree: false,
    didHitWaterDailyGoal: true
  };

  it("should return didHitOneWeekHydrationGoal true", () => {
    const waterBottleLogs = [
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
    ].map((log, index) => {
      return {
        ...log,
        createdAt: oneDay * (index + 1)
      }
    });


    const userObj = {
      achievements,
      waterBottleLogs,
      goals: {
        dailyWaterIntake: {
          target: 16
        }
      }
    };

    return expect(hydrationAchievements(waterLog, userObj)).toEqual({
      didHitOneWeekHydrationGoal: true,
      didHitWaterGoalTwo: false,
      didHitWaterGoalThree: false,
      didHitWaterDailyGoal: true
    });
  });

  it("should return didHitOneWeekHydrationGoal false", () => {

    const waterBottleLogs = [
      { count: 16 },
      { count: 10 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 }
    ].map((log, index) => {
      return {
        ...log,
        createdAt: oneDay * (index + 1)
      }
    });

    const userObj = {
      achievements,
      waterBottleLogs,
      goals: {
        dailyWaterIntake: {
          target: 16
        }
      }
    };

    return expect(hydrationAchievements(waterLog, userObj)).toEqual({
      didHitOneWeekHydrationGoal: false,
      didHitWaterGoalTwo: false,
      didHitWaterGoalThree: false,
      didHitWaterDailyGoal: true
    });
  });

  it("should return didHitOneWeeklyHydrationGoal false when there is a gap and no contiguous week", () => {
    const waterBottleLogsPartitionA = [
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
    ].map((log, index) => {
      return {
        ...log,
        createdAt: oneDay * (index + 1)
      }
    });

    const today = Date.now();

    const waterBottleLogsPartitionB = [
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
    ].map((log, index) => {
      return {
        ...log,
        createdAt: today + oneDay * (index + 1)
      }
    });

    const userObj = {
      achievements,
      waterBottleLogs: waterBottleLogsPartitionA.concat(waterBottleLogsPartitionB),
      goals: {
        dailyWaterIntake: {
          target: 16
        }
      }
    };

    return expect(hydrationAchievements(waterLog, userObj)).toEqual({
      didHitOneWeekHydrationGoal: false,
      didHitWaterGoalTwo: false,
      didHitWaterGoalThree: false,
      didHitWaterDailyGoal: true
    });
  });

  it("should return didHitOneWeekHydrationGoal true when there is a gap with a contiguous week", () => {
    const waterBottleLogsPartitionA = [
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
    ].map((log, index) => {
      return {
        ...log,
        createdAt: oneDay * (index + 1)
      }
    });

    const today = Date.now();

    const waterBottleLogsPartitionB = [
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 },
      { count: 16 }
    ].map((log, index) => {
      return {
        ...log,
        createdAt: today + oneDay * (index + 1)
      }
    });

    const userObj = {
      achievements,
      waterBottleLogs: waterBottleLogsPartitionA.concat(waterBottleLogsPartitionB),
      goals: {
        dailyWaterIntake: {
          target: 16
        }
      }
    };

    return expect(hydrationAchievements(waterLog, userObj)).toEqual({
      didHitOneWeekHydrationGoal: true,
      didHitWaterGoalTwo: false,
      didHitWaterGoalThree: false,
      didHitWaterDailyGoal: true
    });
  });
});