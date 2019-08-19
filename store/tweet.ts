import firebase from 'firebase'
import TweetPost from "@/models/TweetPost";
import { ActionTree, GetterTree, MutationTree } from 'vuex';

interface RootState { }

interface TweetState {
  latestResult: boolean | null
}

export const name = 'tweet'

export const state = (): TweetState => ({
  latestResult: null
})

export const getters: GetterTree<TweetState, RootState> = {
  latestResult: (state: TweetState) => {
    return state.latestResult
  }
}

export const actions: ActionTree<TweetState, RootState> = {
  post: ({
    commit
  }, tweetPost: TweetPost) => {
    const db = firebase.firestore();
    db.collection("posts").add(tweetPost).then((ref: firebase.firestore.DocumentReference) => {
      db.collection('posts').doc(ref.id).onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {
        const data = snapshot.data()
        if (!data) {
          return
        }

        if (data.result === false || data.result === true) {
          commit('setResult', data.result || !!data.tweetId)
          return
        }
      })
    })
  }
}

export const mutations: MutationTree<TweetState> = {
  setResult: (state: TweetState, result: boolean) => {
    state.latestResult = result
  }
}
