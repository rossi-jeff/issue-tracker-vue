export const loader = {
  namespaced: true,
  state: {
    visible: false
  },
  actions: {
    show({ commit }) {
      commit('show')
    },
    hide({ commit }) {
      commit('hide')
    }
  },
  mutations: {
    show(state) {
      state.visible = true
    },
    hide(state) {
      state.visible = false
    }
  },
}