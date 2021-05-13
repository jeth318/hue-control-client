
import { config } from 'dotenv';
config();

const isLocalDev = location.origin.includes('localhost');
const isJtDevOrigin = location.origin.includes('jtdev.se');
console.log({ isLocalDev });
const host = isLocalDev 
? 'localhost'
: isJtDevOrigin
    ? 'jtdev.se'
    :  VUE_APP_API_HOST;

const protocol = process.env.VUE_APP_PROTOCOL;
const portNumber = process.env.VUE_APP_PORT;
const port = isLocalDev ? `:${portNumber}` : '';
export const baseUrl = `${protocol}://${host}${port}/lights/api`;
console.log({ baseUrl });
export const endpoints = {
    LIGHTS: 'lights',
    GROUPS: 'groups',
    STATE: 'state',
}