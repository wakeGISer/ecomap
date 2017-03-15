/**
 * Created by Administrator on 2017/3/14/014.
 */

import Area from './ClassBreakArea.js';
import PieChart from './PieChart.js';
import HeatMap from './HeatMap.js';

class Handle {
    constructor(elemId, fn, map) {
        this.options = null;
        this.dataSet = null;
        this.map = map;
        var self = this;
        switch (elemId) {
            case 'see_a_gdp':
                let gdpPie = new PieChart("gdp", [{
                    fillStyle: 'rgba(255, 50, 50, 0.6)',
                    maxSize: 50,
                    draw: 'bubble'
                }, {
                    draw: 'text',
                    font: '11px Arial',
                    fillStyle: 'yellow',
                    shadowColor: 'yellow',
                    shadowBlur: 10
                }], this.map);
                this.layers = gdpPie.getLayers();
                fn.call(this);
                break;
            case 'see_a_100':
                let ratePie = new PieChart("rate", [{
                    fillStyle: 'rgba(255, 250, 50, 0.6)',
                    maxSize: 30,
                    draw: 'bubble'
                }, {
                    draw: 'text',
                    font: '11px Arial',
                    fillStyle: 'yellow',
                    shadowColor: 'yellow',
                    shadowBlur: 10
                }], this.map)
                this.layers = ratePie.getLayers();
                fn.call(this);
                break;
            case 'see_a_GDPP':  //GDP地区生产总值
                // this.setDataType("see_a_gdp");
                let areaChina = new Area({
                    splitList: [
                        {
                            start: 0,
                            end: 8.69 * Math.pow(10, 3),
                            value: '#f1eef6'
                        }, {
                            start: 8.69 * Math.pow(10, 3),
                            end: 18.69 * Math.pow(10, 3),
                            value: '#d5bad9'
                        }, {
                            start: 18.69 * Math.pow(10, 3),
                            end: 28.69 * Math.pow(10, 3),
                            value: '#cc97c7'
                        }, {
                            start: 28.69 * Math.pow(10, 3),
                            end: 38.69 * Math.pow(10, 3),
                            value: '#e469af'
                        }, {
                            start: 38.69 * Math.pow(10, 3),
                            end: 48.69 * Math.pow(10, 3),
                            value: '#ee3387'
                        }, {
                            start: 48.69 * Math.pow(10, 3),
                            end: 58.69 * Math.pow(10, 3),
                            value: '#d61e53'
                        }, {
                            start: 58.69 * Math.pow(10, 3),
                            value: '#960b3d'
                        }
                    ],
                    methods: {
                        click: function (item) {
                            console.log(item);
                        },
                        mousemove: function (item) {
                            item = item || {};
                            var data = areaChina.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            areaChina.dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                },fn.bind(this), "gdp", this.map)
                this.layers = areaChina.getLayers();
                break;
            case 'see_a_GDP_In': //GDP 增长率
                let areaPercentChina = new Area({
                    splitList: [
                        {
                            start: 0,
                            end: 5.5,
                            value: '#f1eef6'
                        }, {
                            start: 5.5,
                            end: 6.66,
                            value: '#d5bad9'
                        }, {
                            start: 6.66,
                            end: 7.5,
                            value: '#cc97c7'
                        }, {
                            start: 7.5,
                            end: 9.0,
                            value: '#e469af'
                        }, {
                            start: 9.0,
                            end: 10,
                            value: '#ee3387'
                        }, {
                            start: 10.0,
                            value: '#d61e53'
                        }
                    ],
                    methods: {
                        click: function (item) {
                            console.log(item);
                        },
                        mousemove: function (item) {
                            item = item || {};
                            var data = areaPercentChina.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            areaPercentChina.dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                },fn.bind(this), "percent", this.map)
                this.layers = areaPercentChina.getLayers();
                break;
            case 'see_a_GDP_PArea': //平均面积GDP
                // this.setDataType("see_a_gdp");
                let areaAverageChina = new Area({
                    splitList: [
                        {
                            start: 0,
                            end: 3.69 * Math.pow(10, 3),
                            value: '#f1eef6'
                        }, {
                            start: 3.69 * Math.pow(10, 3),
                            end: 10.69 * Math.pow(10, 3),
                            value: '#d5bad9'
                        }, {
                            start: 10.69 * Math.pow(10, 3),
                            end: 20.69 * Math.pow(10, 3),
                            value: '#cc97c7'
                        }, {
                            start: 20.69 * Math.pow(10, 3),
                            value: '#960b3d'
                        }
                    ],
                    methods: {
                        click: function (item) {
                            console.log(item);
                        },
                        mousemove: function (item) {
                            item = item || {};
                            var data = areaAverage.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            areaAverage.dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                }, fn.bind(this), "area", this.map)
                this.layers = areaAverageChina.getLayers();
                break;
            case 'see_a_GDP_PPop': //人均GDP
                let areaPPOPChina = new Area({
                    splitList: [
                        {
                            start: 0,
                            end: 3.22,
                            value: '#f1eef6'
                        }, {
                            start: 3.22,
                            end: 4.57,
                            value: '#d5bad9'
                        }, {
                            start: 4.57,
                            end: 6.31,
                            value: '#cc97c7'
                        }, {
                            start: 6.31,
                            end: 10.55,
                            value: '#e469cf'
                        }, {
                            start: 10.55,
                            value: '#ee3387'
                        }
                    ],
                    methods: {
                        click: function (item) {
                            console.log(item);
                        },
                        mousemove: function (item) {
                            item = item || {};
                            var data = areaPPOPChina.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            areaPPOPChina.dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                }, fn.bind(this), "pop", this.map)
                this.layers = areaPPOPChina.getLayers();
                break;
            case 'see_a_gdpHeadt': // 人均GDP 热力图
                let gdpHeat = new HeatMap({
                    size: 30,
                    gradient: {0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
                    max: 100,
                    draw: 'heatmap'
                }, "pgdp",this.map);
                this.layers = gdpHeat.getLayers();
                fn.call(self);
                break;
            case 'see_a_gdpRateHeat': // 城市 gdp 增长率 热力图
                // this.setDataType("see_a_gdp");
                let gdpCityHeat = new HeatMap({
                    size: 20,
                    gradient: {0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
                    max: 100,
                    draw: 'heatmap'
                }, "citygdp",this.map)
                this.layers = gdpCityHeat.getLayers();
                fn.call(self);
                break;
            case 'se_a_globe':
                this.setDataType("see_a_gdp");
                break;
        }
    }

    getOptions() {
        return this.options;
    }

    getDataSet() {
        return this.dataSet;
    }

    setOptions(options) {
        this.options = options;
    }

    setDataSet(dataSet) {
        this.dataSet = dataSet;
    }

    getLayers() {
        return this.layers;
    }
}

export default Handle;