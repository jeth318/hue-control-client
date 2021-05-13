<template>
    <div class="group">
        <v-card class="card mx-auto card">
            <v-img class="image white--text align-end" :src="imageUrl">
                <div class="name-wrapper">
                    <v-card-title>Dammsugare</v-card-title>
                </div>
            </v-img>
            <div class="actions">
                <v-switch @change="toggle" v-model="isActive"></v-switch>
                <v-btn class="action-item" :disabled="rvc.mode === 'standby'" :class="{ warning: true }" @click="toggle({ 'mode': 'standby' })">PAUSA</v-btn>
                <v-btn class="action-item" :class="{ primary: true }" @click="toggle({ 'mode': 'chargego' })">LADDA</v-btn>
            </div>
        </v-card>
    </div>
</template>

<script>
import { updateRvc } from '../rest/rest.resource.js';
import { mapGetters } from 'vuex';

export default {
    name: 'rvc',
    data: () => ({
        isActive: false
    }),
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
            console.log({ modeHandler: mode });
            this.isActive = (mode != 'chargego' && mode !== 'standby');
            console.log('THIS.ISACTIVE', this.isActive);
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
}

.action-item {
    margin: 10px;
    width: 100px;
}

.card {
    width: 242px;
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