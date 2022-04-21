import Vue from 'vue';
import Vuex from 'vuex';
import {
    fetchHueData,
    fetchRvcData,
    fetchTvData,
} from '../rest/rest.resource.js';
import { isEmpty } from 'ramda';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        groups: {},
        lights: {},
        rvc: {},
        tv: {},
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
        },
        async updateTv(state) {
            const tvData = await fetchTvData();
            state.tv = tvData;
        },
    },
    actions: {
        updateLights(ctx) {
            ctx.commit('updateLights');
        },
        updateRvc(ctx) {
            ctx.commit('updateRvc');
        },
        updateTv(ctx) {
            ctx.commit('updateTv');
        },
    },
    getters: {
        groups: (state) => {
            return state.groups;
        },
        lights: (state) => {
            return state.lights;
        },
        rvc: (state) => {
            return state.rvc;
        },
        tv: (state) => {
            return state.tv;
        },
        hasFetchedAllData: (state) => {
            return (
                !isEmpty(state.groups) &&
                !isEmpty(state.lights)
            );
        },
    },
});
