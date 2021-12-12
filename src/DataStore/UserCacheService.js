import { AsyncStorage } from 'react-native';
import { EventRegister } from "react-native-event-listeners";
import uuidGenerator from "react-native-uuid-generator";
import JQ from "jsonq";

/**
 * In the future, this module should wrap firebase dataStore so User.js will not have to explicitly call the caching functions
 * defined here.  
 */

export default function (dataStore) {
  // const { getCurrentUser } = dataStore;
  // const basePath = () => {
  //   const user = getCurrentUser();
  //   if (user) {
  //     return `users/${user.uid}`;
  //   }

  //   throw new Error("Current User not present.  Something went wrong");
  // }

  function updateUser(path, data, action) {
    return getCachedUser()
      .then(cachedUser => {
        const userObj = JQ(cachedUser);

        if (action === "push") {
          const fieldValue = userObj.pathValue(path);
          return uuidGenerator.getRandomUUID()
            .then(id => ({ ...fieldValue, [id]: data }))
            .then(newData => {
              const [newUserObj] = userObj.setPathValue(path, newData).value();
              return AsyncStorage.setItem("cachedUser", JSON.stringify(newUserObj))
                .then(() => EventRegister.emit("userCacheUpdate", newUserObj));
            })
            .catch(err => console.log(err.stack));
        } else if (action === "merge") {
          const fieldValue = userObj.pathValue(path);
          const updatedValue = { ...fieldValue, ...data };
          const [newUserObj] = userObj.setPathValue(path, updatedValue).value();
          return AsyncStorage.setItem("cachedUser", JSON.stringify(newUserObj))
            .then(() => EventRegister.emit("userCacheUpdate", newUserObj));
        }
        const [newUserObj] = userObj.setPathValue(path, data).value();

        return AsyncStorage.setItem("cachedUser", JSON.stringify(newUserObj))
          .then(() => EventRegister.emit("userCacheUpdate", newUserObj));
      })
      .catch(err => console.log(err.stack));
  }

  function getCachedUser() {
    return AsyncStorage.getItem("cachedUser")
      .then(stringifiedUser => JSON.parse(stringifiedUser));
  }

  function onUserDataChange(userObj, fn) {
    EventRegister.addEventListener("userCacheUpdate", fn);
    return AsyncStorage.setItem("cachedUser", JSON.stringify(userObj));
  }

  function removeUserDataListener(fn) {
    EventRegister.removeEventListener(fn);
  }

  // function on(path) {
  //   console.log("on")
  //   return (event, fn) => {
  //     if (path === basePath()) {
  //       return dataStore.ref(basePath()).once("value")
  //         .then(snapshot => {
  //           onUserDataChange(fn, snapshot.val());
  //         });
  //     }

  //     dataStore.ref(path).on(event, fn);
  //   };
  // }

  // function off(path) {
  //   console.log("off")
  //   return (event, fn) => {
  //     if (path === basePath()) {
  //       return removeUserDataListener(fn);
  //     }

  //     dataStore.ref(path).off(event, fn);
  //   };
  // }

  // function push(path) {
  //   const field = getFieldFromPath(path);
  //   console.log("push!")
  //   return data => {
  //     updateUser(field, data, "push");
  //     return dataStore.ref(path).push(data);
  //   };
  // }

  // function set(path) {
  //   const field = getFieldFromPath(path);
  //   console.log("set");
  //   return data => {
  //     updateUser(field, data, "set");
  //     return dataStore.ref(path).set(data);
  //   }
  // }

  function getFieldFromPath(path) {
    return path.match(/\/([^\/]+)\/?$/)[1];
  }

  // function ref(path) {
  //   const interceptors = {
  //     push: push(path),
  //     set: set(path),
  //     on: on(path),
  //     off: off(path)
  //   };

  //   console.trace();
  //   debugger;

  //   return Object.assign(dataStore.ref(path), interceptors);
  // }

  // return Object.assign(dataStore, { ref });

  const UserCacheService = { onUserDataChange, removeUserDataListener, updateUser, getCachedUser };

  return Object.assign(dataStore, { UserCacheService });
}