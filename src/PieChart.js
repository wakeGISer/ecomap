/**
 * Created by Administrator on 2017/3/14/014.
 */

class PieChart {
    constructor(type, options, map) {
        this.options = options;
        this.dataSets = [];
        this._map = map;
        this.max = 0;
        this.layers = [];
        this.setDataType(type);
        this.setOptions(options);

        this.loadLayers();
    }

    setDataType(type) {
        var self = this;
        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];
        var nCitysLength = citys.length;

        _.each(citys, (item, index) => {
            var city = _.filter(window.gdpcitys, (iitem) => {
                return iitem.name == item
            })[0];
            if (parseInt(city[type]) > parseInt(self.max)) {
                self.max = city[type];
            }
        })
        var text = "",preText = "";
        if(type == "gdp"){
            preText = "￥";
            text = "亿元";
        }else if(type == "rate"){
            preText = " 今年保持 ";
            text = "增长率";
        }

        let dataPoint = [],
            dataText = [];
        while (nCitysLength--) {
            let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[nCitysLength]);
            dataPoint.push({
                geometry: {
                    type: "Point",
                    coordinates: [cityCenter.lng, cityCenter.lat]
                },
                count: parseInt(_.filter(window.gdpcitys, (iitem) => {
                    return iitem.name == (citys[nCitysLength])
                })[0][type])
            })
            dataText.push({
                geometry: {
                    type: 'Point',
                    coordinates: [cityCenter.lng, cityCenter.lat + 0.2]
                },
                text: citys[nCitysLength] + preText + parseInt(_.filter(window.gdpcitys, (iitem) => {
                    return iitem.name == (citys[nCitysLength])
                })[0][type]) + text
            });
        }
        this.dataSets.push(new mapv.DataSet(dataPoint));
        this.dataSets.push(new mapv.DataSet(dataText));
    }

    setOptions(options) {
        Object.assign(this.options, options, {max: this.max})
    }

    loadLayers() {
        var self = this;
        this.dataSets.forEach((data, i) => {
            this.layers.push(new mapv.ishowMapLayer(self._map, data, self.options[i]));
        })
    }

    getLayers() {
        return this.layers;
    }
}

export default PieChart;