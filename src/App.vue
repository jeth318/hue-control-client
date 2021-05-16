<template>
    <v-app dark>
        <div class="app-grid">
            <div v-if="hasFetchedAllData" class="groups-container">
                <light-group v-for="(value, index) in groups" :key="index" :group-id="index"></light-group>
                <rvc></rvc>
            </div>
            <div v-else>Loading...</div>
        </div>
        <div v-if="!isAppleDevice" class="toggle-button-wrapper">
            <button class="toggle-button" @click="toggleFullScreen">
                {{ fullScreen ? 'Exit fullscreen' : 'Go fullscreen' }}
            </button>
        </div>
    </v-app>
</template>

<script>
import LightGroup from './components/light-group.vue';
import { toggleFullScreen } from './utils/window-util';
import { mapGetters } from 'vuex';
import Rvc from './components/rvc.vue';

export default {
    name: 'App',
    data: () => ({
        fullScreen: false
    }),
    components: { LightGroup, Rvc },
    created() {
        this.$store.dispatch('update');
    },
    mounted() {
        setInterval(() => {
            this.$store.dispatch('update');
        }, 10000);
    },
    computed: {
        ...mapGetters(['groups', 'hasFetchedAllData']),
        isAppleDevice() {
            return (
                ['iPhone', 'iPad', 'iPod'].filter((device) =>
                    navigator.userAgent.includes(device)
                ).length > 0
            );
        },
    },
    methods: {
        toggleFullScreen() {
            this.fullScreen = !this.fullScreen;
            toggleFullScreen();
        },
    },
};
</script>

<style lang="css" scoped>
.app-grid {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
}

.groups-container {
    display: flex;
    flex-wrap: wrap;
}

.toggle-button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>