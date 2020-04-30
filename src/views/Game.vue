<template>
  <div class="game">
    <div v-if="currentStep ==  STEP_PHASE.LEARN" class="game__learn">
      <div class="game__step-title">Etape 1 : Apprendre.</div>
      <div class="game__learn__content">
        <div class="game__learn__content__text">{{currentVerse.text}}</div>
        <div class="game__learn__content__ref">{{currentVerse.ref}}</div>
      </div>
    </div>
    <div v-else-if="currentStep ==  STEP_PHASE.WRITE" class="game__write">
      <div class="game__step-title">Etape 2 : Ecrivez.</div>
      <div class="game__write__content">
        <textarea
          type="text"
          class="game__write__content__input"
          v-model="currentAnswer"
          :style="{width:currentVerse.guessing.length+'ch'}"
          :placeholder="currentVerse.guessing"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { bibleAxios } from '../axios/bible';

@Component
export default class Game extends Vue {
  private STEP_PHASE = {
    LEARN: 1,
    WRITE: 2
  };
  private bible: Array<any> = [];
  private currentVerse = { text: '', ref: '', guessing: '' };
  private currentAnswer: string = '';
  get currentStep() {
    return this.$store.state.game.step;
  }

  formatGuessing(answer: string) {
    let guessing = '';
    const specialStrings = [',', '.', '?', ':', '!', ';'];
    for (let i = 0; i < answer.length; i++) {
      if (specialStrings.indexOf(answer[i]) > -1) {
        guessing += answer[i];
        continue;
      }
      guessing += '_';
    }
    return guessing;
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
    &__content {
      display: flex;
      justify-content: center;
      textarea {
        font-weight: 550;
        resize: none;
        border: none;
        max-width: 100%;
        &:focus {
          outline: none;
        }
      }
    }
  }
  &__learn {
    &__content {
      font-weight: 550;
      &__ref {
        padding-top: 1rem;
        text-transform: uppercase;
        font-family: sans-serif;
        letter-spacing: 0.2rem;
      }
    }
  }
}
</style>
