/* eslint-disable no-undef */
import Vue from 'vue'
import Vuex from 'vuex'
import { fetchHueData } from '../resource/hue-config';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    groups: {},
    lights: {}
  },
  mutations: {
    async update (state) {
      const data = await fetchHueData();
      state.lights = data.lights
      state.groups = data.groups
    },
    updateGroups(state, payload) {
      state.groups = remapGroups(state, payload.group);
      state.lights = remapMultipleLights(state, payload.lightsToToggle)
    },
    updateLight(state, payload) {
      state.lights = remapLights(state, payload);
    }
  },
  actions: {
    update (ctx) {
      ctx.commit('update')
    },
    updateLight (ctx, payload) {
      ctx.commit('updateLight', payload)
    },
    updateGroups (ctx, payload) {
      ctx.commit('updateGroups', payload)
    }
  },
  getters: {
    config: state => {
      return state.config;
    },
    groups: state => {
      return state.groups;
    },
    lights: state => {
      return state.lights;
    },
    resourcelinks: state => {
      return state.resourcelinks;
    },
    rules: state => {
      return state.rules;
    },
    scenes: state => {
      return state.scenes;
    },
    schedules: state => {
      return state.schedules;
    },
    sensors: state => {
      return state.sensors;
    }
  },
  modules: {
  }
})

const remapLights = (state, light) => {
  return state.lights.map(stateLight => stateLight.id === light.id
    ? { ...light }
    : { ...stateLight });
};

const remapMultipleLights = (state, lights) => {
  console.log('asddsad');
  const lightIds = lights.map(light => light.id);
  return state.lights.map((stateLight) => lightIds.includes(stateLight.id)
    ? { ...stateLight, state: { ...stateLight.state, on: !stateLight.state.on }}
    : { ...stateLight });
};

const remapGroups = (state, group) => {
  return state.groups.map(stateGroup => stateGroup.id === group.id
    ? { ...group }
    : { ...stateGroup });
};
