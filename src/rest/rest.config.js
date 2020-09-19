
import { config } from 'dotenv';
config();

const host = process.env.VUE_APP_API_HOST;
const protocol = process.env.VUE_APP_PROTOCOL;
const portNumber = process.env.VUE_APP_PORT;
const isLocalDev = process.env.VUE_APP_LOCALDEV;
const port = isLocalDev ? `:${portNumber}` : '';
export const baseUrl = `${protocol}://${host}${port}/lights/api`;
export const endpoints = {
    LIGHTS: 'lights',
    GROUPS: 'groups',
    STATE: 'state',
}