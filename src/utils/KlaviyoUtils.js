import firebase from 'react-native-firebase';
const klaviyoAPIKey = 'pk_0aba497518c73f125d6cf3f7010e2058df';

function subscribeUserToEmailList(validPurchase) {
  console.log('klaviyo api called');
  const { email } = firebase.auth().currentUser;

  if (!email || (validPurchase == undefined || validPurchase == null)) return;

  const data = {
    api_key: klaviyoAPIKey,
    "profiles": [{
        "email": email,
        "subscribed": validPurchase
      }]
    }

  return _klaviyoAPICall(data);
}
function getChallangeKlaviyoIDFromListWithName(challengeName) {
  console.log('getChallangeKlaviyoIDFromListWithName');
  console.log('for challenge : ',challengeName);
  console.log(firebase.auth().currentUser);

  const { email } = firebase.auth().currentUser;

  if (challengeName == undefined || challengeName == null) return;


       var myHeaders = new Headers();
      myHeaders.append("api-key", "pk_0aba497518c73f125d6cf3f7010e2058df");
      myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

     return fetch("https://a.klaviyo.com/api/v2/lists", requestOptions)
      .then(response => response.json())
      .then(result => {
        return result;
      }).catch(err => {
        console.log('err retrieving subcription: ', err)
        throw err;
      });
}
function subscribeUserToChallangeListWithListID(challengeListID,name,email) {
  console.log('subscribeUserToChallangeList');
  console.log(firebase.auth().currentUser);

  // const { email } = firebase.auth().currentUser;

  if (!name || !email || (challengeListID == undefined || challengeListID == null)) return;

  const data = {
    api_key: klaviyoAPIKey,
    "profiles": [{
        "email": email,
        "name": name,
        "subscribed": true
      }]
    }
  let url = 'https://a.klaviyo.com/api/v2/list/' + challengeListID + '/subscribe';
  console.log(url);
  let requestInfo = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }

  return fetch(url, requestInfo).then(response => {

    if (!response.ok) {
      console.log('Network response was not ok.');
    } else {
      console.log('Successfully called subscribeUserToChallangeListWithListID the Klaviyo api.')
    }

    return response.json();

  }).catch(err => {
    console.log('err retrieving subcription: ', err)
    throw err;
  });

  // const data = {
  //   api_key: klaviyoAPIKey,
  //   "profiles": [{
  //       "email": email,
  //       "subscribed": validPurchase
  //     }]
  //   }

  // return _klaviyoAPICall(data);
}

function _klaviyoAPICall(data) {

  // initial values for api call
  let url = 'https://a.klaviyo.com/api/v2/list/JM3hVr/subscribe';
  let requestInfo = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }

  return fetch(url, requestInfo).then(response => {

    if (!response.ok) {
      console.log('Network response was not ok.');
    } else {
      console.log('Successfully called the Klaviyo api.')
    }

    return response.json();

  }).catch(err => {
    console.log('err retrieving subcription: ', err)
    throw err;
  });
}

export { subscribeUserToEmailList,getChallangeKlaviyoIDFromListWithName,subscribeUserToChallangeListWithListID };