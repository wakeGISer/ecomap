/**
 * Created by Administrator on 2017/3/14/014.
 */
import _ from "lodash";

class Area {
    constructor(options, fn, type) {

        this.options = options;
        this.callback = fn;
        this.type = type;
        this.loadCitysData();
        this.getDataSet();
    }

    loadCitysData() {
        let self = this;
        this.provinces = {
            "北京": 0,
            "天津": 0,
            "河北": 0,
            "山西": 0,
            "内蒙古": 0,
            "辽宁": 0,
            "吉林": 0,
            "上海": 0,
            "江苏": 0,
            "浙江": 0,
            "安徽": 0,
            "福建": 0,
            "江西": 0,
            "山东": 0,
            "河南": 0,
            "湖北": 0,
            "湖南": 0,
            "广东": 0,
            "广西": 0,
            "海南": 0,
            "重庆": 0,
            "四川": 0,
            "贵州": 0,
            "云南": 0,
            "西藏": 0,
            "陕西": 0,
            "甘肃": 0,
            "青海": 0,
            "宁夏": 0,
            "新疆": 0,
            "黑龙江": 0
        };
        if (this.type == "gdp") {  //GDP地区生产总值
            Object.keys(this.provinces).forEach(function (item) {
                self.provinces[item] = _.filter(window.gdpcitys, function (iitem) {
                    return iitem.name == item;
                })[0].gdp;
            })
        } else if (this.type == "area") { //平均面积GDP
            Object.keys(this.provinces).forEach(function (item) {
                let p = _.filter(window.gdpcitys, function (iitem) {
                    return iitem.name == item;
                })[0];
                self.provinces[item] = p.gdp * Math.pow(10, 4) / p.area;
            })
        } else if (this.type == "pop") { //人均GDP
            Object.keys(this.provinces).forEach(function (item) {
                let p = _.filter(window.gdpcitys, function (iitem) {
                    return iitem.name == item;
                })[0];
                self.provinces[item] = p.gdp / p.pop;
            })
            console.log(self.provinces);
        }else if(this.type == "percent"){ //GDP 增长率
            Object.keys(this.provinces).forEach(function (item) {
                self.provinces[item] = parseInt(_.filter(window.gdpcitys, function (iitem) {
                    return iitem.name == item;
                })[0].rate);
            })
        }

    }

    getDataSet() {
        var self = this;
        $.get('geoJson/china.json', function (geojson) {

            var dataSet = mapv.geojson.getDataSet(geojson);

            var data = dataSet.get({
                filter: function (item) {
                    if (!self.provinces[item.name]) {
                        return false;
                    }

                    item.count = self.provinces[item.name];
                    return true;
                }
            });
            self.dataSet = new mapv.DataSet(data);
            self.callback.call(self);

        });
    }

    getOptions() {
        return this.options;
    }
}

export default Area;