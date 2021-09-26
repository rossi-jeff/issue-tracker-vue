import Vue from 'vue'
import Vuex from 'vuex'

import { alert } from './alert.module'
import { loader } from './loader.module'
import { session } from './session.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    alert,
    loader,
    session
  }
})
