import firebase from "react-native-firebase";
import Program from "./Program";
import Exercise from "./Exercise";
import _User from "./User";
import UserSchema from "./UserSchema";
import Achievements from "./Achievements";
import { UserWrappers, Daily10Wrappers } from "./ServiceWrappers";
import Quotes from "./Quotes";
import Daily10 from "./Daily10";
import FeaturedChallenges from "./FeaturedChallenges";
import BonusChallenges from "./BonusChallenges";
import BonusSweats from "./BonusSweats";
import Links from "./Links";
import ChallengeDashboard from "./ChallengeDashboard";

const getCurrentUser = () => firebase.auth().currentUser;
const getTimestamp = () => firebase.database.ServerValue.TIMESTAMP;
const db = firebase.database();

const { getProgram, cachePrograms, getProgramForLevel } = Program(
  db,
  getCurrentUser
);
const { getAchievements } = Achievements(db);
const { getExercisesByTags, mapTagsToExercises } = Exercise(db);
const { getRandomQuote } = Quotes(db);
const { getFeaturedChallenges, getLatestChallenge } = FeaturedChallenges(db);
const { getBonusChallenges } = BonusChallenges(db);
const { getBonusSweats } = BonusSweats(db);
const {
  getNutritionPlanLink,
  getLSFRollCall,
  getLSFRollCallMainImage,
  getLSFRollCallShareImage,
  getChallengeBonusText,
  getChallengeBonusButtonText,
  getChallengeBonusPicture,
  getChallengeBonusButtonLink,
  getDaily10Endscreen,
  getWorkoutEndscreensSquare,
  getWorkoutEndscreens,
} = Links(db);

const { getChallengeBonusDayInfo } = ChallengeDashboard(db);

const getBonusSectionInfo = (challengeName) =>
  getChallengeBonusDayInfo(challengeName).then(
    (challengeBonusData) => challengeBonusData
  );

const getProgramWithExercises = (week, level) =>
  getProgram(week, level).then(mapTagsToExercises, (err) =>
    console.log(err.stack)
  );

const dataStore = Object.assign(db, {
  getCurrentUser,
  getProgram,
  cachePrograms,
  getProgramWithExercises,
  getTimestamp,
  getExercisesByTags,
  getAchievements,
  getRandomQuote,
  getProgramForLevel,
  UserSchema,
  getLatestChallenge,
  getBonusChallenges,
  getBonusSweats,
});

const { getDaily10 } = Daily10Wrappers(Daily10(db), dataStore);

// const wrappedDataStore = UserCacheService(dataStore);

const UserAPI = _User(dataStore);
const User = UserWrappers(UserAPI, dataStore);

// calls for users data
const { getJoinedChallenge, getHasSeenHowItWorks, setHasSeenHowItWorks } = User;

export {
  getRandomQuote,
  getAchievements,
  getProgram,
  getProgramWithExercises,
  getExercisesByTags,
  getDaily10,
  getBonusSweats,
  getFeaturedChallenges,
  getBonusChallenges,
  getNutritionPlanLink,
  getLSFRollCall,
  getLSFRollCallMainImage,
  getLSFRollCallShareImage,
  getChallengeBonusText,
  getChallengeBonusButtonText,
  getChallengeBonusPicture,
  User,
  getLatestChallenge,
  getChallengeBonusButtonLink,
  getBonusSectionInfo,
  getDaily10Endscreen,
  getJoinedChallenge,
  getHasSeenHowItWorks,
  setHasSeenHowItWorks,
  getWorkoutEndscreensSquare,
  getWorkoutEndscreens,
};
