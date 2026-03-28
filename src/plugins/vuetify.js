import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#F5A623',
                accent: '#F5A623',
                secondary: '#1A1A2E',
                success: '#4ADE80',
                warning: '#FBBF24',
                error: '#F87171',
                info: '#60A5FA',
                background: '#0F0F1A',
            },
        },
    },
});
