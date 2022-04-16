const isLocalDev = location.origin.includes('localhost');

const protocol = 'http'
const hostAddress = process.env.VUE_APP_HOST
console.log({ protocol, hostAddress });
export const baseUrl = `${protocol}://${hostAddress}`;
export const endpoints = {
    LIGHTS: 'iot/hue/lights',
    GROUPS: 'iot/hue/groups',
    STATE: 'iot/hue/state',
    RVC_API: 'iot/rvc/state',
    TV: 'iot/tv',
};
