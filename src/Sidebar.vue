<template>
    <div class="wrap-side">
        <div id="se_title">
        </div>
        <div id="fun_button">
            <template v-for="btn in buttons">
                <a href="javascript:void()" v-bind:id="btn" @click="toggleTheme"></a>
            </template>
        </div>
    </div>
</template>

<script>
    import bus from './bus.js';
    export default{
        data: function () {
            return {
                buttons: ["see_a_gdp","see_a_100","see_a_GDPP","see_a_GDP_In","see_a_GDP_PArea","see_a_GDP_PPop","see_a_gdpHeadt","see_a_gdpRateHeat","se_a_globe"]
            };
        },
        created: function () {

        },
        methods: {
            toggleTheme: function (e) {
                let target = e.target;
                bus.$emit('theme.toggle',target.id);
            }
        }
    }
</script>

<style scoped>
    #se_a_gdp {
        background: rgba(0, 0, 0, .7) url("../img/gdp.png") center center no-repeat;
        background-size: 60% auto;
    }

    #se_a_globe {
        background: rgba(0, 0, 0, .7) url("../img/globe.png") center center no-repeat;
        background-size: 60% auto;
    }

    #se_a_100 {
        background: rgba(0, 0, 0, .7) url("../img/100.png") center center no-repeat;
        background-size: 50% auto;
    }

    #se_a_GDP_PPop, #se_a_GDPP, #se_a_GDP_PArea, #se_a_GDP_In {
        background: rgba(0, 0, 0, .7) url("../img/area.png") center center no-repeat;
        background-size: 70% auto;
    }

    #se_a_gdpHeat {
        background: rgba(0, 0, 0, .7) url("../img/heat.png") center center no-repeat;
        background-size: 70% auto;
    }

    #se_a_gdpRateHeat {
        background: rgba(0, 0, 0, .7) url("../img/heat.png") center center no-repeat;
        background-size: 70% auto;
    }
</style>