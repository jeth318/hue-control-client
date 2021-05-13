import Vue from 'vue';
import Vuex from 'vuex';
import { fetchHueData, fetchRvcData } from '../rest/rest.resource.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: {},
    lights: {},
    rvc: {}
  },
  mutations: {
    async update(state) {
      const data = await fetchHueData();
      const rvcData = await fetchRvcData();
      state.lights = data.lights;
      state.groups = data.groups;
      state.rvc = rvcData;
    }
  },
  actions: {
    update(ctx) {
      ctx.commit('update');
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
      }
  }
});
