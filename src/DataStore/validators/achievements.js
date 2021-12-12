import AchievementSchema from "../AchievementsSchema";
const allowedKeys = Object.keys(AchievementSchema).reduce((accum, key) => {
  return {
    ...accum,
    [key]: true
  };
}, {});

export function validateAchievements(data) {
  for (let field in data) {
    if (!allowedKeys[field]) {
      throw new Error(`${field} is not a valid Achievement Field`);
    }
  }

  return data;
}