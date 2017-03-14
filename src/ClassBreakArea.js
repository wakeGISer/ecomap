/**
 * Created by Administrator on 2017/3/14/014.
 */
import _ from "lodash";

class Area {
    constructor(options, fn) {

        this.options = options;
        this.callback = fn;
        this.loadCitysData();
        this.getDataSet();
    }

    loadCitysData() {
         let self  = this;
         this.provinces = {
            "北京": 0,
            "天津": 0,
            "河北": 0,
            "山西":0,
            "内蒙古":0,
            "辽宁":0,
            "吉林":0,
            "上海":0,
            "江苏":0,
            "浙江":0,
            "安徽":0,
            "福建":0,
            "江西":0,
            "山东":0,
            "河南":0,
            "湖北":0,
            "湖南":0,
            "广东":0,
            "广西":0,
            "海南":0,
            "重庆":0,
            "四川":0,
            "贵州":0,
            "云南":0,
            "西藏":0,
            "陕西":0,
            "甘肃":0,
            "青海":0,
            "宁夏":0,
            "新疆":0,
            "黑龙江":0
        };
         Object.keys(this.provinces).forEach(function (item) {
             self.provinces[item] = _.filter(window.gdpcitys,function (iitem) {
                 return iitem.name == item;
             })[0].gdp;
         })
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