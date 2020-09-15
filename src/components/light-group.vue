<template>
    <div class="group">
        <v-card class="mx-auto card" max-width="400">
            <v-img class="white--text align-end" height="200px" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>{{ group.name }}</v-card-title>
                </div>
            </v-img>
            <div class="lights">
                <v-switch @change="toggleGroup" v-model="group.state.any_on"></v-switch>
                <light v-for="(value, index) in group.lights" :key="index" :light-id="value"></light>
            </div>
        </v-card>
    </div>
</template>

<script>
import Light from './light.vue';
import { toggleGroup } from '../resource/hue-config.js';
import { mapGetters } from 'vuex';

export default {
    name: 'light-group',
    components: { Light },
    props: {
        groupId: { type: String },
    },
    computed: {
        ...mapGetters(['lights', 'groups']),
        group() {
            return this.groups[this.groupId];
        },
        isAnyLightOn() {
            return this.group.state.any_on;
        },
        imageUrl() {
            switch (this.group.name) {
                case 'Vardagsrum':
                    return '/livingroom.jpeg';
                case 'Kök':
                    return '/kitchen.jpg';
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
            this.$store.dispatch('update');
        },
    },
};
</script>

<style lang="css" scoped>
.group {
    border-radius: 5px;
    margin-top: 40px;
    padding: 10px;
}

.name-wrapper {
    background: rgba(0, 0, 0, 0.45);
}

.lights {
    padding: 20px;
}
</style>