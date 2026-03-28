<template>
  <v-app dark>
    <!-- Top header bar -->
    <header class="app-header">
      <div class="header-left">
        <v-icon color="#F5A623" size="28">mdi-home-automation</v-icon>
        <span class="header-title">Waernsgatan 6</span>
      </div>
      <div class="header-right">
        <span class="header-time">{{ currentTime }}</span>
        <settings></settings>
      </div>
    </header>

    <!-- Main content -->
    <div class="app-content">
      <transition name="fade" mode="out-in">
        <div v-if="hasFetchedAllData" class="dashboard-grid">
          <light-group
            v-for="(group, index) in groupsSorted"
            :key="index"
            :group-id="group.id"
          ></light-group>
        </div>
        <div v-else class="loading-state">
          <div class="loading-pulse"></div>
          <span class="loading-text">Connecting to devices...</span>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import LightGroup from "./components/light-group.vue";
import Settings from './components/settings.vue';
import toggleFullScreen from "./utils/window-util";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data: () => ({
    fullScreen: false,
    internalAutomatorActive: null,
    currentTime: '',
  }),
  components: { LightGroup, Settings },
  created() {
    this.$store.dispatch("updateAutomator");
    this.$store.dispatch("updateLights");
    this.updateClock();
  },
  mounted() {
    setInterval(() => {
      this.$store.dispatch("updateLights");
    }, 10000);
    setInterval(() => this.updateClock(), 1000);
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
    updateClock() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
};
</script>

<style lang="css">
/* ========== Global resets & theme ========== */
* {
  box-sizing: border-box;
}

.theme--dark.v-application {
  background: #0F0F1A !important;
  font-family: 'Inter', 'Roboto', sans-serif;
}

/* ========== Scrollbar ========== */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(245, 166, 35, 0.3);
  border-radius: 3px;
}

/* ========== Glass card utility ========== */
.glass-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(245, 166, 35, 0.15) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
</style>

<style lang="css" scoped>
/* ========== Header ========== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  background: rgba(15, 15, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #E8E8ED;
  letter-spacing: -0.01em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-time {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(232, 232, 237, 0.6);
  font-variant-numeric: tabular-nums;
}

/* ========== Main content ========== */
.app-content {
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* ========== Dashboard grid ========== */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

/* ========== Loading state ========== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 24px;
}

.loading-pulse {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(245, 166, 35, 0.2);
  animation: pulse-ring 1.5s ease-in-out infinite;
}

.loading-text {
  color: rgba(232, 232, 237, 0.5);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4); }
  50% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 20px rgba(245, 166, 35, 0); }
  100% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(245, 166, 35, 0); }
}

/* ========== Transitions ========== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* ========== Responsive ========== */
@media only screen and (max-width: 600px) {
  .app-header {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }
  .app-content {
    padding: 16px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
