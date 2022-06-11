const protocol = 'http'
const hostAddress = process.env.VUE_APP_HOST
export const tapoRelayAddress = process.env.VUE_APP_TAPO_RELAY_ADDRESS
export const baseUrl = `${protocol}://${hostAddress}`;
export const endpoints = {
    LIGHTS: 'iot/hue/lights',
    GROUPS: 'iot/hue/groups',
    STATE: 'iot/hue/state',
    RVC_API: 'iot/rvc/state',
    TV: 'iot/tv',
    ROUTER: 'router',
    AUTOMATOR: 'iot/hue/automator',
};
