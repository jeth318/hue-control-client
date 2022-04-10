const isLocalDev = location.origin.includes('localhost');
const host = isLocalDev ? 'http' : 'iot.jtdev.se';

const protocol = isLocalDev ? 'http' : 'https';

export const baseUrl = `${protocol}://${host}`;
export const endpoints = {
    LIGHTS: 'hue/lights',
    GROUPS: 'hue/groups',
    STATE: 'hue/state',
    RVC_API: 'rvc/state',
    TV: 'tv',
};
