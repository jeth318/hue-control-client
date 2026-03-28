<template>
  <div class="settings-trigger">
    <v-btn
      icon
      small
      class="settings-btn"
      @click="drawer = !drawer"
    >
      <v-icon size="20" color="rgba(232,232,237,0.5)">mdi-cog-outline</v-icon>
    </v-btn>

    <!-- Settings drawer overlay -->
    <transition name="slide-fade">
      <div v-if="drawer" class="settings-overlay" @click.self="drawer = false">
        <div class="settings-panel">
          <div class="panel-header">
            <span class="panel-title">Inställningar</span>
            <v-btn icon small @click="drawer = false">
              <v-icon size="20" color="rgba(232,232,237,0.5)">mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="panel-body">
            <div class="setting-row">
              <div class="setting-info">
                <v-icon size="18" color="#F5A623">mdi-robot</v-icon>
                <span class="setting-label">Automator</span>
              </div>
              <v-switch
                v-model="internalAutomatorActive"
                color="#F5A623"
                hide-details
                dense
                inset
                @change="toggleAutomator"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setAutomatorState } from "../rest/rest.resource";

export default {
    data: () => ({
      drawer: false,
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
.settings-btn {
    transition: all 0.2s ease;
}

.settings-btn:hover {
    background: rgba(255, 255, 255, 0.06) !important;
}

/* Overlay */
.settings-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: flex-end;
}

/* Panel */
.settings-panel {
    width: 320px;
    max-width: 90vw;
    height: 100%;
    background: #141423;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.panel-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #E8E8ED;
}

.panel-body {
    padding: 16px 20px;
    background: #141423;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
}

.setting-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.setting-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(232, 232, 237, 0.8);
}

/* Transitions */
.slide-fade-enter-active {
    transition: opacity 0.3s ease;
}
.slide-fade-enter-active .settings-panel {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
    transition: opacity 0.2s ease;
}
.slide-fade-leave-active .settings-panel {
    transition: transform 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
    opacity: 0;
}
.slide-fade-enter .settings-panel,
.slide-fade-leave-to .settings-panel {
    transform: translateX(100%);
}
</style>