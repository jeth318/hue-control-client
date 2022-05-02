import Vue from 'vue';
import Vuex from 'vuex';
import {
    fetchHueData,
    fetchRvcData,
    fetchTvData,
    getAutomatorState
} from '../rest/rest.resource.js';
import { isEmpty } from 'ramda';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        groups: {},
        lights: {},
        rvc: {},
        tv: {},
        automator: {}
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
        async updateAutomator(state) {
            const automatorData = await getAutomatorState();
            state.automator = automatorData;
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
        updateAutomator(ctx) {
            ctx.commit('updateAutomator');
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
        automator: (state) => {
            return state.automator;
        },
        hasFetchedAllData: (state) => {
            return (
                !isEmpty(state.groups) &&
                !isEmpty(state.lights) &&
                !isEmpty(state.automator)
            );
        },
    },
});
