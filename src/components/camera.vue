<template>
<div class="camera-wrapper">
    <div v-show="isLoading" class="camera-loading">
        <div class="spinner">
            <div class="spinner-ring"></div>
            <v-icon size="20" color="#F5A623">mdi-cctv</v-icon>
        </div>
    </div>
    <div v-show="!isLoading" class="camera-feed" :id="`camera-container-${id}`">
        <canvas :id="`${id}-${quality}`"></canvas>
    </div>
</div>
</template>

<script>
import { loadPlayer } from 'rtsp-relay/browser';
import { tapoRelayAddress } from '../rest/rest.config';

export default {
    name: 'camera',
    props: {
        id: { type: String },
        hd: { type: Boolean, default: true }
    },
    data: () => ({
        isLoading: false,
        player: {}
    }),
    mounted() {
        this.$nextTick(function () {
            this.isLoading = true;
            this.mountCamera()
        })
    },
    destroyed() {
        console.log('DESTROYED');
        if (this.player?.destroy) this.player.destroy()
    },
    methods: {
        async mountCamera() {
            console.log(`${this.id}-${this.quality}`);
            const player = await loadPlayer({
                url: `ws://${tapoRelayAddress}/${this.quality}/${this.id}`,
                canvas: document.getElementById(`${this.id}-${this.quality}`),
                onDisconnect: () => console.log('Connection lost!'),
            });
            this.isLoading = false;
            this.player = player;
        }
    },
    computed: {
        quality() {
            return this.hd ? 'hd' : 'sd'
        }
    }
};
</script>

<style lang="css" scoped>
.camera-wrapper {
    min-height: 180px;
}

.camera-feed canvas {
    width: 100%;
    display: block;
    border-radius: 0;
}

.camera-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
}

.spinner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(245, 166, 35, 0.1);
    border-top-color: #F5A623;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>