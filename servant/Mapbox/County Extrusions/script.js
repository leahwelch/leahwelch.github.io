const updateBtn = d3.select("#update");
const loadFiles = [
    d3.json("./partner_categories_by_county.geojson")
];

Promise.all(loadFiles).then(function (data) {
    let heightScale = d3.scaleLinear()
        .domain([0, d3.max(data[0].features, d => d.properties.VALUE)])
        .range([0, 400000])

    let bins = d3.bin()
        .thresholds(9)
        .value(d => d.properties.VALUE)
        (data[0].features)

    data[0].features.forEach((d) => {
        for (let i = 0; i < bins.length; i++) {
            if (d.properties.VALUE >= bins[i].x0 && d.properties.VALUE < bins[i].x1) {
                d.properties.bin = bins[i].x0
            }
        }
    })

    let colorScale = d3.scaleLinear()
        .domain(bins.map(d => d.x0))
        .range(['#002b1e', '#00402c', '#00553b', "#006747", "#00a469", "#00c980", "#25e297", '#cdfee3', '#ffffff'])

    mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/lwelch/cm7jliui4006801r484ev9g8c',
        projection: 'globe',
        zoom: 3.5,
        maxZoom: 6,
        minZoom: 2,
        pitch: 20.00,
        bearing: 0,
        center: [-82.9988, 36.9612]
    });


    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('load', function () {
        let geojson = {
            "type": "FeatureCollection",
            "features": data[0].features.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.properties.NAME,
                        full_value: parseFloat(d.properties.VALUE),
                        height: heightScale(parseFloat(d.properties.VALUE)),
                        fill: colorScale(parseFloat(d.properties.bin))
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: d.geometry.coordinates
                    }
                }
            })
        }


        map.addSource("data", {
            type: "geojson",
            data: geojson,
        });

        map.addLayer({
            'id': '3d-buildings',
            'type': 'fill-extrusion',
            'source': 'data',
            "paint": {
                'fill-extrusion-color': ['get', 'fill'],
                'fill-extrusion-height': ['get', 'height']
            }
        });

    });

    updateBtn.on("click", function () {

        bins = d3.bin()
            .thresholds(9)
            .value(d => d.properties['Arts, Culture, and Media'])
            (data[0].features)


        data[0].features.forEach((d) => {
            for (let i = 0; i < bins.length; i++) {
                if (d.properties.VALUE >= bins[i].x0 && d.properties.VALUE < bins[i].x1) {
                    d.properties.bin = bins[i].x0
                }
            }
        })

        heightScale.domain([0, d3.max(data[0].features, d => d.properties['Arts, Culture, and Media'])])

        geojson = {
            "type": "FeatureCollection",
            "features": data[0].features.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.properties.NAME,
                        full_value: parseFloat(d.properties['Arts, Culture, and Media']),
                        height: heightScale(parseFloat(d.properties['Arts, Culture, and Media'])),
                        fill: colorScale(parseFloat(d.properties.bin))
                    },
                    geometry: {
                        type: "Polygon",
                        coordinates: d.geometry.coordinates
                    }
                }
            })
        }

        map.getSource("data").setData(geojson)

    });


});





