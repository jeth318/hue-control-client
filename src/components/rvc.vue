<template>
    <div class="group" :class="{closed }" >
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>Dammsugare</v-card-title>
                </div>
            </v-img>
            <div class="actions">
            <div v-if="!closed" class="switch-wrapper">
                <v-switch @change="toggle" v-model="isActive"></v-switch>
            </div>
            <div v-else class="lock-wrapper">
                <img class="time-lock" src="/lock.svg" />
            </div>
                <div v-if="closed">Risig tid på dygnet för att dammsuga. Aktiveras igen klockan 10:00.</div> 
                <v-btn class="action-item" :disabled="rvc.mode === 'standby'" :class="{ warning: true }" @click="toggle({ 'mode': 'standby' })">PAUSA</v-btn>
                <v-btn class="action-item" :disabled="rvc.charging" :class="{ primary: true }" @click="toggle({ 'mode': 'chargego' })">LADDA</v-btn>
                <div class="rvc-details">
                    <p>🔋 Batteri: {{ rvc.battery }}%</p>
                    <p v-if="rvc.charging">🏠 Dockad</p>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
import { updateRvc } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';
import scheduler from 'scheduler';
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;


export default {
    name: 'rvc',
    data: () => ({
        isActive: false,
        closed: false,
        timeUntilOpen: null
    }),
    mounted() {
        const ctx = this;
        var closingJob = new CronJob('1 1 21 * * *', function(time) {
            console.log({ time });
            ctx.closed = true;
            console.log('Disableding RVC');
        }, null, true, 'Europe/Stockholm');
        closingJob.start();

        var openingJob = new CronJob('1 1 09 * * *', function(time) {
            console.log({ time });
            ctx.closed = false;
            console.log('Enabling RVC');
        }, null, true, 'Europe/Stockholm');
        openingJob.start();
    },
    computed: {
        ...mapGetters(['rvc']),
        imageUrl() {
            return '/rvc.jpg';
        },
    },
    methods: {
        async toggle(data) {
            this.isActive = data.mode === 'smart';
            await updateRvc(data);
            this.$store.dispatch('update');
        },
        onRvcModeState(mode) {
            this.isActive = (mode != 'chargego' && mode !== 'standby');
        }
    },
    watch: {
        'rvc.mode': 'onRvcModeState'
    }
};
</script>

<style lang="css" scoped>
.group {
    border-radius: 5px;
    padding: 10px;
}

.name-wrapper {
    background: rgba(0, 0, 0, 0.45);
}

.actions {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.action-item {
    margin: 10px;
    width: 200px;
}

.card {
    width: 242px;
}

.image {
    height: 200px;
}

.rvc-details {
    margin-top: 20px;
    width: 100%;
    font-size: 20px
}

.time-lock {
    width: 30px;
    height: 30px;
}

.switch-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.lock-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

@media only screen and (max-width: 600px) {
  .group {
    width: 100%;
  }
  .card {
      width: 100%;
  }

  .image {
      height: 130px
  }
}
</style>