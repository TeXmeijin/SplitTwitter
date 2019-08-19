import firebase from 'firebase'

export default ({
  store
}) => {
  if (process.browser) {
    const setUser = (user: firebase.User | null) => {
      if (!user) {
        store.commit('auth/setUser', null)
        return false
      }

      store.commit('auth/setUser', user.providerData[0])
      store.commit('auth/setUid', user.uid)
      firebase.firestore().collection('users').doc(user.uid).onSnapshot(doc => {
        const credential = doc.data()
        store.commit('auth/setCredential', credential)
      }, _ => _)
      return true
    }
    firebase.auth().getRedirectResult().then((result) => {
      const user = result.user
      if (!user || !setUser(user)) {
        return
      }

      const credential = result.credential
      store.dispatch('auth/setCredential', {
        uid: user.uid,
        twitterId: user.providerData[0]!.uid,
        credential
      })
    })
    firebase.auth().onAuthStateChanged(setUser)
  }
}
