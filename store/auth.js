import firebase from 'firebase'
import pick from "lodash/pick";

export const state = () => ({
  user: null,
  uid: null,
  credential: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setUid(state, uid) {
    state.uid = uid
  },
  setCredential(state, credential) {
    if (!credential || !state.uid) {
      state.credential = null
      return
    }
    if (Object.keys(credential).length < 1) {
      state.credential = null
      return
    }
    state.credential = credential
  }
}

export const actions = {
  login() {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  },
  logout({
    commit
  }, uid) {
    firebase.auth().signOut()

    commit('setUid', null)
    commit('setUser', null)
    commit('setCredential', null)
    firebase.firestore().collection('users').doc(uid).set({})
  },
  setCredential({
    commit
  }, {
    uid,
    credential
  }) {
    const db = firebase.firestore();
    db.collection("users").doc(uid).set(pick(
      credential,
      ['accessToken', 'secret']
    ))
    commit('setCredential', credential)
  }
}
