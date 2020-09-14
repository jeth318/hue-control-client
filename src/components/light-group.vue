<template>
  <div class="group">
    <h3>{{ group.name }}</h3>
    <v-switch @change="toggleGroup" v-model="group.state.any_on"></v-switch>
    <light v-for="lightId in group.lights" :key="lightId" :light-id="lightId"></light>
  </div>
</template>

<script>
import Light from "./light.vue";
import { find, propEq } from "ramda";
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
      return find(propEq("id", this.groupId), this.groups);
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