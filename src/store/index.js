import Vue from 'vue';
import Vuex from 'vuex';
import { fetchHueData } from '../resource/hue-config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: {},
    lights: {}
  },
  mutations: {
    async update(state) {
      const data = await fetchHueData();
      state.lights = data.lights;
      state.groups = data.groups;
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
    }
  }
});
