<template>
  <div class="header row">
    <ExperienceBar v-if="isInGameMode" :experience="playerExperience" class="col-3" />
    <div v-if="isInGameMode" class="header__countdown">{{timeLeft}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';
import ExperienceBar from './ExperienceBar.vue';

@Component({ components: { ExperienceBar } })
export default class Header extends Vue {
  get timeLeft() {
    return this.$store.state.timeLeft;
  }

  get isInGameMode() {
    return (
      [
        this.$store.state.STEP_PHASE.WRITE,
        this.$store.state.STEP_PHASE.LEARN
      ].indexOf(this.$store.state.game.step) > -1
    );
  }

  get playerExperience() {
    return this.$store.state.player.experience.toString();
  }

  mounted() {
    this.$store.commit('startCountdown');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem 1rem 4rem;
  &__countdown {
    font-size: 3rem;
  }
}
</style>
