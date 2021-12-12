import { flow, map, zip, filter } from "lodash/fp";
import { AppState } from "react-native";
import { AsyncStorage } from 'react-native';

export default function (dataStore, getCurrentUser) {

  const refs = {
    "Beginner": { 
      path: dataStore.ref("programs/beginner"),
      weeks: 8
    },
    "Intermediate": {
      path: dataStore.ref("programs/intermediate"),
      weeks: 24
    },
    "Advanced": {
      path: dataStore.ref("programs/advanced"),
      weeks: 24
    }
  };

  const checkCache = () => {
    return AsyncStorage.getItem("cachedPrograms")
      .then(stringifiedPrograms => stringifiedPrograms ? JSON.parse(stringifiedPrograms) : null);
  }

  const cachePrograms = () => {
    const ref = dataStore.ref("programs/");

    return ref.once("value")
      .then(snapshot => {
        const programs = snapshot.val();
        return AsyncStorage.setItem("cachedPrograms", JSON.stringify(programs));
      });
  };

  const getProgramForLevel = level => {
    if (!level) return Promise.reject(new Error("Level required"));

    return checkCache()
      .then(programs => {
        const normalizedLevel = level.toLowerCase();
        if (programs && programs[normalizedLevel]) {
          return Promise.resolve(programs[normalizedLevel]);
        }

        return Promise.reject(new Error("No Cached programs"));
      })
      .catch(err => console.log(err.stack));
  };

  const getProgram = (week, level) => {
    const ref = refs[level].path;
    const maxWeek = refs[level].weeks;

    if (ref) {
      return checkCache()
        .then(programs => {

          // reset week in app and db if it is outta scope for its level
          if (week > maxWeek) {
            week = 1;
            dataStore.ref(`users/${getCurrentUser().uid}/currentWeek`).set(week);
          }

          if (programs) {
            const program = programs[level.toLowerCase()].filter(exercise => exercise.week === week);

            return Promise.resolve(program);
          }

          cachePrograms();

          return ref.orderByChild("week").equalTo(week).once("value")
            .then(snapshot => {

              var workoutWeek = [];

              if (Array.isArray(snapshot.val())) {
                workoutWeek = snapshot.val().filter(workoutDays => workoutDays != null)
              } else {

                for (let [tag, workoutDay] of Object.entries(snapshot.val())) {
                  workoutWeek.push(workoutDay);
                };
              }

              // return Promise.resolve(attachRecordKeysToChildren(snapshot.val()));
              return Promise.resolve(workoutWeek);
            })
            .catch(err => console.log("getProgram error message: ", err.message));
        });
    }

    const errMsg = "Invalid difficulty.  Please use 'Beginner', 'Intermediate', or 'Advanced'";

    return Promise.reject(new Error(errMsg));
  }

  return {
    getProgram,
    getProgramForLevel
  };
}