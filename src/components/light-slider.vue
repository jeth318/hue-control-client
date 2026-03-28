<template>
    <div class="slider-wrapper">
        <v-slider
            :disabled="!isActive"
            @change="onSlideEnd"
            v-model="light.state.bri"
            :min="0"
            :max="254"
            color="#F5A623"
            track-color="rgba(255,255,255,0.08)"
            thumb-color="#F5A623"
            thumb-label
            :thumb-size="28"
            hide-details
            dense
        ></v-slider>
    </div>
</template>

<script>
import { setBrightness, toggleLight } from '../rest/rest.resource.js';
export default {
    name: 'light-slider',
    props: {
        isActive: { type: Boolean, default: false },
        light: { type: Object },
        lightId: { type: String },
    },
    methods: {
        async onSlideEnd() {
            await setBrightness(this.lightId, this.light.state.bri);
            if (this.light.state.bri === 0) {
                await toggleLight(this.light);
            }
            this.$store.dispatch('updateLights');
        },
    }
};
</script>

<style lang="css">
.slider-wrapper {
    flex: 1;
    min-width: 0;
}

.slider-wrapper .v-slider {
    margin: 0;
}

.slider-wrapper .v-slider__thumb-container,
.slider-wrapper .v-slider__thumb-label {
    pointer-events: auto !important;
}

.slider-wrapper .v-slider__thumb {
    width: 14px;
    height: 14px;
    left: -7px;
}

.slider-wrapper .v-slider__track-fill {
    border-radius: 4px;
}

.slider-wrapper .v-slider__track-background {
    border-radius: 4px;
}
</style>