import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    isLoggedIn: !!localStorage.getItem('token')
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      state.isLoggedIn = true
      localStorage.setItem('token', token)
    },
    clearToken(state) {
      state.token = ''
      state.isLoggedIn = false
      localStorage.removeItem('token')
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token)
    },
    logout({ commit }) {
      commit('clearToken')
    }
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    token: (state) => state.token
  }
})



