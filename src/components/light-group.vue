<template>
    <div class="room-card">
        <v-card class="glass-card" elevation="0" :style="cardStyle">
            <!-- Room header (icon is the toggle) -->
            <div class="room-header">
                <div class="room-title-row">
                    <button
                        class="room-icon-circle"
                        :class="{ 'room-icon-circle--on': group.state.any_on }"
                        @click="toggleGroup"
                    >
                        <v-icon size="20" :color="group.state.any_on ? '#F5A623' : 'rgba(232,232,237,0.25)'">{{ roomIcon }}</v-icon>
                    </button>
                    <div class="room-title-block">
                        <span class="room-name">{{ group.name }}</span>
                        <span class="room-status" :class="{ 'room-status--on': group.state.any_on }">
                            {{ group.state.any_on ? 'På' : 'Av' }}
                        </span>
                    </div>
                </div>
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

            <!-- Camera feeds (shown when toggled) -->
            <div v-if="cam1Enabled && group.name === 'Vardagsrum'" class="camera-area">
                <camera :hd="false" id="cam1"></camera>
            </div>
            <div v-if="cam2Enabled && group.name === 'Kök'" class="camera-area">
                <camera :hd="false" id="cam2"></camera>
            </div>

            <!-- Controls area -->
            <div class="controls-area">
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
        roomTint() {
            switch (this.group.name) {
                case 'Vardagsrum': return '245, 166, 35';   // warm amber
                case 'Kök':        return '96, 165, 250';   // cool blue
                case 'Badrum':     return '74, 222, 128';   // fresh green
                case 'Hallen':     return '192, 132, 252';  // soft purple
                default:           return '255, 255, 255';
            }
        },
        cardStyle() {
            return {
                background: `linear-gradient(135deg, rgba(${this.roomTint}, 0.15) 0%, rgba(${this.roomTint}, 0.04) 100%)`,
                borderColor: `rgba(${this.roomTint}, 0.25)`,
            };
        },
    },
    methods: {
        async toggleGroup() {
            this.group.state.any_on = !this.group.state.any_on;
            await toggleGroup(this.group, this.lights);
            this.$store.dispatch('updateLights');
        }
    },
};
</script>

<style lang="css" scoped>
.room-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.room-card >>> .v-card {
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* Room header */
.room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0;
}

.room-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.room-icon-circle {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    padding: 0;
}

.room-icon-circle:hover {
    background: rgba(245, 166, 35, 0.1);
    border-color: rgba(245, 166, 35, 0.2);
}

.room-icon-circle--on {
    background: rgba(245, 166, 35, 0.15);
    border-color: rgba(245, 166, 35, 0.35);
    box-shadow: 0 0 20px rgba(245, 166, 35, 0.15);
}

.room-icon-circle--on:hover {
    background: rgba(245, 166, 35, 0.2);
}

.room-title-block {
    display: flex;
    flex-direction: column;
}

.room-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #E8E8ED;
    letter-spacing: -0.01em;
    line-height: 1.2;
}

.room-status {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(232, 232, 237, 0.35);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.room-status--on {
    color: #F5A623;
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

/* Camera area */
.camera-area {
    padding: 12px 20px 0;
    border-radius: 12px;
    overflow: hidden;
}

/* Controls area */
.controls-area {
    padding: 12px 20px 20px;
    flex: 1;
}

/* Lights list */
.lights-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>