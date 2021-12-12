import GoalServiceWrapper from "./GoalServiceWrapper";
import AchievementServiceWrapper from "./AchievementsServiceWrapper";
import VideoPreloadServiceWrapper from "./VideoPreloadServiceWrapper";
import WeekBumpServiceWrapper from "./WeekBumpServiceWrapper";
import { AsyncStorage } from 'react-native';

export default function (API, dataStore) {
  let exportedWrappers = {};
  const GoalServiceWrappedAPI = GoalServiceWrapper(API, dataStore);
  const AchievementServiceWrappedAPI = AchievementServiceWrapper(API, dataStore);
  const VideoPreloadServiceWrappedAPI = VideoPreloadServiceWrapper(API, dataStore);
  const WeekBumpServiceWrappedAPI = WeekBumpServiceWrapper(API, dataStore);

  for (let funcName in API) {
    const func = API[funcName];
    const funcs = [
      GoalServiceWrappedAPI[funcName],
      AchievementServiceWrappedAPI[funcName],
      VideoPreloadServiceWrappedAPI[funcName],
      WeekBumpServiceWrappedAPI[funcName]
    ];
    // let masterWrapped = func;
    let masterWrapped;

    if (funcName === "getUserObj") {
      masterWrapped = _interceptedArg => {
        return func(_interceptedArg)
          .then(userObj => {

            funcs.forEach(fn => {
              if (fn) { fn(userObj); }
            });

            return Promise.resolve(userObj);
          });
      };
    } else if (funcName === "create" || funcName === "removeUserDataListener" || funcName === "findById") {
      masterWrapped = func;
    } else {
      masterWrapped = interceptedArg => {
        return API.getUserObj()
          .then(userObj => {
            const calledFuncs = funcs.map(fn => {
              if (fn) {
                return fn(interceptedArg, userObj);
              }

              return Promise.resolve();
            });

            return Promise.all(calledFuncs)
              .then(() => func(interceptedArg))
              .catch(err => console.log(`Following error occured inside a service wrapper: ${err.stack}`));
          });
      };
    }

    exportedWrappers[funcName] = masterWrapped;
  }

  return {
    ...exportedWrappers,
  };
}