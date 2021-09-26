export const alert = {
		namespaced: true,
		state: {
        variant: null,
				message: null,
        visible: false
		},
		actions: {
				success({ commit }, message) {
						commit('success', message);
				},
				info({ commit }, message) {
						commit('info', message);
				},
        error({ commit }, message) {
          commit('error', message);
        },
				clear({ commit }) {
						commit('clear');
				}
		},
		mutations: {
				success(state, message) {
						state.variant = 'success';
						state.message = message;
            state.visible = true;
				},
				info(state, message) {
						state.variant = 'info';
						state.message = message;
            state.visible = true;
				},
        error(state, message) {
          state.variant = 'danger';
          state.message = message;
          state.visible = true;
        },
				clear(state) {
						state.variant = null;
						state.message = null;
            state.visible = false;
				}
		}
}