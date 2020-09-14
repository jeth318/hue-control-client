<template>
  <div class="group">
    <h3>{{ group.name }}</h3>
    <v-switch @change="toggleGroup" v-model="group.state.any_on"></v-switch>
    <light v-for="(value, index) in group.lights" :key="index" :light-id=value></light>
  </div>
</template>

<script>
import Light from "./light.vue";
import { toggleGroup } from "../resource/hue-config.js";
import { mapGetters } from "vuex";

export default {
  name: "light-group",
  components: { Light },
  props: {
    groupId: { type: String },
  },
  computed: {
    ...mapGetters(["lights", "groups"]),
    group() {
      return this.groups[this.groupId];
    },
    isAnyLightOn() {
      return this.group.state.any_on;
    }
  },
  methods: {
    async toggleGroup() {
      await toggleGroup(
        this.group,
        this.lights
      );
      this.$store.dispatch("update");
    },
  },
};
</script>

<style lang="css" scoped>
.group {
  border: 1px solid black;
  padding: 30px;
  border-radius: 5px;
  margin-top: 40px;
  flex: 0 50%;
}
</style>