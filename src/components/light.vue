<template>
    <div class="light-row">
        <button
            class="light-toggle"
            :class="{ 'light-toggle--active': isActive }"
            @click="toggle"
        >
            <v-icon size="16" :color="isActive ? '#F5A623' : 'rgba(232,232,237,0.3)'">mdi-lightbulb</v-icon>
            <span class="light-name">{{ name }}</span>
        </button>
        <light-slider
            :key="lightId"
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
            await toggleLight({ ...this.light, id: this.lightId });
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

<style lang="css" scoped>
.light-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
}

.light-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    color: rgba(232, 232, 237, 0.5);
    font-size: 0.82rem;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.25s ease;
    outline: none;
    min-width: 0;
    flex-shrink: 0;
}

.light-toggle:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
}

.light-toggle--active {
    background: rgba(245, 166, 35, 0.12);
    border-color: rgba(245, 166, 35, 0.3);
    color: #F5A623;
    box-shadow: 0 0 16px rgba(245, 166, 35, 0.1);
}

.light-toggle--active:hover {
    background: rgba(245, 166, 35, 0.18);
    border-color: rgba(245, 166, 35, 0.4);
}

.light-name {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>