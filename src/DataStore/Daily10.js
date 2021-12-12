import { sample } from "lodash/fp";
import moment from 'moment';

export default function(dataStore) {
  function getDaily10() {
    const ref = dataStore.ref(`daily10/`);

    return ref.once("value")
      .then(snapshot => {
        const daily10 = snapshot.val();
        const todaysDate = moment().format('MM/DD/YYYY').toString();

        let daily10Vid = daily10.find(o => o.ssuDate == todaysDate);
        
        if (!daily10Vid) {
          return Promise.resolve(defaultDaily10s());
        }

        return Promise.resolve(daily10Vid);
      });
  }

  function defaultDaily10s() {
    return {
      endScreens: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/Daily%2010%20End%20Photos%2F0Q2A2332.jpg?alt=media&token=7ad51962-205d-4121-b596-490c858d30aa",
      move1ImageUrl: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/daily%2010s%20jan2020-feb2020%2F01-25-3-Bicycles_D10Aug.mp4?alt=media&token=6d6674a2-d81a-4fbd-b683-d58d4c3bcbb4",
      move1Name: "Bicycles",
      move1Reps: "x10 each side",
      move2ImageUrl: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/daily10_evergreen_new_aug_2019%2FChest_Press_D10AUG2.mp4?alt=media&token=e99d8547-81ce-4354-a2b5-97a1bf6c5d30",
      move2Name: "Chest Press",
      move2Reps: "x10",
      move3ImageUrl: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/daily%2010s%20jan2020-feb2020%2F01-18-3-Donkey_Kicks_Band_D10Aug.mp4?alt=media&token=5ad95598-8e91-4bef-ac4b-88bff5a96559",
      move3Name: "Donkey Kicks",
      move3Reps: "x10 each side",
      ssuPhoto: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/Daily_10_Fea_Images%2Fnov_19_new%2F0Q2A5997.jpg?alt=media&token=1b312375-bbb7-4b93-96b7-c0fd03807b5b"
    }
  }

  return {
    getDaily10
  };
}