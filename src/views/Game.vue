<template>
  <div class="game">
    <div v-if="currentStep === steps.LEARN" class="game__learn">
      <div class="game__step-title">Etape 1 : Apprendre.</div>
      <div class="game__learn__content">
        <div class="game__learn__content__text">{{currentVerse.text}}</div>
        <div class="game__learn__content__ref">{{currentVerse.ref}}</div>
      </div>
    </div>
    <div v-else-if="currentStep === steps.WRITE" class="game__write">
      <div class="game__step-title">Etape 2 : Ecrivez.</div>
      <div class="game__write__content">
        <textarea
          type="text"
          class="game__write__content__input"
          v-model="currentAnswer"
          rows="3"
          :placeholder="currentVerse.guessing"
        />
      </div>
      <button type="button" class="btn btn-success mt-5 pl-4 pr-4" @click="onValidate()">Valider</button>
    </div>
    <div v-else-if="currentStep === steps.FINISH" class="game__leaderboard">
      <div class="game__step-title">Bien joué !</div>
      <div class="game__leaderboard__content">
        <ExperienceBar
          class="game__leaderboard__content__exp-progress-bar"
          :experience="playerExperience"
          :gain="gainedExp"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { bibleAxios } from '../axios/bible';
import ExperienceBar from '../components/ExperienceBar.vue';

@Component({ components: { ExperienceBar } })
export default class Game extends Vue {
  private bible: Array<any> = [];
  private currentVerse = { text: '', ref: '', guessing: '' };
  private currentAnswer: string = '';
  private steps = this.$store.state.STEP_PHASE;

  get currentStep() {
    return this.$store.state.game.step;
  }

  get playerExperience() {
    return this.$store.state.player.experience.toString();
  }

  get gainedExp() {
    return this.$store.getters.gainedExp.toString();
  }

  formatGuessing(answer: string) {
    let guessing = '';
    const specialStrings = [',', '.', '?', ':', '!', ';', ' '];
    for (let i = 0; i < answer.length; i++) {
      if (specialStrings.indexOf(answer[i]) > -1) {
        guessing += answer[i];
        continue;
      }
      guessing += '_';
    }
    return guessing;
  }

  onValidate() {
    const answer = this.currentAnswer.toLowerCase();
    if (answer == this.currentVerse.text.toLowerCase()) {
      this.relaunchGame();
      return;
    }
    this.$store.dispatch('finish');
  }

  relaunchGame() {
    this.currentVerse = this.getRandomVerse();
    this.currentAnswer = '';
    this.$store.dispatch('restartGame');
  }

  getRandomVerse() {
    const books = this.bible[0].Books.concat(this.bible[1].Books);
    const randomBookIndex = Math.floor(Math.random() * books.length);
    const randomChapterIndex = Math.floor(
      Math.random() * books[randomBookIndex].Chapters.length
    );
    const randomVerseIndex = Math.floor(
      Math.random() *
        books[randomBookIndex].Chapters[randomChapterIndex].Verses.length
    );
    const reference = [
      books[randomBookIndex].Text,
      randomChapterIndex + 1,
      randomVerseIndex + 1
    ].join(' ');
    return {
      text:
        books[randomBookIndex].Chapters[randomChapterIndex].Verses[
          randomVerseIndex
        ].Text,
      ref: reference,
      guessing: this.formatGuessing(
        books[randomBookIndex].Chapters[randomChapterIndex].Verses[
          randomVerseIndex
        ].Text
      )
    };
  }

  mounted() {
    bibleAxios.get('/1').then(bible => {
      this.bible = bible.data.data[0].Testaments;
      this.currentVerse = this.getRandomVerse();
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.game {
  display: flex;
  justify-content: center;
  padding: 5rem 20rem;
  &__step-title {
    text-align: center;
    font-family: sans-serif;
    font-weight: 900;
    padding: 5rem 0;
  }
  &__write {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__content {
      display: flex;
      justify-content: center;
      width: 80%;
      textarea {
        font-weight: 550;
        resize: none;
        border: none;
        width: 100%;
        &:focus {
          outline: none;
        }
      }
    }
  }
  &__learn {
    &__content {
      width: 80%;
      margin: auto;
      font-weight: 550;
      &__ref {
        padding-top: 1rem;
        text-transform: uppercase;
        font-family: sans-serif;
        letter-spacing: 0.2rem;
      }
    }
  }
  &__leaderboard {
    .game__step-title {
      padding: 1rem 0;
    }
    &__content {
      &__exp-progress-bar {
        width: 40vw;
      }
    }
  }
}
</style>
