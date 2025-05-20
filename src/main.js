/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { registerGlobalComponents } from "@/plugins/global-component";

// css
import "@/styles/main.css";
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/900.css'
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { vMaska } from "maska/vue"

const app = createApp(App);

registerPlugins(app);

registerGlobalComponents(app);

app.directive('maska', vMaska)

app.mount("#app");
