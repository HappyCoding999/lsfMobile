export default function (dataStore) {
  // const getAchievements = () => {
  //   return dataStore.ref("achievements").once("value").then((snapshot) => {
  //     return Object.values(snapshot.val())
  //   })
  // }

  //Version 2.0
  const getAchievements = () => {
    return dataStore.ref("trophies").once("value").then((snapshot) => {
      return Object.values(snapshot.val())
    })
  }

  return { getAchievements }
}

