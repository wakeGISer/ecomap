<template>
    <div class="wrap-side">
        <div id="se_title">
            {{title}}
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
                buttons: ["see_a_gdp","see_a_100","see_a_GDPP","see_a_GDP_In","see_a_GDP_PArea","see_a_GDP_PPop","see_a_gdpHeadt","see_a_gdpRateHeat","se_a_globe"],
                title: "地区生产总值"
            };
        },
        created: function () {

        },
        methods: {
            toggleTheme: function (e) {
                let target = e.target;
                this.toggleTittle(target);
                bus.$emit('theme.toggle',target.id);
            },
            toggleTittle: function (elem) {
                switch (elem.id){
                    case "see_a_gdp":
                        this.title = "地区生产总值";
                        break;
                    case "see_a_100":
                        this.title = "地区增长总值平均增长率";
                        break;
                    case "see_a_GDPP":
                        this.title = "各省GDP总值分布图";
                        break;
                    case "see_a_GDP_In":
                        this.title = "各省GDP增长率";
                        break;
                    case "see_a_GDP_PArea":
                        this.title = "各省平均面积GDP";
                        break;
                    case "see_a_GDP_PPop":
                        this.title = "各省人均GDP";
                        break;
                    case "see_a_gdpHeadt":
                        this.title = "人均GDP热力图";
                        break;
                    case "see_a_gdpRateHeat":
                        this.title = "全国主要城市GDP增长率热力图";
                        break;
                }
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