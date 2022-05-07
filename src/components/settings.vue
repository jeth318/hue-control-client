<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="indigo"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Settings
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch
                v-model="internalAutomatorActive"
                color="purple"
                @change="toggleAutomator"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable automator</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="menu = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { setAutomatorState } from "../rest/rest.resource";
  export default {
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      internalAutomatorActive: true,
    }),
    methods: {
        async toggleAutomator() {
            await setAutomatorState({ active: this.internalAutomatorActive });
        }
    },
    computed: {
        ...mapGetters(["hasFetchedAllData"]),
    },
    watch: {
        hasFetchedAllData: {
            handler() {
                this.internalAutomatorActive = this.automator.active;
            },
        },
    }
  }
</script>
<style scoped>
.card {
    text-align: center;
}
</style>