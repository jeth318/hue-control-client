<template>
    <div class="group" :class="{ closed }">
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>Dammsugare</v-card-title>
                </div>
            </v-img>
            <div v-if="rvc.error">
                Cannot establish connection to the vacuum cleaner. Try
                refreshing the page.
            </div>
            <div v-else class="actions">
                <div v-if="closed" class="lock-and-text-wrapper">
                    <div class="lock-wrapper">
                        <img class="time-lock" src="/home-control/time_lock.png" />
                    </div>
                    <div class="time-lock-text">
                        Tidslås aktivt. Låser upp igen klockan 09:00.
                    </div>
                </div>
                <v-btn
                    class="action-item success"
                    :disabled="mode === 'smart'"
                    @click="toggle('smart')"
                    >STÄDA</v-btn
                >
                <v-btn
                    class="action-item warning"
                    :disabled="
                        mode === 'standby' ||
                        (mode === 'chargego' && rvc.charging)
                    "
                    @click="toggle('standby')"
                    >PAUSA</v-btn
                >
                <v-btn
                    class="action-item primary"
                    :disabled="isCharging || mode === 'chargego'"
                    @click="toggle('chargego')"
                    >LADDA</v-btn
                >
                <div class="suction-settings">
                    <div class="radio-group">
                        <input
                            type="radio"
                            id="option-one"
                            v-model="internalSuction"
                            value="mute"
                        />
                        <label for="option-one">Svag</label>
                        <input
                            type="radio"
                            id="option-two"
                            v-model="internalSuction"
                            value="normal"
                        />
                        <label for="option-two">Normal</label>
                        <input
                            type="radio"
                            id="option-three"
                            v-model="internalSuction"
                            value="strong"
                        />
                        <label for="option-three">Stark</label>
                    </div>
                </div>
                <div class="rvc-details">
                    <p v-if="currentModeText">⚙️ {{ currentModeText }}</p>
                    <p>🔋 Batteri: {{ rvc.battery }}%</p>
                    <p v-if="isCharging">🏠 Dockad</p>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
import { updateRvc } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';
import {
    isOutsideOperationalHours,
    initializeCronJobs,
} from '../utils/rvc-util.js';

export default {
    name: 'rvc',
    data: () => ({
        isActive: false,
        closed: false,
        internalSuction: null,
        pollingFunction: null,
    }),
    created() {
        initializeCronJobs(this);
        this.internalSuction = this.rvc.suction || 'normal';
        this.closed = isOutsideOperationalHours;
    },
    computed: {
        ...mapGetters(['rvc']),
        imageUrl() {
            return '/home-control/rvc.jpg';
        },
        currentModeText() {
            switch (this.mode) {
                case 'smart':
                    return 'Städar...';
                case 'standby':
                    return 'Pausad';
                case 'chargego':
                    return this.isCharging
                        ? this.rvc.battery === 100
                            ? null
                            : 'Laddar...'
                        : 'Åker hem...';
                default:
                    return '';
            }
        },
        isCharging() {
            return this.rvc.charging;
        },
        isFullyCharged() {
            return this.rvc.battery === 100;
        },
        inMotion() {
            return this.rvc.inMotion;
        },
        mode() {
            return this.rvc.mode;
        },
    },
    methods: {
        async toggle(action) {
            console.log({ action });
            await updateRvc({ mode: action });
            this.$store.dispatch('updateRvc');
        },
        async onInternalSuctionChange(newLevel, level) {
            console.log({ newLevel, level });
            if (level != null && newLevel !== level) {
                await updateRvc({ suction: newLevel });
                this.$store.dispatch('updateRvc');
            }
        },
        async onIsChargingChange(isCharging, previousState) {
            clearInterval(this.pollingFunction);
            console.log({ isCharging, previousState });
            if (previousState === null || (isCharging && this.isFullyCharged)) {
                console.log('Will stop');
                return;
            }
            console.log('POLL');
            console.log('batt', this.rvc.battery);
            this.pollingFunction = setInterval(async () => {
                if (!isCharging || (isCharging && this.rvc.battery < 100)) {
                    console.log('will poll');
                    this.$store.dispatch('updateRvc');
                }
            }, 3000);
            this.$store.dispatch('updateRvc');
        },
    },
    watch: {
        internalSuction: 'onInternalSuctionChange',
        isCharging: {
            immediate: true,
            handler: 'onIsChargingChange',
        },
    },
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
    font-size: 20px;
}

.time-lock {
    width: 60px;
    height: 60px;
}

.lock-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.switch {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.suction-settings {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 15px;
}

.suction-heading {
    margin: 0;
    padding: 0;
}

.lock-and-text-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.time-lock-text {
    width: 50%;
}

/** CUSTOM  */

@import url('https://fonts.googleapis.com/css?family=Roboto');
body {
    background: #332f35;
    font-family: roboto;
}

input[type='radio'] {
    position: absolute;
    visibility: hidden;
    display: none;
}

label {
    color: #9a929e;
    display: inline-block;
    cursor: pointer;
    font-weight: bold;
    padding: 5px 13px;
}

input[type='radio']:checked + label {
    color: #ccc8ce;
    background: #675f6b;
}

label + input[type='radio'] + label {
    border-left: solid 3px #675f6b;
}

.radio-group {
    border: solid 3px #675f6b;
    display: inline-block;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
}

@media only screen and (max-width: 600px) {
    .group {
        width: 100%;
    }
    .card {
        width: 100%;
    }
    .image {
        height: 130px;
    }
}
</style>
