<template>
  <v-slider :disabled="!isActive" @change="onSlideEnd" v-model="brigthness" :min="0" :max="254"></v-slider>
</template>

<script>
import { setBrightness, toggleLight } from '../resource/hue-config.js';
export default {
  name: 'light-slider',
  data: () => ({
    brigthness: 0,
  }),
  props: {
    initialValue: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    light: { type: Object },
    lightId: { type: String },
  },
  created() {
    this.brigthness = this.initialValue;
  },
  methods: {
    async onSlideEnd() {
      await setBrightness(this.lightId, this.brigthness);
      if (this.brigthness === 0) {
        await toggleLight(this.lightId, this.light);
      }
      this.$store.dispatch('update');
    },
  },
};
</script>