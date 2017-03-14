/**
 * Created by Administrator on 2017/3/14/014.
 */

class PieChart{
    constructor(type,opitons){
        this.options = options;
        this.dataSet = null;
        this.setDataType(type);
    }

    setDataType(type) {
        var self = this;
        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];
        var nCitysLength = citys.length;

        _.each(citys, (item, index)=> {
            var city = window.gdpcitys[citys[nCitysLength]];
            if (city[0].gdp > self.max) {
                self.max = city[0][type];
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
                count: window.gdpcitys[citys[nCitysLength]][type]
            })
        }
        this.dataSet = new mapv.DataSet(data);
    }

}