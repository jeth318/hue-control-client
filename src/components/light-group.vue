<template>
    <div class="room-card">
        <v-card class="glass-card" elevation="0">
            <!-- Room image / camera area -->
            <div class="media-area">
                <picture v-if="cam1Enabled && group.name === 'Vardagsrum'">
                    <camera :hd="false" id="cam1"></camera>
                </picture>
                <picture v-else-if="cam2Enabled && group.name === 'Kök'">
                    <camera :hd="false" id="cam2"></camera>
                </picture>
                <div v-else-if="imageUrl" class="room-image" :style="{ backgroundImage: `url(/home-control${imageUrl})` }"></div>
                <div v-else class="room-image room-image--placeholder">
                    <v-icon size="48" color="rgba(255,255,255,0.15)">{{ roomIcon }}</v-icon>
                </div>
                <!-- Image overlay gradient -->
                <div class="media-overlay"></div>
                <!-- Room name overlay -->
                <div class="room-header">
                    <span class="room-name">{{ group.name }}</span>
                    <div class="room-header-actions">
                        <v-btn
                            v-if="group.name === 'Vardagsrum'"
                            icon
                            small
                            class="cam-btn"
                            :class="{ 'cam-btn--active': cam1Enabled }"
                            @click="cam1Enabled = !cam1Enabled"
                        >
                            <v-icon size="18">mdi-cctv</v-icon>
                        </v-btn>
                        <v-btn
                            v-if="group.name === 'Kök'"
                            icon
                            small
                            class="cam-btn"
                            :class="{ 'cam-btn--active': cam2Enabled }"
                            @click="cam2Enabled = !cam2Enabled"
                        >
                            <v-icon size="18">mdi-cctv</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>

            <!-- Controls area -->
            <div class="controls-area">
                <!-- Master toggle -->
                <div class="master-toggle">
                    <span class="master-label">{{ group.state.any_on ? 'On' : 'Off' }}</span>
                    <v-switch
                        @change="toggleGroup"
                        v-model="group.state.any_on"
                        color="#F5A623"
                        hide-details
                        dense
                        inset
                    ></v-switch>
                </div>
                <!-- Individual lights -->
                <div class="lights-list">
                    <light
                        v-for="(value, index) in group.lights"
                        :key="index"
                        :light-id="value"
                    ></light>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
import Light from './light.vue';
import { toggleGroup } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';
import Camera from './camera.vue';

export default {
    name: 'light-group',
    components: { Camera, Light },
    props: {
        groupId: { type: String }
    },
    data: () => ({
        highRes: false,
        cam1Enabled: false,
        cam2Enabled: false
    }),
    computed: {
        ...mapGetters(['lights', 'groups']),
        group() {
            return this.groups[this.groupId];
        },
        isAnyLightOn() {
            return this.group.state.any_on;
        },
        roomIcon() {
            switch (this.group.name) {
                case 'Vardagsrum': return 'mdi-sofa';
                case 'Kök': return 'mdi-silverware-fork-knife';
                case 'Badrum': return 'mdi-shower';
                case 'Hallen': return 'mdi-door-open';
                default: return 'mdi-lightbulb-group';
            }
        },
        imageUrl() {
            switch (this.group.name) {
                case 'Vardagsrum':
                    return `${this.cam1Enabled ? '' : '/livingroom.jpeg'}`;
                case 'Kök':
                    return `${this.cam2Enabled ? '' : '/kitchen.jpg'}`;
                case 'Hallen':
                    return '/hallway.jpg';
                case 'Badrum':
                    return '/bathroom.jpeg';
                default:
                    return '';
            }
        },
    },
    methods: {
        async toggleGroup() {
            await toggleGroup(this.group, this.lights);
            this.$store.dispatch('updateLights');
        }
    },
};
</script>

<style lang="css" scoped>
.room-card {
    width: 100%;
}

/* Media area */
.media-area {
    position: relative;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
    min-height: 180px;
}

.room-image {
    width: 100%;
    height: 180px;
    background-size: cover;
    background-position: center;
}

.room-image--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.08), rgba(15, 15, 26, 0.5));
}

.media-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(transparent, rgba(15, 15, 26, 0.9));
    pointer-events: none;
}

/* Room header (overlaid on image) */
.room-header {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    z-index: 1;
}

.room-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #E8E8ED;
    letter-spacing: -0.01em;
}

.room-header-actions {
    display: flex;
    gap: 4px;
}

.cam-btn {
    color: rgba(232, 232, 237, 0.4) !important;
    transition: all 0.2s ease;
}

.cam-btn--active {
    color: #F5A623 !important;
    background: rgba(245, 166, 35, 0.12) !important;
}

/* Controls area */
.controls-area {
    padding: 16px 20px 20px;
}

.master-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.master-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(232, 232, 237, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* Lights list */
.lights-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>