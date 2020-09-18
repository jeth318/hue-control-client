import axios from 'axios';
import { baseUrl, endpoints } from './rest.config.js';
const { LIGHTS, GROUPS, STATE } = endpoints;

export const fetchHueData = async () => {
    const response = await Promise.all([fetchAllGroups(), fetchAllLights()]);
    return { groups: response[0].data, lights: response[1].data };
}

export const fetchAllLights = async () =>
    await axios({ url: `${baseUrl}/${LIGHTS}` });

export const fetchAllGroups = async () =>
    await axios({ url: `${baseUrl}/${GROUPS}` });

export const toggleLight = async (lightId, light) => {
    await axios({
        url: `${baseUrl}/${LIGHTS}/${lightId}/${STATE}`,
        method: 'PUT',
        data: { on: !light.state.on }
    });
};

export const toggleGroup = async (group, lights) => {
    const lightsToToggle = group.lights
        .map(lightId => ({ ...lights[lightId], id: lightId }))
        .filter(light => light.state.on === !group.state.any_on);
    await Promise.all(lightsToToggle.map(light => toggleLight(light.id, light)));
};

export const setBrightness = async (lightId, brightness) =>
    await axios({
        url: `${baseUrl}/lights/${lightId}/state`,
        method: 'PUT',
        data: { bri: brightness }
    });