<template>
    <v-app dark>
        <div class="app-grid">
            <automator :enabled="useAutomator" ></automator>
            <div v-if="hasFetchedAllData" class="groups-container">
                <light-group
                    v-for="(group, index) in groupsSorted"
                    :key="index"
                    :group-id="group.id"
                ></light-group>
                <div class="automator-toggle">
                    <div>automator is {{ useAutomator ? 'enabled' : 'disabled' }} </div>
                    <v-switch v-model="useAutomator"></v-switch>

                </div>
            </div>
            <div v-else>Loading...</div>
        </div>
    </v-app>
</template>

<script>
import LightGroup from './components/light-group.vue';
import toggleFullScreen from './utils/window-util';
import { mapGetters } from 'vuex';
import Rvc from './components/rvc.vue';
import Tv from './components/tv.vue';
import Automator from './components/automator.vue';

export default {
    name: 'App',
    data: () => ({
        fullScreen: false,
        useAutomator: true
    }),
    components: { LightGroup, Rvc, Tv, Automator },
    created() {
        this.$store.dispatch('updateLights');
        //this.$store.dispatch('updateRvc');
        this.$store.dispatch('updateTv');
    },
    mounted() {
        setInterval(() => {
            this.$store.dispatch('updateLights');
        }, 10000);
    },
    computed: {
        ...mapGetters(['groups', 'hasFetchedAllData']),
        groupsSorted() {
            const sortOrder = {
                'Vardagsrum': 1,
                'Kök': 2,
                'Badrum': 3,
                'Hallen': 4,
            };

            // Vardagsrum = id 1
            // Badrum = id 2
            // Kök = id 3
            // Hallen = id 5

            return Object.keys(this.groups)
                .map(key => ({...this.groups[key], id: key }))
                .sort((a, b) => sortOrder[a.name] - sortOrder[b.name], [])

        },
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
        }
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

.iot-gadgets {
    display: flex;
}
</style>
