import WeekBump from ".";
import { initial } from "lodash/fp";

describe("WeekBump", () => {
  let set, dataStore, ref, getProgramForLevel;

  beforeEach(() => {
    set = jest.fn().mockResolvedValue(true);
    ref = jest.fn().mockReturnValue({ set });
    getProgramForLevel = jest.fn().mockResolvedValue([
      { week: 2 },
      { week: 3 },
      { week: 4 },
      { week: 8 }
    ]);
    dataStore = {
      ref,
      getCurrentUser: jest.fn().mockReturnValue({ uid: "1234" }),
      getProgramForLevel
    };
  });

  describe("saveCompletedWorkout", () => {
    const halfDay = 60 * 60 * 12 * 1000;
    const weeklyProgram = [1, 2, 3, 4, 5, 6, 7].reduce((result, n) => {
      return result.concat({
        createdAt: halfDay * n,
        day: n,
        week: 1
      });
    }, []);
    let saveCompletedWorkout;

    beforeEach(() => {
      saveCompletedWorkout = WeekBump({}, dataStore).saveCompletedWorkout;
    });

    it("should call set with 2", () => {
      const userObj = {
        currentWeek: 1,
        completedWorkouts: initial(weeklyProgram),
        weeklyProgram,
        level: "Beginner"
      };


      return saveCompletedWorkout({ day: 7 }, userObj)
        .then(() => {
          expect(set).toHaveBeenCalledWith(2);
        });
    });

    it("should call ref with 'users/1234/level' and set with 'Intermediate'", () => {
      const lastWeekProgram = weeklyProgram.map(p => ({ ...p, week: 8 }));
      const userObj = {
        currentWeek: 8,
        completedWorkouts: initial(lastWeekProgram),
        weeklyProgram: lastWeekProgram,
        level: "Beginner"
      };

      return saveCompletedWorkout({ day: 7 }, userObj)
        .then(() => {
          expect(ref).toHaveBeenCalledWith("users/1234/level");
          expect(getProgramForLevel).toHaveBeenCalledWith("Beginner");
          expect(set).toHaveBeenCalledWith("Intermediate");
          expect(set).toHaveBeenCalledWith(0);
        });
    });

  });
});