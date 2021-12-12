import weightGoalAchievements from "./weightGoals";
import measurementAchievements from  "./measurements";
import { flow } from "lodash/fp";

export default function (measurement, userObj) {

  const { achievements: updatedAchievements } = flow(
    weightGoalAchievements(measurement),
    measurementAchievements(measurement)
  )(userObj)

  return updatedAchievements;
}

