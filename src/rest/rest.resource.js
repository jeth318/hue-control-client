import axios from 'axios';
import { baseUrl, endpoints, baseUrlRvc } from './rest.config.js';
const { LIGHTS, GROUPS, STATE, RVC_API } = endpoints;

export const fetchRvcData = async () => {
    try {
        const { data } = await fetchRvc();
        return data;
    } catch (error) {
        console.log('OOOOPS', error);
        return { error: true, message: error };
    }
}

export const fetchRvc = async () =>
    await axios({ url: `${baseUrlRvc}/${RVC_API}`, timeout: 2000 });

export const fetchHueData = async () => {
    const response = await Promise.all([fetchAllGroups(), fetchAllLights()]);
    return { groups: response[0].data, lights: response[1].data };
}

export const fetchAllLights = async () =>
    await axios({ url: `${baseUrl}/${LIGHTS}` });

export const fetchAllGroups = async () =>
    await axios({ url: `${baseUrl}/${GROUPS}` });

export const toggleLight = async (lightId, light) => {
    return await axios({
        url: `${baseUrl}/${LIGHTS}/${lightId}`,
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
        url: `${baseUrl}/${LIGHTS}/${lightId}`,
        method: 'PUT',
        data: { bri: brightness }
    });

export const updateRvc = async data =>
    await axios({
        timeout: 2000,
        url: `${baseUrlRvc}/${RVC_API}`,
        method: 'POST',
        data
    });