import firebase from 'firebase'
import pick from "lodash/pick";
import {
  ActionTree,
  MutationTree,
  GetterTree
} from 'vuex';

interface RootState { }

interface AuthState {
  user: firebase.UserInfo | null;
  uid: string | null;
  credential: any | null;
}

export const name = 'auth'

export const state = (): AuthState => ({
  user: null,
  uid: null,
  credential: null
})

export const mutations: MutationTree<AuthState> = {
  setUser: (state: AuthState, user) => {
    state.user = user
  },
  setUid: (state: AuthState, uid: string) => {
    state.uid = uid
  },
  setCredential: (state: AuthState, credential: any) => {
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

export const actions: ActionTree<AuthState, RootState> = {
  login: () => {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  },
  logout: ({
    commit
  }, uid: string) => {
    firebase.auth().signOut()

    commit('setUid', null)
    commit('setUser', null)
    commit('setCredential', null)
    firebase.firestore().collection('users').doc(uid).set({})
  },
  setCredential: ({
    commit
  }, {
    uid,
    twitterId,
    credential
  }) => {
    const db = firebase.firestore();
    db.collection("users").doc(uid).set(Object.assign({
      twitterId,
      created_at: new Date().getTime()
    }, pick(
      credential,
      ['accessToken', 'secret']
    )))
    commit('setCredential', credential)
  }
}
