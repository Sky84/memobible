import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    MAX_TIME: 30,
    GAIN_EXP_FACTOR: 20,
    STEP_PHASE: {
      LEARN: 1,
      WRITE: 2,
      FINISH: 3
    },
    timeLeft: 0,
    player: {
      experience: 30,
      guessedCnt: 0
    },
    game: {
      step: 1
    }
  },
  getters: {
    gainedExp: state => {
      return state.player.guessedCnt * state.GAIN_EXP_FACTOR;
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
    },
    setStep(state, step) {
      state.game.step = step;
    },
  },
  actions: {
    restartGame(context) {
      this.state.player.guessedCnt++;
      context.commit('setStep', this.state.STEP_PHASE.LEARN);
      context.commit('startCountdown');
    },
    finish(context) {
      context.commit('setStep', this.state.STEP_PHASE.FINISH);
    }
  },
  modules: {
  }
})
