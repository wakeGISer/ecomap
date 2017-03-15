<template>
    <div class="wrap-map">
        <div id="map"></div>
        <div id="logo" style="color: #fff;">
            <!--<img src="../globe/logo4.png" alt="">-->
        </div>
    </div>
</template>

<script>
    import bus from './bus.js'
    import Handle from './handleData.js';
    export default{
        data: function () {
            return {
                layers: []
            };
        },
        created: function () {
            let self = this;
            bus.$on('theme.toggle', function (targetId) {
                self.loadTheme(targetId);
            })
        },
        mounted: function () {
            this.map = new IMAP.Map("map", {
                maxZoom: 17,
                zoom: 4,
                center: new IMAP.LngLat(118.76989327025, 32.015743771434),
                baseLayer: false
            });
            let tileLayer = null;
            let tileUrl = "http://cmmre.ishowchina.com/tile?x={x}&y={y}&z={z}&mid=basemap_6&f=png&scale={scale}";
            let scale = window.devicePixelRatio > 1 ? 2 : 1;
            tileUrl = tileUrl.replace("{scale}", scale);
            tileLayer = new LD.BGTileLayer({
                maxZoom: 17,
                baseUrl: [tileUrl, []]
            })
            this.map.addLayer(tileLayer);
        },
        methods: {
            loadTheme: function (themeId) {
                var self = this;
                self.clearLayers();
                let handle = new Handle(themeId, function () {
                    var layers = this.getLayers();
                    self.setLayers(layers);
                }, this.map)
            },
            clearLayers: function () {
                var self = this
                var len = self.layers.length;
                for(let i = 0; i < len; i++){
                    let layer = self.layers.pop();
                    layer.destroy()
                }
            },
            setLayers: function (layers) {
                var self = this;
                layers.forEach((item) => {
                    self.layers.push(item);
                })
            }
        }
    }
</script>