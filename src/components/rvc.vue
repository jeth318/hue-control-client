<template>
    <div class="group" :class="{ closed }">
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>Dammsugare</v-card-title>
                </div>
            </v-img>
            <div class="actions">
                <div class="lock-and-text-wrapper">
                    <div v-if="closed" class="lock-wrapper">
                        <img class="time-lock" src="/time_lock.png" />
                    </div>
                    <div class="time-lock-text" v-if="closed">Tidslås aktivt. Låser upp igen klockan 09:00.</div>
                </div>
                <v-btn
                    class="action-item success"
                    :disabled="mode === 'smart' || closed"
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
                            v-model="suction"
                            value="mute"
                        />
                        <label for="option-one">Svag</label>
                        <input
                            type="radio"
                            id="option-two"
                            v-model="suction"
                            value="normal"
                        />
                        <label for="option-two">Normal</label>
                        <input
                            type="radio"
                            id="option-three"
                            v-model="suction"
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
        suction: null,
    }),
    created() {
        initializeCronJobs(this);
        this.suction = this.rvc.suction || 'normal';
        this.closed = isOutsideOperationalHours;
    },
    computed: {
        ...mapGetters(['rvc']),
        imageUrl() {
            return '/rvc.jpg';
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
        async onSuctionChange(newLevel, level) {
            if (level != null) {
                await updateRvc({ suction: newLevel });
                this.$store.dispatch('updateRvc');
            }
        },
    },
    watch: {
        suction: 'onSuctionChange',
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