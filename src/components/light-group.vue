<template>
    <div class="group">
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
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
import { toggleGroup } from '../rest/rest.resource.js';
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
            this.$store.dispatch('updateLights');
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

.lights {
    padding: 10px;
}

.card {
    width: 214px;
}

.image {
    height: 200px;
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