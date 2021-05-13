
import { config } from 'dotenv';
config();

const isLocalDev = location.origin.includes('localhost');
const isJtDevOrigin = location.origin.includes('jtdev.se');
const host = isLocalDev 
? 'localhost'
: isJtDevOrigin
    ? 'jtdev.se'
    :  process.env.VUE_APP_API_HOST;

const protocol = process.env.VUE_APP_PROTOCOL;
const portNumber = process.env.VUE_APP_PORT;
const rvcPortNumber = process.env.VUE_APP_PORT_RVC;
const port = isLocalDev ? `:${portNumber}` : '';
const rvcPort = isLocalDev ? `:${rvcPortNumber}` : '';

export const baseUrl = `${protocol}://${host}${port}`;
export const baseUrlRvc = `${protocol}://${host}${rvcPort}`;
export const endpoints = {
    LIGHTS: 'lights/api/lights',
    GROUPS: 'lights/api/groups',
    STATE: 'lights/api/state',
    RVC_API: 'rvc-api/state',
}