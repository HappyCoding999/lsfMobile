import { VideoCacheModule } from "../../utils";
const {
  downloadProgramWorkoutVideos,
  downloadDaily10,
  dayElapsedSinceLastDaily10Cache,
  checkWorkoutCache,
  getCachedDaily10VideoFilePath,

  // For Bonus Challenge Videos
  // downloadBonusSweats,
} = VideoCacheModule;

export default function (_API, dataStore) {
  const { getProgramWithExercises } = dataStore;

  function _use480VideoUrl(videoUrl) {
    if (videoUrl == null || videoUrl.length === 0) return videoUrl;
    return videoUrl
      .replace("/exercises%2F", "/exercises480%2F%20")
      .replace(".mp4", "480.mp4");
  }

  function isComboDetailWorkout(primaryType, secondaryType) {
    return (
      (primaryType === "Circuit" && secondaryType === "MISS Cardio") ||
      secondaryType === "LISS Cardio" ||
      secondaryType === "HIIT Cardio"
    );
  }

  function cacheWorkoutVideos(program) {
    let downloads = [];

    for (let workout of program) {
      const { primaryTag, secondaryTag } = workout;
      const isCombo = isComboDetailWorkout(
        workout.primaryType,
        workout.secondaryType
      );
      const queueDownloads = primaryTag.concat(secondaryTag).map((exercise) => {
        const { tag } = exercise;
        const _480VideoUrl = _use480VideoUrl(exercise.videoUrl);
        const videoUrl = isCombo ? _480VideoUrl : exercise.videoUrl;

        return checkWorkoutCache(workout, tag).then((isCached) => {
          if (isCached) {
            // console.log('videos cached');
            return Promise.resolve(null);
          }

          console.log("downloading videos!");

          return downloadProgramWorkoutVideos(workout, {
            tag,
            videoUrl,
            _480VideoUrl,
          }).catch((err) => console.log(err.stack));
        });
      });

      downloads.push(Promise.all(queueDownloads));
    }

    return Promise.all(downloads)
      .then((videos) => console.log("videos downloaded!"))
      .catch((err) => console.log(err.stack));
  }

  function appendDaily10CachedFilePaths(daily10Info) {
    return daily10Info.data.reduce((result, info) => {
      if (info.move1Name) {
        return { ...result, move1ImageUrl: info.toFile };
      } else if (info.move2Name) {
        return { ...result, move2ImageUrl: info.toFile };
      } else {
        return { ...result, move3ImageUrl: info.toFile };
      }
    }, daily10Info.workout);
  }

  function getDaily10(daily10) {
    return downloadDaily10(daily10).then(appendDaily10CachedFilePaths);
  }

  // For Bonus Challenge Videos
  // function appendBonusSweatsCachedFilePaths(bonusSweats) {
  //   alert("appendBonusSweatsCachedFilePaths: " + JSON.stringify(bonusSweats));
  //   // return bonusSweats.data.reduce((result, info) => {
  //   //   if (info.move1Name) {
  //   //     return { ...result, move1ImageUrl: info.toFile };
  //   //   } else if (info.move2Name) {
  //   //     return { ...result, move2ImageUrl: info.toFile };
  //   //   } else {
  //   //     return { ...result, move3ImageUrl: info.toFile };
  //   //   }
  //   // }, bonusSweats.workout);
  // }

  // function getBonusSweats(bonusSweats) {
  //   return downloadBonusSweats(bonusSweats).then(
  //     appendBonusSweatsCachedFilePaths
  //   );
  // }

  function getUserObj(userObj) {
    const { weeklyProgram } = userObj;

    cacheWorkoutVideos(weeklyProgram);
  }

  function updateWeekAndLevel({ week, level }, _userObj) {
    return getProgramWithExercises(week, level).then(cacheWorkoutVideos);
  }

  function saveLevel(level, userObj) {
    const { currentWeek } = userObj;
    return getProgramWithExercises(currentWeek, level).then(cacheWorkoutVideos);
  }

  function saveWeek(week, userObj) {
    const { level } = userObj;
    return getProgramWithExercises(week, level).then(cacheWorkoutVideos);
  }

  return {
    getUserObj,
    getDaily10,
    updateWeekAndLevel,
    saveLevel,
    saveWeek,

    // For Bonus Challenge Videos
    // getBonusSweats,
  };
}
