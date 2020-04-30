import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    MAX_TIME: 30,
    timeLeft: 0,
    player: {
      experience: 30
    },
    game: {
      step: 1
    }
  },
  mutations: {
    startCountdown(state) {
      state.timeLeft = state.MAX_TIME;
      let interval = setInterval(() => {
        state.timeLeft--;
        if (state.timeLeft < 1) {
          clearInterval(interval);
          state.game.step++;
        }
      }, 1000);
    }
  },
  actions: {
  },
  modules: {
  }
})
