import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";
import { Platform } from "react-native";
import { AsyncStorage } from "react-native";
import moment from "moment";
import accents from "remove-accents";

export function checkWorkoutCache(workout, exerciseTag) {
  const { path } = getCacheFilePathString(workout, exerciseTag);

  return doCheckCache(path);
}

function getCacheFilePathString(workout, exerciseTag) {
  const { level, week, day, videoUrl } = workout;

  if (level && week && day) {
    const fileName = exerciseTag + ".mp4";
    const _480FileName = exerciseTag + "-480.mp4";

    const path = `${TemporaryDirectoryPath}${level}/${week}/${day}/${fileName}`;
    const _480Path = `${TemporaryDirectoryPath}${level}/${week}/${day}/${_480FileName}`;

    return { path: path, _480Path: _480Path };
  } else {
    // console.log("data::::== 2=> " + videoUrl);
    return { path: videoUrl, _480Path: videoUrl };
  }
}

function createWorkoutCacheDirectory(workout) {
  const { level, week, day } = workout;

  return createCacheDirectory(
    `${TemporaryDirectoryPath}${level}/${week}/${day}`
  );
}

function createCacheDirectory(path) {
  return RNFS.mkdir(path);
}

function doCheckCache(path) {
  return RNFS.exists(path);
}

export function getCachedExerciseVideoFilePath(workout, exerciseTag) {
  return checkWorkoutCache(workout, exerciseTag).then((isCached) => {
    if (isCached) {
      return getCacheFilePathString(workout, exerciseTag);
    }

    return Promise.resolve(null);
  });
}

export function downloadProgramWorkoutVideos(
  workout,
  { tag, videoUrl, _480VideoUrl }
) {
  return createWorkoutCacheDirectory(workout).then(() => {
    const { path: toFile, _480Path } = getCacheFilePathString(workout, tag);
    // Don't cache to file storage for Android
    // if (Platform.OS == "android") {
    //   return Promise.resolve(null);
    // }
    return [
      RNFS.downloadFile({
        fromUrl: videoUrl,
        toFile,
      }).promise.catch((err) =>
        console.log(
          `Following error occured in VideoPreloadServiceWrapper: ${err.stack}`
        )
      ),
      RNFS.downloadFile({
        fromUrl: _480VideoUrl,
        toFile: _480Path,
      }).promise.catch((err) =>
        console.log(
          `Following error occured in 480 file VideoPreloadServiceWrapper: ${err.stack}`
        )
      ),
    ];
  });
}

/***************************************** 

Bonus Sweats functions

**********************************************/

// export function downloadBonusSweats(bonusSweats) {
//   return dayElapsedSinceLastBonusSweatsCache()
//     .then((dayPassed) => {
//       // changed for Android
//       if (true) {
//         // if (false) {
//         return Promise.resolve({
//           data: normalizeBonusSweatsData(bonusSweats),
//           fromCache: false,
//           workout: bonusSweats,
//         });
//       }

//       return getCachedBonusSweatsInfo().then((bonusSweatsInfo) => {
//         return Promise.resolve({
//           data: normalizeDaily10Data(bonusSweatsInfo),
//           fromCache: true,
//           workout: bonusSweatsInfo,
//         });
//       });
//     })
//     .then((bonusSweatsInfoDownloadInfo) => {
//       const downloads = bonusSweatsInfoDownloadInfo.data.map((data) => {
//         const { url, toFile, normalizedName } = data;

//         return checkBonusSweatsCache(normalizedName).then((isCached) => {
//           if (isCached) return Promise.resolve();

//           return createBonusSweatsCacheDirectory(normalizedName).then(
//             () => {
//               return RNFS.downloadFile({
//                 fromUrl: url,
//                 toFile,
//               }).promise.catch((err) =>
//                 console.log(
//                   `Following error occured in VideoPreloadServiceWrapper: ${err.stack}`
//                 )
//               );
//             },
//             (err) => console.log(err.stack)
//           );
//         });
//       });

//       return Promise.all(downloads)
//         .then(() => {
//           if (bonusSweatsInfoDownloadInfo.fromCache) {
//             return Promise.resolve();
//           }

//           return Promise.all([
//             recordBonusSweatsCacheDate(),
//             cacheBonusSweatsInfo(bonusSweats),
//           ]);
//         })
//         .then(() => bonusSweatsInfoDownloadInfo);
//     })
//     .catch((err) => console.log(err.stack));
// }

// export function dayElapsedSinceLastBonusSweatsCache() {
//   return AsyncStorage.getItem("bonusSweatsCacheDate").then((miliseconds) => {
//     if (miliseconds === null) {
//       return Promise.resolve(true);
//     }

//     let changeBonusSweats = false;
//     const now = moment();
//     const then = parseInt(miliseconds);

//     const currentDate = moment(now).format("MM/DD/YYYY").toString();
//     const lastDateCached = moment(then).format("MM/DD/YYYY").toString();

//     // change only if date is not the same as current
//     if (lastDateCached != currentDate) {
//       changeBonusSweats = true;
//     }

//     return Promise.resolve(changeBonusSweats);
//   });
// }

// function createBonusSweatsCacheDirectory(name) {
//   return createCacheDirectory(
//     `${TemporaryDirectoryPath}bonusSweats/${accents.remove(name)}`
//   );
// }

// function recordBonusSweatsCacheDate() {
//   const now = Date.now().toString();
//   return AsyncStorage.setItem("bonusSweatsCacheDate", now);
// }

// function cacheBonusSweatsInfo(bonusSweatsInfo) {
//   return AsyncStorage.setItem(
//     "currentBonusSweats",
//     JSON.stringify(bonusSweatsInfo)
//   );
// }

// function getCachedBonusSweatsInfo() {
//   return AsyncStorage.getItem("currentBonusSweats").then((bonusSweatsData) =>
//     JSON.parse(bonusSweatsData)
//   );
// }

// export function checkBonusSweatsCache(moveName) {
//   const path = getBonusSweatsCacheFilePath(accents.remove(moveName));

//   return doCheckCache(path);
// }

// export function getBonusSweatsCacheFilePath(moveName) {
//   const normalizedMoveName = accents.remove(moveName);
//   const fileName = normalizedMoveName + ".mp4";

//   return `${TemporaryDirectoryPath}bonusSweats/${normalizedMoveName}/${fileName}`;
// }

// function normalizeBonusSweatsData(bonusSweatsWorkout) {
//   const {
//     move1ImageUrl,
//     move1Name,
//     move2ImageUrl,
//     move2Name,
//     move3ImageUrl,
//     move3Name,
//   } = bonusSweatsWorkout;
//   const moveNames = [move1Name, move2Name, move3Name].map((n) =>
//     n.replace(/ /g, "")
//   );

//   return [
//     {
//       url: move1ImageUrl,
//       toFile: getBonusSweatsCacheFilePath(moveNames[0]),
//       normalizedName: moveNames[0],
//       move1Name,
//     },
//     {
//       url: move2ImageUrl,
//       toFile: getBonusSweatsCacheFilePath(moveNames[1]),
//       normalizedName: moveNames[1],
//       move2Name,
//     },
//     {
//       url: move3ImageUrl,
//       toFile: getBonusSweatsCacheFilePath(moveNames[2]),
//       normalizedName: moveNames[2],
//       move3Name,
//     },
//   ];
// }

/***************************************** 

Daily 10 functions

**********************************************/

function createDaily10CacheDirectory(name) {
  return createCacheDirectory(
    `${TemporaryDirectoryPath}dailyTen/${accents.remove(name)}`
  );
}

export function getCachedDaily10VideoFilePath(moveName) {
  const normalizedMoveName = moveName
    ? accents.remove(moveName.replace(/ /g, ""))
    : "";

  return checkDaily10Cache(normalizedMoveName).then((isCached) => {
    if (isCached) {
      return getDaily10CacheFilePath(normalizedMoveName);
    }

    return Promise.resolve(null);
  });
}

export function checkDaily10Cache(moveName) {
  const path = getDaily10CacheFilePath(accents.remove(moveName));

  return doCheckCache(path);
}

export function getDaily10CacheFilePath(moveName) {
  const normalizedMoveName = accents.remove(moveName);
  const fileName = normalizedMoveName + ".mp4";

  return `${TemporaryDirectoryPath}dailyTen/${normalizedMoveName}/${fileName}`;
}

export function downloadDaily10(daily10Workout) {
  return dayElapsedSinceLastDaily10Cache()
    .then((dayPassed) => {
      // changed for Android
      if (true) {
        // if (false) {
        return Promise.resolve({
          data: normalizeDaily10Data(daily10Workout),
          fromCache: false,
          workout: daily10Workout,
        });
      }

      return getCachedDaily10Info().then((daily10Info) => {
        return Promise.resolve({
          data: normalizeDaily10Data(daily10Info),
          fromCache: true,
          workout: daily10Info,
        });
      });
    })
    .then((daily10DownloadInfo) => {
      const downloads = daily10DownloadInfo.data.map((data) => {
        const { url, toFile, normalizedName } = data;

        return checkDaily10Cache(normalizedName).then((isCached) => {
          if (isCached) return Promise.resolve();

          return createDaily10CacheDirectory(normalizedName).then(
            () => {
              return RNFS.downloadFile({
                fromUrl: url,
                toFile,
              }).promise.catch((err) =>
                console.log(
                  `Following error occured in VideoPreloadServiceWrapper: ${err.stack}`
                )
              );
            },
            (err) => console.log(err.stack)
          );
        });
      });

      return Promise.all(downloads)
        .then(() => {
          if (daily10DownloadInfo.fromCache) {
            return Promise.resolve();
          }

          return Promise.all([
            recordDaily10CacheDate(),
            cacheDaily10Info(daily10Workout),
          ]);
        })
        .then(() => daily10DownloadInfo);
    })
    .catch((err) => console.log(err.stack));
}

export function dayElapsedSinceLastDaily10Cache() {
  return AsyncStorage.getItem("daily10CacheDate").then((miliseconds) => {
    if (miliseconds === null) {
      return Promise.resolve(true);
    }

    let changeDaily10 = false;
    const now = moment();
    const then = parseInt(miliseconds);

    const currentDate = moment(now).format("MM/DD/YYYY").toString();
    const lastDateCached = moment(then).format("MM/DD/YYYY").toString();

    // change only if date is not the same as current
    if (lastDateCached != currentDate) {
      changeDaily10 = true;
    }

    return Promise.resolve(changeDaily10);
  });
}

function recordDaily10CacheDate() {
  const now = Date.now().toString();
  return AsyncStorage.setItem("daily10CacheDate", now);
}

function cacheDaily10Info(daily10Info) {
  return AsyncStorage.setItem("currentDaily10", JSON.stringify(daily10Info));
}

function getCachedDaily10Info() {
  return AsyncStorage.getItem("currentDaily10").then((daily10Data) =>
    JSON.parse(daily10Data)
  );
}

function normalizeDaily10Data(daily10Workout) {
  const {
    move1ImageUrl,
    move1Name,
    move2ImageUrl,
    move2Name,
    move3ImageUrl,
    move3Name,
  } = daily10Workout;
  const moveNames = [move1Name, move2Name, move3Name].map((n) =>
    n.replace(/ /g, "")
  );

  return [
    {
      url: move1ImageUrl,
      toFile: getDaily10CacheFilePath(moveNames[0]),
      normalizedName: moveNames[0],
      move1Name,
    },
    {
      url: move2ImageUrl,
      toFile: getDaily10CacheFilePath(moveNames[1]),
      normalizedName: moveNames[1],
      move2Name,
    },
    {
      url: move3ImageUrl,
      toFile: getDaily10CacheFilePath(moveNames[2]),
      normalizedName: moveNames[2],
      move3Name,
    },
  ];
}
