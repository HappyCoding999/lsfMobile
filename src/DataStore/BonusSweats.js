import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

const base_path = `${TemporaryDirectoryPath}BonusSweats`;

export default function (dataStore) {
  function getBonusSweats() {
    const ref = dataStore.ref("challenges/");

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];

      getExcercises(snapshot.val());

      return Object.values(snapshot.val());
    });
  }

  const getExcercises = (challenges) => {
    const ref = dataStore.ref("exercises/");

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];

      cacheVideos(challenges, snapshot.val());

      return Object.values(snapshot.val());
    });
  };

  const cacheVideos = (challenges, exc) => {
    Promise.all(
      challenges.map((exercise) => {
        const { exercisesInCircuit } = exercise;

        var array_tags =
          exercisesInCircuit === null || exercisesInCircuit === undefined
            ? []
            : exercisesInCircuit.split(",").map((t) => parseInt(t));

        array_tags.map((t) => {
          const a = exc.find((e) => e !== null && e.tag === t);
          const { tag, videoUrl } = a;

          const path = getCacheFilePathString(a, t);

          return doCheckCache(path.path).then((isCached) => {
            // console.log("cacheVideos::::: isCached: " + isCached);
            if (!isCached) {
              return createCacheDirectory(base_path).then(() => {
                return [
                  RNFS.downloadFile({
                    fromUrl: videoUrl,
                    toFile: path.path,
                  }).promise.catch((err) =>
                    console.log(
                      `Following error occured in VideoPreloadServiceWrapper: ${err.stack}`
                    )
                  ),
                ];
              });
            }
          });
        });
      })
    );
  };

  const getCacheFilePathString = (workout, exerciseTag) => {
    const fileName = exerciseTag + ".mp4";
    const _480FileName = exerciseTag + "-480.mp4";

    const path = `${base_path}/${fileName}`;
    const _480Path = `${base_path}/${_480FileName}`;

    return { path: path, _480Path: _480Path };
  };

  function createCacheDirectory(path) {
    return RNFS.mkdir(path);
  }

  const doCheckCache = (path) => {
    return RNFS.exists(path);
  };

  return {
    getBonusSweats,
  };
}
