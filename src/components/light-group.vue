<template>
    <div class="group">
        <v-card class="card mx-auto card">
            <div class="name-wrapper">
                <v-card-title>{{ group.name }}</v-card-title>
                <v-switch v-if="group.name === 'Vardagsrum'" class="camera-toggle" label="👀" v-model="cam1Enabled"></v-switch>
                <v-switch v-if="group.name === 'Kök'" class="camera-toggle" label="👀" v-model="cam2Enabled"></v-switch>

            </div>
            <div class="media-wrapper">
                <camera v-if="cam1Enabled && group.name === 'Vardagsrum'" :hd="false" id="cam1" ></camera>
                <camera v-if="cam2Enabled && group.name === 'Kök'" :hd="false" id="cam2" ></camera>
                <v-img v-if="imageUrl" class="image white--text align-end" :src="`/homecontrol${imageUrl}`" />
            </div>
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
import Camera from './camera.vue';

export default {
    name: 'light-group',
    components: { Camera, Light },
    props: {
        groupId: { type: String }
    },
    data: () => ({
        highRes: false,
        cam1Enabled: false,
        cam2Enabled: false
    }),
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
                    return `${this.cam1Enabled ? '' : '/livingroom.jpeg'}`;
                case 'Kök':
                    return `${this.cam2Enabled ? '' : '/kitchen.jpg'}`;
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
        }
    },
};
</script>

<style lang="css" scoped>

.camera-toggle {
    padding-right: 5px;
}
.media-wrapper {
    min-height: 213px;
}
.group {
    border-radius: 5px;
    padding: 10px;
}

.name-wrapper {
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.45);
}

.hd-toggle-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lights {
    padding: 10px;
}

.card {
    width: 100%;
}

.image {
    height: 165px;
}

.theme--dark.v-card {
    background-color: unset;
    background: rgba(0, 0, 0, .4);
}

@media only screen and (max-width: 800px) {
  .group {
    width: 100%;
  }
  .card {
      width: 100%;
  }

  .image {
      height: 200px
  }
}

@media only screen and (min-width: 1480px) {
  .group {
    width: 50%;
    padding-top: unset;
  }
  .card {
      width: 100%;
  }

  .image {
      height: 200px
  }
}
</style>