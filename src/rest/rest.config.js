
import { config } from 'dotenv';
config();

const host = process.env.VUE_APP_API_HOST;
const protocol = process.env.VUE_APP_PROTOCOL;
const port = process.env.VUE_APP_PORT;
export const baseUrl = `${protocol}://${host}:${port}`;
export const endpoints = {
    LIGHTS: 'lights',
    GROUPS: 'groups',
    STATE: 'state',
}