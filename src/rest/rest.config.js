
import { config } from 'dotenv';
config();

const ip = process.env.VUE_APP_HUE_BRIDGE_IP;
const user = process.env.VUE_APP_HUE_USER_ID;
const protocol = process.env.VUE_APP_PROTOCOL;
export const baseUrl = `${protocol}://${ip}/api/${user}`;
export const endpoints = {
    LIGHTS: 'lights',
    GROUPS: 'groups',
    STATE: 'state',
}