;(function () {
    /**
     * WMTS 配置
     * WMTS_URL WMTS服务器地址
     * element 页面按钮
     * wmts 页面按钮对应的WMTS服务
     */
    var CONFIG_135 = {
        WMTS_URL: "http://vpn.superng.cn:9124/",
        ELEMENT_WMTS: [{
            element: "se_a_100", // GDP增长率
            wmts: "79/1/186"
        }, {
            element: "se_a_gdp", // GDP
            wmts: "84/1/195"
        }, {
            element: "se_a_GDPP", // GDP等级色彩绘制
            wmts: "81/1/191"
        },{
            element: "se_a_GDP_In", // GDP等级色彩绘制
            wmts: "75/1/180"
        },{
            element: "se_a_GDP_PArea", // GDP等级色彩绘制
            wmts: "83/1/193"
        },{
            element: "se_a_GDP_PPop", // GDP等级色彩绘制
            wmts: "82/1/190"
        }, {
            element: "se_a_gdpHeat", // heatMap
            wmts: ""
        },{
            element: "se_a_gdpRateHeat", // heatMap
            wmts: ""
        }
        ]
    };

    // 当前图层
    var currentLayer = null,currentLegend;

    /**
     * 获取WMTS服务图层
     * @param {String} value 
     */
    function getWmtsLayer(value) {
        if(value){
            var url = CONFIG_135.WMTS_URL + "/ows/tile/" + value + "/1";
            return new L.TileLayer.WMTS(url, {
                layer: "vec",
                tilematrixSet: "c",
                format: "tiles",
                noWrap: true
            });
        }else {
            var cfg = {
                "radius": 12,
                "maxOpacity": 1,
                "scaleRadius": false,
                "useLocalExtrema": false,
                latField: 'y',
                lngField: 'x',
                valueField: 'f',

            };
            var heatmapLayer = new HeatmapOverlay(cfg);
            return heatmapLayer;
        }
    }

    /**
     * 设置当前图层
     * @param {Map} map 地图
     * @param {Layer} layer 图层 
     */
    function setCurrentLayer(map, layer) {
        if (currentLayer) {
            map.removeLayer(currentLayer);
            currentLayer = null;
        }
        currentLayer = layer;
        map.addLayer(currentLayer);
        console.log(heatData);
        currentLayer.setData && currentLayer.setData({
            data:heatData,
        });

    }
	/*
	 * legend切换后放大缩小依旧显示BUG
	 * author by hkh
	 * 
	 * 
	 * */
	var leGendif = false;

    var provinces = ["北京","天津","上海","重庆","河北省","山西省","内蒙古自治区","辽宁省","吉林省","江苏省","浙江省","安徽省","福建省","江西省","江西省","河南省","湖北省","湖南省","广东省","广西壮族自治区","海南省","四川省","贵州省","云南省","西藏自治区","陕西省","甘肃省","青海省","新疆维吾尔自治区","黑龙江省"];
    var citys = ["北京","天津","上海","重庆","石家庄","太原","呼和浩特","哈尔滨","长春","沈阳","济南","南京","合肥","杭州","南昌","福州","郑州","武汉","长沙","广州","南宁","西安","银川","兰州","西宁","乌鲁木齐","成都","贵阳","昆明","拉萨","海口"];
    var nCitysLength = citys.length;
    var max = 0;
    citys.forEach(function (item,i,array) {
        let city =  window.gdpcitys.filter(function (iitem) {
            return iitem.name.includes(item);
        });
        if(city[0].gdp > max){
            max = city[0].gdp;
        }
    })
    /**
     * 添加按钮点击切换图层事件
     * @param {String} id  DOM元素ID值
     * @param {Map} map  
     * @param {Layer} layer 
     */
    function addChangeCurrentLayerEvent(id, map, layer) {
        $("#" + id).click(function () {
            switch(id){
                case 'se_a_100':
                	$("#se_title").text("地区增长总值平均增长率")
                    $('#legendP').css('display','none');
                    $('#legendC').css('display','none');
                    leGendif = false;
                    break;
                case 'se_a_gdp':
                	$("#se_title").text("地区生产总值")
                    $('#legendP').css('display','none');
                    $('#legendC').css('display','none');
                    leGendif = false;
                    // console.log(window.gdpcitys);
                    let data = [];
                    while(nCitysLength--){
                        let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[nCitysLength]);
                        data.push({
                            geometry: {
                                type: "Point",
                                coordinates: [cityCenter.lng, cityCenter.lat]
                            },
                            count: (window.gdpcitys.filter(function (item) {
                                return item.name.includes(citys[nCitysLength])
                            })[0].gdp/max) * 30
                        })
                    }
                    let dataSet = new mapv.DataSet(data);

                    let options = {
                        fillStyle: 'rgba(255, 50, 50, 0.6)',
                        maxSize: 20,
                        max: 30,
                        draw: 'bubble'
                    }

                    let mapvLayer = new mapv.ishowMapLayer(map, dataSet, options);
                    break;
                case 'se_a_gdpHeat':
                	$("#se_title").text("人均GDP热力图")
                	leGendif = false;

                    $('#legendP').css('display','none');
                    $('#legendC').css('display','none');
                    heatData = gdpHeat;
                    break;
                case 'se_a_gdpRateHeat':
                	$("#se_title").text("平均面积GDP热力图")
                	leGendif = false;

                    $('#legendP').css('display','none');
                    $('#legendC').css('display','none');
                    heatData = gdpRateHeat;
                    break;
                case 'se_a_GDPP':
                	$("#se_title").text("GDP")
                	leGendif = true;
                    currentLegend = legend.GDP;
                    changeLegend(currentLegend,true);
                    break;
                case 'se_a_GDP_In':
                	$("#se_title").text("GDP平均百分比")
                	leGendif = true;
                    currentLegend = legend.GDP_In;
                    changeLegend(currentLegend,true);
                    break;
                case 'se_a_GDP_PArea':
                	$("#se_title").text("平均面积GDP")
                	leGendif = true;
                    currentLegend = legend.GDP_PArea;
                    changeLegend(currentLegend,true);
                    break;
                case 'se_a_GDP_PPop':
                	$("#se_title").text("人均GDP")
                	leGendif = true;
                    currentLegend = legend.GDP_PPop;
                    changeLegend(currentLegend,true);
                    break;
            }
            // setCurrentLayer(map, layer);
        });
    }
    //设置图标颜色
    function changeLegend(obj,isProvince){
        var legend ;
//      if(isProvince){
            legend = obj.province;
            $('#legendC').css('display','none');
            $('#legendP').css('display','block');
            $('#legendP').children('p').get(0).innerText = obj.title1.first;
            $('#legendP').children('p').get(1).innerText = obj.title1.last;
            $('#legendP > div > :nth-child(2)').each(function(index){
                var color = legend[index][0] || 'orange';
                $(this).prev().css('background',color);
                if(obj.title1.first == "省GDP年均百分比" || obj.title1.first == "省人均GDP") {
		    		this.innerHTML = legend[index][1] + '-' + legend[index][2];
		    	} else {
		    		this.innerHTML = legend[index][1] + '-' + legend[index][2] + 'X10^3';
		    	}
            })
//      }else {
//          legend = obj.county;
//          $('#legendP').css('display','none');
//          $('#legendC').css('display','block');
//          $('#legendC').children('p').get(0).innerText = obj.title2.first;
//          $('#legendC').children('p').get(1).innerText = obj.title2.last;
//          $('#legendC > div > :nth-child(2)').each(function(index){
//              var color = legend[index][0] || 'orange';
//              $(this).prev().css('background',color);
//              if(obj.title1.first == "省GDP年均百分比" || obj.title1.first == "省人均GDP") {
//		    		this.innerHTML = legend[index][1] + '-' + legend[index][2];
//		    	} else {
//		    		this.innerHTML = legend[index][1] + '-' + legend[index][2] + 'X10^3';
//		    	}
//          })
//      }
    }
    //地图缩放切换图标事件
    // map.on('zoomend',function(){
    // 	if(leGendif == true){
    // 		if(map._zoom < 5){
	 //            changeLegend(currentLegend,true);
	 //        }else {
	 //            changeLegend(currentLegend,false);
	 //        }
    // 	}
    // })
    // 初始化WMTS图层
    CONFIG_135.ELEMENT_WMTS.map(function (ele) {
        // ele.layer = getWmtsLayer(ele.wmts);
        addChangeCurrentLayerEvent(ele.element, map, ele.layer);
    });

    // 设置当前图层
    //setCurrentLayer(map, CONFIG_135.ELEMENT_WMTS[1].layer);

}($, map));