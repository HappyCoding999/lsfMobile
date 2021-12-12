import { AppState } from "react-native";
import { AsyncStorage } from "react-native";
import { flow, sortBy } from "lodash/fp";
import { exact } from "prop-types";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

import { VideoCacheModule } from "../utils";

const filterTags = (tags) => (receivedExercises) => {
  var data = tags.map((t) =>
    receivedExercises.find((e) => e !== null && e.tag === t)
  );

  // console.log("data--------\n" + JSON.stringify(data))

  return data;
};

const parseTags = (tags) => {
  if (tags === null || tags === undefined) return [];

  return tags.split(",").map((t) => parseInt(t));
};

export default function (dataStore) {
  const cacheExercises = () => {
    const ref = dataStore.ref("exercises/");

    return ref.once("value").then((snapshot) => {
      const exercises = snapshot.val();

      return AsyncStorage.setItem("cachedExercises", JSON.stringify(exercises));
    });
  };

  const checkCache = () => {
    return AsyncStorage.getItem("cachedExercises").then((exercises) =>
      exercises ? JSON.parse(exercises) : null
    );
  };

  const getExercisesByTags = (tags) => {
    // const newAppState = !AppState.currentState.match(/active/);

    return checkCache().then((exercises) => {
      if (exercises) {
        var data = filterTags(tags)(exercises);

        data = _appendCachedVideoUrl(data);
        // console.log("data::::== 1= " + JSON.stringify(data));

        return data;
      }

      cacheExercises();

      const min = Math.min(...tags);
      const max = Math.max(...tags);
      const ref = dataStore.ref("exercises/");

      return ref
        .orderByChild("tag")
        .startAt(min)
        .endAt(max)
        .once("value")
        .then(
          flow((snapshot) => Object.values(snapshot.val()), filterTags(tags))
        )
        .catch((err) => Promise.reject(err));
    });
  };

  const _appendCachedVideoUrl = (data) => {
    var array = [];

    data.map((exercise) => {
      const { level, week, day, tag, videoUrl } = exercise;

      if (level && week && day) {
        array.push(exercise);
      } else {
        getCachedExerciseVideoFilePath(exercise, tag).then((cache) => {
          // console.log("data::::== 2=> cache: " + JSON.stringify(cache));

          if (cache == null) cache = {};

          const { path, _480Path } = cache;

          var d = {
            ...exercise,
            videoUrl: path || videoUrl,
            _480videoUrl: _480Path || videoUrl,
          };

          // console.log("data::::== 2=> " + JSON.stringify(d));
          array.push(d);
        });
      }
    });

    return array;
  };

  const getCachedExerciseVideoFilePath = (workout, exerciseTag) => {
    return checkWorkoutCache(workout, exerciseTag).then((isCached) => {
      // console.log("data::::== 2=> " + exerciseTag + " = " + isCached);

      if (isCached) {
        return getCacheFilePathString(workout, exerciseTag);
      }

      return Promise.resolve(null);
    });
  };

  const checkWorkoutCache = (workout, exerciseTag) => {
    const { path } = getCacheFilePathString(workout, exerciseTag);
    // console.log("data::::== 2=> P A T H :: " + path);
    return doCheckCache(path);
  };

  const getCacheFilePathString = (workout, exerciseTag) => {
    const { level, week, day, videoUrl } = workout;

    const fileName = exerciseTag + ".mp4";
    const _480FileName = exerciseTag + "-480.mp4";

    if (level && week && day) {
      const path = `${TemporaryDirectoryPath}${level}/${week}/${day}/${fileName}`;
      const _480Path = `${TemporaryDirectoryPath}${level}/${week}/${day}/${_480FileName}`;

      return { path: path, _480Path: _480Path };
    } else {
      const path = `${TemporaryDirectoryPath}BonusSweats/${fileName}`;
      const _480Path = `${TemporaryDirectoryPath}BonusSweats/${_480FileName}`;

      var d = { path: path, _480Path: _480Path };

      // console.log("data::::== 2=> P A T H :: " + JSON.stringify(d));

      return d;
    }
  };

  const doCheckCache = (path) => {
    return RNFS.exists(path);
  };

  const mapTagsToExercises = (programForWeek) => {
    const programWithExerciseData = programForWeek.map((exercise) => {
      const primaryTags = parseTags(exercise.primaryTag);
      const secondaryTags = parseTags(exercise.secondaryTag);

      return Promise.all([
        primaryTags.length === 0
          ? primaryTags
          : getExercisesByTags(primaryTags),
        secondaryTags.length === 0
          ? secondaryTags
          : getExercisesByTags(secondaryTags),
      ]).then(([primaryExercises, secondaryExercises]) => {
        return Promise.resolve({
          ...exercise,
          primaryTag: primaryExercises,
          secondaryTag: secondaryExercises,
        });
      });
    });

    return Promise.all(programWithExerciseData);
  };

  return {
    getExercisesByTags,
    mapTagsToExercises,
  };
}
