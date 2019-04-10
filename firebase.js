import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDYFteY5wAzyiXixHyeN0gUq9V97luPiHw',
  databaseURL: 'https://vocacoord-dev-jerry.firebaseio.com',
  storageBucket: 'vocacoord-dev-jerry.appspot.com',
  projectId: 'vocacoord-dev-jerry'
};

(function() {
  firebase.initializeApp(config);
})();

const db = firebase.firestore();

export const classExists = classCode =>
  db
    .collection('classrooms')
    .where('classCode', '==', classCode)
    .get()
    .then(query => {
      if (query.empty) return Promise.resolve(false);
      return query.docs[0].data()['wordbankId'];
    });

export const getWords = wordbankId =>
  db
    .collection('words')
    .where('wordbankId', '==', wordbankId)
    .get()
    .then(query => {
      let words = [];
      query.forEach(doc => words.push(doc.data()));
      return words;
    });
