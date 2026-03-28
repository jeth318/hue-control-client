<template>
    <div class="tv-card">
        <v-card class="glass-card" elevation="0">
            <!-- Header area -->
            <div class="tv-header-area">
                <div class="tv-icon-circle" :class="{ 'tv-icon-circle--on': internalActive }">
                    <v-icon size="28" :color="internalActive ? '#F5A623' : 'rgba(232,232,237,0.3)'">mdi-television</v-icon>
                </div>
                <div class="tv-title-block">
                    <span class="tv-name">Sony TV</span>
                    <span class="tv-status" :class="{ 'tv-status--on': internalActive }">
                        {{ internalActive ? 'På' : 'Av' }}
                    </span>
                </div>
            </div>

            <!-- Error -->
            <div v-if="tv.error" class="tv-error">
                <v-icon size="20" color="#F87171">mdi-alert-circle-outline</v-icon>
                <span>Kan inte ansluta till TV:n.</span>
            </div>

            <!-- Controls -->
            <div v-else class="tv-controls">
                <button
                    class="power-btn"
                    :class="internalActive ? 'power-btn--off' : 'power-btn--on'"
                    @click="toggle"
                >
                    <v-icon size="20">mdi-power</v-icon>
                    <span>{{ internalActive ? 'Stäng av' : 'Starta' }}</span>
                </button>
            </div>
        </v-card>
    </div>
</template>

<script>
import { updateTv } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';

export default {
    name: 'tv',
    data: () => ({
        internalActive: false,
        pollingFunction: null,
    }),
    mounted() {
        this.internalActive = this.tv.active;
        setInterval(async () => {
            console.log('will poll');
            this.$store.dispatch('updateTv');
        }, 60000);
    },
    computed: {
        ...mapGetters(['tv']),
        imageUrl() {
            return '';
        },
        active() {
            return this.tv.active;
        },
    },
    methods: {
        async toggle() {
            this.internalActive = !this.internalActive;
            await updateTv();
            this.$store.dispatch('updateTv');
        },
        onIsActiveChanged(active) {
            this.internalActive = active;
        },
    },
    watch: {
        active: 'onIsActiveChanged',
    },
};
</script>

<style lang="css" scoped>
.tv-card {
    width: 100%;
}

.tv-header-area {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 20px 12px;
}

.tv-icon-circle {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.tv-icon-circle--on {
    background: rgba(245, 166, 35, 0.1);
    border-color: rgba(245, 166, 35, 0.2);
    box-shadow: 0 0 20px rgba(245, 166, 35, 0.1);
}

.tv-title-block {
    display: flex;
    flex-direction: column;
}

.tv-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #E8E8ED;
}

.tv-status {
    font-size: 0.8rem;
    color: rgba(232, 232, 237, 0.4);
    font-weight: 500;
}

.tv-status--on {
    color: #4ADE80;
}

.tv-error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px 20px;
    color: #F87171;
    font-size: 0.85rem;
}

.tv-controls {
    padding: 8px 20px 24px;
}

.power-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    outline: none;
}

.power-btn--on {
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.25);
    color: #4ADE80;
}

.power-btn--on:hover {
    background: rgba(74, 222, 128, 0.18);
    transform: translateY(-1px);
}

.power-btn--off {
    background: rgba(248, 113, 113, 0.1);
    border-color: rgba(248, 113, 113, 0.25);
    color: #F87171;
}

.power-btn--off:hover {
    background: rgba(248, 113, 113, 0.18);
    transform: translateY(-1px);
}
</style>
