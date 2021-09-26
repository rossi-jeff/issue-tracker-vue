const sessionKey = 'issue-tracker-session';
const current = JSON.parse(localStorage.getItem(sessionKey));
const initialState = current || { UUID: null, Name: null, Token: null, UserName: null, SessionId: null, signedIn: false };

export const session = {
		namespaced: true,
    state: initialState,
		actions: {
			loginSuccess({ commit }, payload) {
				commit('loginSuccess', payload);
			},
			loginFailure({ commit }) {
				commit('clear');
				
			},
			logout({ commit }) {
				commit('clear');
			}
		},
		mutations: {
			loginSuccess(state, payload) {
				state.UUID = payload.UUID;
				state.Name = payload.Name;
				state.UserName = payload.UserName;
				state.Token = payload.Token;
				state.SessionId = payload.SessionId;
				state.signedIn = true;
				localStorage.setItem(sessionKey, JSON.stringify(state));
			},
			clear(state) {
				state.UUID = null;
				state.Name = null;
				state.UserName = null;
				state.Token = null;
				state.SessionId = null;
				state.signedIn = false;
				localStorage.removeItem(sessionKey);
			}
		}
}