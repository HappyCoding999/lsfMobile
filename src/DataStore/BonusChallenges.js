export default function (dataStore) {
  function getBonusChallenges() {
    const ref = dataStore.ref("challenges/");

    return ref.once("value").then((snapshot) => {
      if (snapshot.val() === null) return [];

      return Object.values(snapshot.val());
    });
  }

  return {
    getBonusChallenges,
  };
}
