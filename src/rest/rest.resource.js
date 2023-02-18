import axios from 'axios';
import { baseUrl, endpoints } from './rest.config.js';
const { AUTOMATOR, LIGHTS, GROUPS, ROUTER, RVC_API, TV } = endpoints;

const buildRequest = (method, url) => {
    return {
        url,
        timeout: 10000,
        method
    }
}

export const fetchTvData = async () => {
    try {
        const { data } = await fetchTv();
        return data;
    } catch (error) {
        console.log('OOOOPS', error);
        return { error: true, message: error };
    }
};

export const fetchTv = async () =>
    await axios(buildRequest('GET', `${baseUrl}/${TV}/power`));


export const fetchRvcData = async () => {
    try {
        const { data } = await fetchRvc();
        return data;
    } catch (error) {
        console.log('OOOOPS', error);
        return { error: true, message: error };
    }
};

export const fetchRvc = async () =>
    await axios(buildRequest('GET', `${baseUrl}/${RVC_API}`));
   

export const fetchHueData = async () => {
    const response = await Promise.all([fetchAllGroups(), fetchAllLights()]);
    return { groups: response[0].data, lights: response[1].data };
};

export const fetchAllLights = async () =>
    await axios(buildRequest('GET', `${baseUrl}/${LIGHTS}`));

export const fetchAllGroups = async () =>
    await axios({ url: `${baseUrl}/${GROUPS}` });

export const toggleLight = async (light) => {
    const config = buildRequest('PUT', `${baseUrl}/${LIGHTS}/${light.id}`);
    config.data = { on: !light.state.on }; 
    return await axios(config);
};

export const toggleGroup = async (group, lights) => {
    const lightsToToggle = group.lights
        .map((lightId) => ({ ...lights[lightId], id: lightId }))
        .filter((light) => light.state.on === !group.state.any_on);
    await Promise.all(
        lightsToToggle.map((light) => toggleLight(light))
    );
};

export const setBrightness = async (lightId, brightness) => {
    const config = buildRequest('PUT', `${baseUrl}/${LIGHTS}/${lightId}`);
    config.data = { bri: brightness }; 
    return await axios(config);
}

export const updateRvc = async (data) => {
    const config = buildRequest('POST', `${baseUrl}/${RVC_API}`);
    config.data = data;
    await axios(config);
}

export const updateTv = async () => {
    const config = buildRequest('POST', `${baseUrl}/${TV}/ircc`)
    config.data = { code: 'AAAAAQAAAAEAAAAVAw==' }; 
    await axios(config);
}

export const getNetworkClients = async () => {
    const config = buildRequest('GET', `${baseUrl}/${ROUTER}/online-clients`)
    return axios(config);
}

export const getAutomatorState = async () => {
    const config = buildRequest('GET', `${baseUrl}/${AUTOMATOR}`)
    const { data } = await axios(config);
    return data;
}

export const setAutomatorState = async (payload) => {
    const config = buildRequest('POST', `${baseUrl}/${AUTOMATOR}`)
    config.data = { active: payload.active };
    const { data } = await axios(config);
    return data;
}
