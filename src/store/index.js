import Vue from 'vue';
import Vuex from 'vuex';
import {
    fetchHueData,
    getAutomatorState
} from '../rest/rest.resource.js';
import { isEmpty } from 'ramda';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        groups: {},
        lights: {},
        automator: {}
    },
    mutations: {
        async updateLights(state) {
            const data = await fetchHueData();
            state.lights = data.lights;
            state.groups = data.groups;
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
