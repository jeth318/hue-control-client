<template>
<div>
    <div v-show="isLoading" class="loading-ripple">
        <div class="lds-ripple"><div></div><div></div></div>
    </div>
    <div v-show="!isLoading" class="camera" :id="`camera-container-${id}`">
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
        this.player.destroy()
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
    canvas {
        width: 100%;
    }

    .loading-ripple-wrapper {
        position: relative;
        height: 355px;
    }

    .loading-ripple {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

</style>