import moment from 'moment';

export default function(dataStore) {

  function getNutritionPlanLink() {
    const ref = dataStore.ref(`links/nutritionPlanLink`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getLSFRollCall() {
    const ref = dataStore.ref(`links/rollCall`);
    return ref.once('value')
      .then(snapshot => 
        {
          const rollCallData = snapshot.val();
          const todaysDate = moment().format('MM/DD/YYYY').toString();
          let rollCallToday = rollCallData.find(o => o.date == todaysDate);
          if (!rollCallToday) {
            return Promise.resolve(defaultRollCall());
          }
          return Promise.resolve(rollCallToday);
        });
  }
  function defaultRollCall() {
    return {
      shareImage: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/daily_10_roll_call%2Fdefault%2FMain_App%202.0%20Roll%20Call%20Default.jpg?alt=media&token=ce5b0466-bcde-4b38-8ba4-671247459a50",
      mainImage: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/daily_10_roll_call%2Fdefault%2FMain_App%202.0%20Roll%20Call%20Default.jpg?alt=media&token=ce5b0466-bcde-4b38-8ba4-671247459a50"
    }
  }

  function getLSFRollCallMainImage() {
    const ref = dataStore.ref(`links/rollCallMain`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getLSFRollCallShareImage() {
    const ref = dataStore.ref(`links/rollCallShare`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getChallengeBonusText() {
    const ref = dataStore.ref(`links/challengeBonusText`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getChallengeBonusButtonText() {
    const ref = dataStore.ref(`links/challengeBonusButtonText`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getChallengeBonusPicture() {
    const ref = dataStore.ref(`links/challengeBonusPicture`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getChallengeBonusButtonLink() {
    const ref = dataStore.ref(`links/challengeBonusButtonLink`);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getDaily10Endscreen() {
    const ref = dataStore.ref(`links/Daily10Endscreen`)
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  function getWorkoutEndscreens() {
    const ref = dataStore.ref(`links/premiumEndScreenImages`)

    return ref.once('value')
      .then(snapshot => snapshot.val())
  }

  function getWorkoutEndscreensOld() {
    const ref = dataStore.ref(`links/workoutEndscreens`)

    return ref.once('value')
      .then(snapshot => snapshot.val())
  }

  function getWorkoutEndscreensSquare() {
    const ref = dataStore.ref(`links/shareSquareImage`)

    return ref.once('value')
      .then(snapshot => snapshot.val())
  }


  return {
    getNutritionPlanLink,
    getLSFRollCall,
    getChallengeBonusText,
    getChallengeBonusButtonText,
    getChallengeBonusPicture,
    getChallengeBonusButtonLink,
    getDaily10Endscreen,
    getWorkoutEndscreensSquare,
    getWorkoutEndscreens
  }
}