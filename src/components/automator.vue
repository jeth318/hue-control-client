<script>
import { mapGetters } from 'vuex';
import { setBrightness, toggleLight, getNetworkClients } from '../rest/rest.resource';
import { getTimeBasedBrightness, turnOnHallwayOnly, isHallwayLight } from '../utils/automator-util';

export default {
    name: 'automator',
    props: {
        enabled: { type: Boolean, default: false }
    },
    data: () => ({
        onlineClients: [],
    }),
    async mounted() {
        this.onlineClients = await this.getNetworkClients();
        setInterval(async () => {
            this.onlineClients = await this.getNetworkClients();
        }, 5000)
    },
    render(h) {
        return false;   
    },
    methods: {
        async onIsHomeChanged(val, prevVal) {
            if (!this.enabled || prevVal === undefined) {
                return null;
            }
            val ? this.autoLightsOn() : this.autoLightsOff()
        },
        async getNetworkClients() {
            const { data } = await getNetworkClients()
            return data;
        },
        async autoLightsOn() {
            let actions = [];
            this.lightsAsArray
                .filter(light => !light.state.on)
                .filter(light => !turnOnHallwayOnly() || isHallwayLight(light))
                .forEach(light => {
                    actions.push(toggleLight(light))
                    actions.push(setBrightness(light.id, this.timeBasedBrightness));
                })
            if (actions.length) {
                await Promise.all(actions);
                this.$nextTick(() => this.$store.dispatch('updateLights')); 
            }
  
        },
        async autoLightsOff() {
            let actions = [];
            this.lightsAsArray
                .filter(light => light.state.on)
                .forEach(light => {
                    console.log(light);
                    actions.push(toggleLight(light))
                })

            if (actions.length) {
                await Promise.all(actions);
                this.$nextTick(() => this.$store.dispatch('updateLights'));
            }
        }
    },
    computed: {
        ...mapGetters(['lights']),
        timeBasedBrightness() {
            return getTimeBasedBrightness();
        },
        isHome() {
            return !!this.onlineClients.find(client => client.mac === "5A:9A:00:9B:AD:73");
        },
        lightsAsArray() {
            return Object.keys(this.lights).map((key) => {
                return { ...this.lights[key], id: key }
            })
        }
    },
    watch: {
        'isHome': {
            immediate: true,
            handler: 'onIsHomeChanged'
        }
    }
};
</script>

<style>
</style>