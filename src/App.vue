<template>
  <v-app dark>
    <div class="app-grid">
      <div
        v-if="hasFetchedAllData"
        class="groups-container"
      >
        <light-group
          v-for="(group, index) in groupsSorted"
          :key="index"
          :group-id="group.id"
        ></light-group>
        <div class="automator-toggle">
          <div>automator is {{ internalAutomatorActive ? "enabled" : "disabled" }}</div>
          <v-switch
            v-model="internalAutomatorActive"
            @change="toggleAutomator"
          ></v-switch>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </v-app>
</template>

<script>
import LightGroup from "./components/light-group.vue";
import toggleFullScreen from "./utils/window-util";
import { mapGetters } from "vuex";
import Rvc from "./components/rvc.vue";
import Tv from "./components/tv.vue";
import { setAutomatorState } from "./rest/rest.resource";

export default {
  name: "App",
  data: () => ({
    fullScreen: false,
    internalAutomatorActive: null,
  }),
  components: { LightGroup, Rvc, Tv },
  created() {
    this.$store.dispatch("updateAutomator");
    this.$store.dispatch("updateLights");
    this.$store.dispatch("updateTv");
  },
  mounted() {
    setInterval(() => {
      this.$store.dispatch("updateLights");
    }, 10000);
  },
  computed: {
    ...mapGetters(["automator", "groups", "hasFetchedAllData"]),
    groupsSorted() {
      const sortOrder = {
        Vardagsrum: 1,
        Kök: 2,
        Badrum: 3,
        Hallen: 4,
      };

      // Vardagsrum = id 1
      // Badrum = id 2
      // Kök = id 3
      // Hallen = id 5

      return Object.keys(this.groups)
        .map((key) => ({ ...this.groups[key], id: key }))
        .sort((a, b) => sortOrder[a.name] - sortOrder[b.name], []);
    },
    isAppleDevice() {
      return (
        ["iPhone", "iPad", "iPod"].filter((device) =>
          navigator.userAgent.includes(device)
        ).length > 0
      );
    },
  },
  methods: {
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen;
      toggleFullScreen();
    },
    onAutomatorStateChanged(prevVal, val) {
      console.log({ prevVal, val });
      if (prevVal) {
        // this.internalAutomatorActive = prevVal.active;
      }
    },
    async toggleAutomator() {
      await setAutomatorState({ active: this.internalAutomatorActive });
    },
  },
  watch: {
    hasFetchedAllData: {
      handler() {
        this.internalAutomatorActive = this.automator.active;
      },
    },
  },
};
</script>

<style lang="css" scoped>
.app-grid {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.groups-container {
  display: flex;
  flex-wrap: wrap;
}

.toggle-button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.iot-gadgets {
  display: flex;
}
</style>
