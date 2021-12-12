import { last } from 'lodash';

export default function(dataStore) {

  function getFeaturedChallenges() {
    const ref = dataStore.ref(`featured/`);

    return ref.once("value")
      .then(snapshot => {
        if (snapshot.val() === null) return [];

        return Object.values(snapshot.val());
      });
  }

  function getLatestChallenge() {
    const ref = dataStore.ref('featured/');

    return ref.once("value")
      .then(snapshot => {
        if (snapshot.val() === null) return [];

        let latestChallenge = last(snapshot.val());
        return latestChallenge;
      });
  }

  return {
    getFeaturedChallenges,
    getLatestChallenge
  };
}