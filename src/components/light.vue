<template>
    <div>
        <v-btn class="light-button" :class="{ success: isActive }" @click="toggle">{{ name }}</v-btn>
        <light-slider
            :is-active="isActive"
            :initial-value="brightness"
            :light="light"
            :lightId="lightId"
        ></light-slider>
    </div>
</template>

<script>
import LightSlider from './light-slider.vue';
import { toggleLight } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';

export default {
    name: 'light',
    components: { LightSlider },
    props: {
        lightId: { type: String },
    },
    methods: {
        async toggle() {
            await toggleLight(this.lightId, this.light);
            this.$store.dispatch('updateLights');
        },
    },
    computed: {
        ...mapGetters(['lights']),
        light() {
            return this.lights[this.lightId];
        },
        brightness() {
            return this.light.state.bri;
        },
        name() {
            return this.light.name;
        },
        isActive() {
            return this.light.state.on;
        },
    },
};
</script>

<style>
    .light-button {
        font-size: 3.75vw;
    }
</style>