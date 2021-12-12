import Spotify from "rn-spotify-sdk";
import { getAvailablePurchases } from "react-native-iap";
import UserActions from "./user";
import AppDataActions from "./appData";
import {
  User as API,
  getProgram,
  getProgramWithExercises,
  getLatestChallenge,
  getBonusSectionInfo,
} from "../DataStore";
import { checkPurchaseHistory } from "../utils";

const {
  initUserData,
  updateUserData,
  saveBottleCount,
  saveWeeklyWorkout,
  saveCompletedWorkout,
  saveLevel,
  savePurchase,
  saveSweatLog,
  saveMeasurement,
  updateMeasurement,
  saveWeightGoal,
  saveWeight,
  skipWorkout,
  skipToNextWeek,
  restartLevel,
  completeBonusChallenge,
  flagChallenge,
  saveChallengeWorkout,
  saveWorkoutForChallenge,
  checkChallengeDate,
  setJoinedChallenge,
  setHasSeenHowItWorks,
} = UserActions({
  ...API,
  checkPurchaseHistory,
  getProgram,
  getProgramWithExercises,
  getAvailablePurchases,
  getLatestChallenge,
});

const {
  fetchPlaylistData,
  setCurrentPlaylist,
  setCurrentPlaylistTracks,
  clearPlaylistData,
  clearAppErrors,
  authorizeSpotify,
  resetSpotifyAuthFlow,
} = AppDataActions(Spotify);

export {
  initUserData,
  updateUserData,
  saveBottleCount,
  saveWeeklyWorkout,
  saveCompletedWorkout,
  saveLevel,
  savePurchase,
  saveSweatLog,
  saveMeasurement,
  updateMeasurement,
  saveWeightGoal,
  saveWeight,
  fetchPlaylistData,
  clearPlaylistData,
  clearAppErrors,
  authorizeSpotify,
  setCurrentPlaylist,
  setCurrentPlaylistTracks,
  resetSpotifyAuthFlow,
  skipWorkout,
  skipToNextWeek,
  restartLevel,
  completeBonusChallenge,
  flagChallenge,
  saveChallengeWorkout,
  saveWorkoutForChallenge,
  getBonusSectionInfo,
  checkChallengeDate,
  setJoinedChallenge,
  setHasSeenHowItWorks,
};
