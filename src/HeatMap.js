/**
 * Created by 25106 on 2017-03-14.
 */
import _ from "lodash";

class HeatMap {
    constructor(options,type,map) {
        this.options = options;
        this.dataSet = {};
        this.max = 0;
        this._map = map;
        this.layers = [];
        this.type  = type;
        this.prepareData();
        // this.mergeOptions();
        this.addLayer();
    }

    prepareData() {
        var data = [];
        var sourceData = [];
        if(this.type == "pgdp"){
            sourceData = window.gdpHeat;
        }else if(this.type == "citygdp"){
            sourceData = window.gdpRateHeat;
        }
        var len = sourceData.length;
        _.forEach(sourceData, (item) => {
            if (item.f > this.max) {
                this.max = item.f
            }
        })
        while (len--) {
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [sourceData[len].x, sourceData[len].y]
                },
                count: sourceData[len].f / this.max * 100
            })
        }


        this.dataSet = new mapv.DataSet(data);
    }

    mergeOptions() {
        Object.assign(this.options, {max: this.max});
    }

    getDataSet() {
        return this.dataSet;
    }

    getOptions() {
        return this.options;
    }

    getLayers() {
        return this.layers;
    }

    addLayer() {
        this.layers.push(new mapv.ishowMapLayer(this._map,this.dataSet,this.options));
    }
}

export  default  HeatMap;