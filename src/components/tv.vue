<template>
    <div class="group">
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>Sony TV</v-card-title>
                </div>
            </v-img>
            <div v-if="tv.error">
                Cannot establish connection to the vacuum cleaner. Try
                refreshing the page.
            </div>
            <div v-else class="actions">
                <v-btn
                    key="power-on"
                    v-if="!internalActive"
                    class="action-item success"
                    @click="toggle('on')"
                    >STARTA</v-btn
                >
                <v-btn
                    key="power-off"
                    v-if="internalActive"
                    class="action-item red"
                    @click="toggle('off')"
                    >STÄNG AV</v-btn
                >
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
            return '/tv.jpeg';
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
