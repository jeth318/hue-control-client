<template>
    <v-app dark>
        <div class="app-grid">
            <div v-if="groups" class="groups-container">
                <light-group
                    v-for="(value, index) in groups"
                    :key="index"
                    :group-id="index"
                ></light-group>
            </div>
            <div v-else>Loading...</div>
        </div>
        <div class="toggle-button-wrapper">
                <button class="toggle-button" @click="toggleFullScreen">{{ fullScreen ? 'Exit fullscreen' : 'Go fullscreen' }}</button>
            </div>
    </v-app>
</template>

<script>
import LightGroup from './components/light-group.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'App',
    data: () => ({
        fullScreen: false
    }),
    components: { LightGroup },
    created() {
        this.$store.dispatch('update');
    },
    mounted() {
        setInterval(() => {
            this.$store.dispatch('update');
        }, 60000);
    },
    computed: {
        ...mapGetters(['groups']),
    },
    methods: {
        toggleFullScreen() {
            this.fullScreen = !this.fullScreen;
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen =
                docEl.requestFullscreen ||
                docEl.mozRequestFullScreen ||
                docEl.webkitRequestFullScreen ||
                docEl.msRequestFullscreen;
            var cancelFullScreen =
                doc.exitFullscreen ||
                doc.mozCancelFullScreen ||
                doc.webkitExitFullscreen ||
                doc.msExitFullscreen;

            if (
                !doc.fullscreenElement &&
                !doc.mozFullScreenElement &&
                !doc.webkitFullscreenElement &&
                !doc.msFullscreenElement
            ) {
                requestFullScreen.call(docEl);
            } else {
                cancelFullScreen.call(doc);
            }
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