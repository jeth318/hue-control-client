<template>
    <div class="camera" :id="`camera-container-${id}`">
        <canvas :id="`${id}-${quality}`"></canvas>
    </div>
</template>

<script>
import { loadPlayer } from 'rtsp-relay/browser';
import { tapoRelayAddress } from '../rest/rest.config';

export default {
    name: 'camera',
    props: {
        id: { type: String },
        hd: { type: Boolean, default: false }
    },
    data: () => ({
        player: {}
    }),
    mounted() {
        this.$nextTick(function () {
            this.mountCamera()
        })
    },
    methods: {
        async mountCamera() {
            console.log(`${this.id}-${this.quality}`);
            const player = await loadPlayer({
                url: `ws://${tapoRelayAddress}/${this.quality}/${this.id}`,
                canvas: document.getElementById(`${this.id}-${this.quality}`),
                onDisconnect: () => console.log('Connection lost!'),
            });
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
    canvas {
        width: 100%;
    }
</style>