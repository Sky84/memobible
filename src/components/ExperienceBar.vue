<template>
  <div class="exp-progress-bar">
    Experience
    <div class="progress">
      <div
        class="progress-bar bg-warning"
        role="progressbar"
        :style="{width:experience+'%'}"
        :aria-valuenow="experience"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <div v-if="gain"
        class="progress-bar bg-success"
        role="progressbar"
        :style="{width:gain+'%'}"
        :aria-valuenow="gain"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ExperienceBar extends Vue {
  @Prop(String) readonly experience!: String;
  @Prop(String) readonly gain: String | undefined;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.progress {
  height: 2rem;
}
</style>
