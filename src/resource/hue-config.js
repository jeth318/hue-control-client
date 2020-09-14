import axios from 'axios';
import { propEq, find } from 'ramda';
import { config } from 'dotenv';
config();

const ip = process.env.VUE_APP_HUE_BRIDGE_IP;
const user = process.env.VUE_APP_HUE_USER_ID;
const baseUrl = `http://${ip}/api/${user}`;

export const fetchHueData = async () => {
    const response = await Promise.all([fetchAllGroups(), fetchAllLights()]);
    return parseData({ groups: response[0].data, lights: response[1].data });
}

export const fetchAllLights = async () => await axios({ url: `${baseUrl}/lights` });

export const fetchAllGroups = async () => await axios({ url: `${baseUrl}/groups` });

export const toggleLight = async light => await axios({
        url: `${baseUrl}/lights/${light.id}/state`,
        method: 'PUT',
        data: { on: !light.state.on }
    });

export const toggleGroup = async (group, lights) => {
    const lightsToToggle = group.lights
        .map(lightId => ({ ... find(propEq('id', lightId), lights) }))
        .filter(light => light.state.on === !group.state.any_on)
    const promises = [];
    lightsToToggle.forEach(light => promises.push(toggleLight(light, lights)));
    await Promise.all(promises);
}

export const setBrightness = async (light, brightness) => await axios({
        url: `${baseUrl}/lights/${light.id}/state`,
        method: 'PUT',
        data: { bri: brightness }
    });


const parseData = rawData => {
    const lights = Object.keys(rawData.lights).map(key => ({ ...rawData.lights[key], id: key }));
    const groups = Object.keys(rawData.groups).map(key => ({ ...rawData.groups[key], id: key }));
    return { lights, groups };
}