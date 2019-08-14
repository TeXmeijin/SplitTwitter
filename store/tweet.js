import firebase from 'firebase'

export const actions = {
  post(_, {
    uid,
    post
  }) {
    const db = firebase.firestore();
    db.collection("posts").doc(uid).set(post)
  }
}
