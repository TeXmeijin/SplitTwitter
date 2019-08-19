import firebase from 'firebase'

export const state = () => ({
  latestResult: null,
})

export const actions = {
  post({
    commit
  }, {
    uid,
    post
  }) {
    const db = firebase.firestore();
    db.collection("posts").add({
      ...post,
      uid
    }).then(ref => {
      db.collection('posts').doc(ref.id).onSnapshot(doc => {
        const data = doc.data()
        if (data.result === false || data.result === true) {
          commit('setResult', data.result || !!data.tweetId)
          return
        }
      })
    })
  }
}

export const mutations = {
  setResult(state, result) {
    state.latestResult = result
  }
}
