import axios from 'axios'
import App from './App.vue'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'

// Application env
window.env = require("../env.js");

const app = createApp(App)

// Create a new axios instance with custom configuration
const instance = axios.create({
    baseURL: env.BASE_URL,
    headers: {
        'Accept-Version': 'v1',
        'Authorization': `Client-ID ${env.ACCESS_KEY}`
    }
});

window.axios = instance

app.use(VueAxios, axios)
app.mount('#app')

