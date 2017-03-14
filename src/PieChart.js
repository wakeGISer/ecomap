/**
 * Created by Administrator on 2017/3/14/014.
 */

class PieChart {
    constructor(type, options) {
        this.options = {};
        this.dataSet = {};
        this.max = 0;
        this.setDataType(type);
        this.setOptions(options);
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

        let data = [];
        while (nCitysLength--) {
            let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[nCitysLength]);
            data.push({
                geometry: {
                    type: "Point",
                    coordinates: [cityCenter.lng, cityCenter.lat]
                },
                count: parseInt(_.filter(window.gdpcitys, (iitem) => {
                    return iitem.name == (citys[nCitysLength])
                })[0][type])
            })
        }
        this.dataSet = new mapv.DataSet(data);
    }

    setOptions(options) {
        Object.assign(this.options, options, {max: this.max})
    }
}

export default PieChart;