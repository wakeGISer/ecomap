/**
 * Created by Administrator on 2017/3/14/014.
 */

import Area from './ClassBreakArea.js';
import PieChart from './PieChart.js';

class Handle {
    constructor(elemId, fn) {
        this.options = null;
        this.dataSet = null;
        var self = this;
        switch (elemId) {
            case 'see_a_gdp':
                let gdpPie = new PieChart("gdp",{
                    fillStyle: 'rgba(255, 50, 50, 0.6)',
                    maxSize: 50,
                    draw: 'bubble'
                });
                this.setDataSet(gdpPie.dataSet);
                this.setOptions(gdpPie.options);
                fn.call(this);
                break;
            case 'see_a_100':
                let ratePie = new PieChart("rate", {
                    fillStyle: 'rgba(255, 250, 50, 0.6)',
                    maxSize: 30,
                    draw: 'bubble'
                });
                this.setOptions(ratePie.options);
                this.setDataSet(ratePie.dataSet);
                fn.call(this)
                break;
            case 'see_a_GDPP':
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
                            var data = dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                }, function () {
                    self.dataSet = this.dataSet;
                    self.options = this.options;
                    fn.call(self);
                },"gdp")
                break;
            case 'see_a_GDP_In':
               /* let areaAverageChina = new Area({
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
                            var data = dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                }, function () {
                    self.dataSet = this.dataSet;
                    self.options = this.options;
                    fn.call(self);
                })
                break;*/
               break;
            case 'see_a_GDP_PArea':
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
                            var data = self.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (item.id == data[i].id) {
                                    data[i].fillStyle = 'yellow';
                                } else {
                                    data[i].fillStyle = null;
                                }
                            }
                            self.dataSet.set(data);
                        }
                    },
                    globalAlpha: 0.9,
                    draw: 'choropleth'
                }, function () {
                    self.dataSet = this.dataSet;
                    self.options = this.options;
                    fn.call(self);
                },"area")
                break;
            case 'see_a_GDP_PPop':
                this.setDataType("see_a_gdp");
                break;
            case 'see_a_gdpHeadt':
                this.setDataType("see_a_gdp");
                break;
            case 'see_a_gdpRateHeat':
                this.setDataType("see_a_gdp");
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
}

export default Handle;