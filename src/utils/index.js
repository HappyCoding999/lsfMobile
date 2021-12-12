import {
  downloadDaily10,
  dayElapsedSinceLastDaily10Cache,
  downloadProgramWorkoutVideos,
  getCachedExerciseVideoFilePath,
  checkWorkoutCache,
  getDaily10CacheFilePath,
  getCachedDaily10VideoFilePath,

  // For Bonus Challenge Videos
  // downloadBonusSweats,
} from "./VideoCacheFunctions";

export * from "./purchaseValidator";
export * from "./workouts";
import { isIphoneXorAbove } from "./commonFunction";
export const CommonFunction = {
  isIphoneXorAbove,
};

export const VideoCacheModule = {
  downloadDaily10,
  dayElapsedSinceLastDaily10Cache,
  downloadProgramWorkoutVideos,
  getCachedExerciseVideoFilePath,
  checkWorkoutCache,
  getDaily10CacheFilePath,
  getCachedDaily10VideoFilePath,

  // For Bonus Challenge Videos
  // downloadBonusSweats,
};

export {
  subscribeUserToEmailList,
  getChallangeKlaviyoIDFromListWithName,
  subscribeUserToChallangeListWithListID,
} from "./KlaviyoUtils";
