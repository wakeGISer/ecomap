import _ from "lodash";
import Vue from "vue";

import header from "./src/Header.vue";
import sidebar from "./src/Sidebar.vue";
import map_ from "./src/Map.vue";

const app = new Vue({
    el: "#app",
    components: {
        appHeader: header,
        appSidebar: sidebar,
        appMap: map_
    }
})

