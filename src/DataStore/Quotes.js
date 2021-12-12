import _ from 'lodash'

export default function (dataStore) {
  const getRandomQuote = () => {
    return dataStore.ref("quotes").once("value").then((snapshot) => {
      var sample = _.sample(snapshot.val())
      return sample;
    })
  }
  return { getRandomQuote }
}

