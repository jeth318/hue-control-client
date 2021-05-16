import Vue from 'vue';
import Vuex from 'vuex';
import { fetchHueData, fetchRvcData } from '../rest/rest.resource.js';
import { isEmpty } from 'ramda';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: {},
    lights: {},
    rvc: {}
  },
  mutations: {
    async updateLights(state) {
      const data = await fetchHueData();
      state.lights = data.lights;
      state.groups = data.groups;
    },
    async updateRvc(state) {
        const rvcData = await fetchRvcData();
        state.rvc = rvcData;
      }
  },
  actions: {
    updateLights(ctx) {
      ctx.commit('updateLights');
    },
    updateRvc(ctx) {
        ctx.commit('updateRvc');
      }
  },
  getters: {
    groups: state => {
      return state.groups;
    },
    lights: state => {
      return state.lights;
    },
    rvc: state => {
        return state.rvc;
    },
    hasFetchedAllData: state => {
        return !isEmpty(state.groups) && !isEmpty(state.lights) && !isEmpty(state.rvc)
    }
  }
});
