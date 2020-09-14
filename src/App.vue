<template>
  <v-app dark>
    <div class="app-grid">
      <div v-if="groups" class="groups-container">
      <light-group v-for="(value, index) in groups" :key="index" :group-id=index></light-group>
      </div>
    </div>
  </v-app>
</template>

<script>
import LightGroup from './components/light-group.vue';
import { mapGetters } from 'vuex';

export default {
  name: "App",
  components: { LightGroup },
  mounted() {
    this.$store.dispatch('update');
    setInterval(() => {
      this.$store.dispatch('update');
    }, 60000)
  },
  computed: {
    ...mapGetters([
      'groups'
    ])
  },
};
</script>
<style lang="css" scoped>
.app-grid {
  width: 100%;
  display: flex;
  justify-content: center;
}
.groups-container {
  display: flex;
  flex-wrap: wrap;
}
</style>