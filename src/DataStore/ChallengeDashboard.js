import moment from 'moment';

export default function (dataStore) {

  const todaysDate = moment().format('MM/DD/YYYY').toString();

  function getChallengeBonusDayInfo(challengeName) {
    const ref = dataStore.ref(`challengeBonusSectionVideos/${challengeName}/`);

    return ref.once('value').then(snapshot => {
      if (snapshot.val() == null) return;

      let bonusVid = snapshot.val().find(vid => vid.day == todaysDate);
      return bonusVid;

    }).catch(err => console.log('error retrieving bonus videos', err));
  }

  return {
    getChallengeBonusDayInfo
  }
}