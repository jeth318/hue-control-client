<template>
  <v-app dark>
    <div class="app-grid">
      <div class="groups-container">
          <light-group v-for="group in groups" :key="group.id" :group-id=group.id></light-group>
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
      'groups',
      'lights'
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