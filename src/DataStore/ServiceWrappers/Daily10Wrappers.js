import VideoPreloadServiceWrapper from "./VideoPreloadServiceWrapper";

export default function (API, dataStore) {
  let exportedWrappers = {};
  const VideoPreloadServiceWrappedAPI = VideoPreloadServiceWrapper(
    API,
    dataStore
  );

  for (let funcName in API) {
    const func = API[funcName];
    const videoFunc = VideoPreloadServiceWrappedAPI[funcName];

    const masterWrapped = (interceptedArg) => {
      return func(interceptedArg).then(videoFunc);
    };

    exportedWrappers[funcName] = masterWrapped;
  }

  return {
    ...exportedWrappers,
  };
}
