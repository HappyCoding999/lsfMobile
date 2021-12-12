import { flow } from "lodash/fp";
import workoutCountAchievements from "./counts";
import workoutStreakAchievements from "./streaks";


export default function(completedWorkouts, achievements) {

  return flow(
    workoutCountAchievements(completedWorkouts),
    workoutStreakAchievements(completedWorkouts)
  )(achievements);
}