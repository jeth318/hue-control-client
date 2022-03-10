import { config } from 'dotenv';
config();

const isLocalDev = location.origin.includes('localhost');
const host = isLocalDev ? 'iot.jtdev.se' : process.env.VUE_APP_API_HOST;

const protocol = process.env.VUE_APP_PROTOCOL;

export const baseUrl = `${protocol}://${host}`;
export const endpoints = {
    LIGHTS: 'hue/lights',
    GROUPS: 'hue/groups',
    STATE: 'hue/state',
    RVC_API: 'rvc/state',
    TV: 'tv',
};
