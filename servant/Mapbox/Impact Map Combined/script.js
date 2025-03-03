const updateBtn = d3.select("#update");

let tooltip = d3.select("#map")
    .append("div")
    .attr("class", "tooltip")

const loadFiles = [
    d3.json("./data/partner_categories_by_county.geojson"),
    d3.csv("./data/partners_county_level.csv", parse)
];

let hoveredTowerId;
let hoveredCircleId;

Promise.all(loadFiles).then(function (data) {
    //data manipulation for local map
    let partners = data[1]

    let heightScale = d3.scaleLinear()
        .domain([0, d3.max(data[0].features, d => d.properties.VALUE)])
        .range([0, 400000])

    let bins = d3.bin()
        .thresholds(10)
        .value(d => d.properties.VALUE)
        (data[0].features)

    data[0].features.forEach((d) => {
        for (let i = 0; i < bins.length; i++) {
            if (d.properties.VALUE >= bins[i].x0 && d.properties.VALUE < bins[i].x1) {
                d.properties.bin = bins[i].x0
            }
        }
    })
    console.log(bins)

    let colorScale = d3.scaleLinear()
        .domain(bins.map(d => d.x0))
        .range(['#002b1e', "#006747", "#00a469", "#00c980", "#25e297", '#cdfee3', '#ffffff'])

    mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/lwelch/cm7jliui4006801r484ev9g8c',
        projection: 'globe',
        zoom: 3.5,
        minZoom: 2,
        pitch: 20,
        bearing: 0,
        center: [-82.9988, 36.9612]
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('load', function () {
        let point_data = {
            "type": "FeatureCollection",
            "features": partners.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.name,
                        full_value: 1,
                        category: d.category,
                        fill: '#25e297'
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            parseFloat(d.lon),
                            parseFloat(d.lat)
                        ]
                    }
                }
            })
        }

        map.addSource("point_data", {
            id: "point_data",
            type: "geojson",
            data: point_data,
            generateId: true
        });

        map.addLayer({
            'id': "points",
            'type': 'circle',
            'source': "point_data",
            'paint': {
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    'white',
                    ['get', 'fill']
                ],
                'circle-radius': 4,
                'circle-opacity': [
                    'case', 
                    ['boolean', ['feature-state', 'hover'], false],
                    1.0,
                    0.5
                ]
            },
            layout: {
                'visibility': "none"
            }
        });

        let geojson = {
            "type": "FeatureCollection",
            "features": data[0].features.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.properties.NAME,
                        full_value: parseFloat(d.properties.VALUE),
                        faith: parseFloat(d.properties['Faith-Based Initiatives']),
                        health: parseFloat(d.properties['Health and Counseling Services']),
                        education: parseFloat(d.properties['Educational and Leadership Development']),
                        community: parseFloat(d.properties['Community Support and Advocacy']),
                        arts: parseFloat(d.properties['Arts, Culture, and Media']),
                        international: parseFloat(d.properties['International Outreach and Development']),
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
            generateId: true
        });

        map.addLayer({
            'id': '3d-buildings',
            'type': 'fill-extrusion',
            'source': 'data',
            "paint": {
                'fill-extrusion-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    'white',
                    ['get', 'fill']
                ],
                'fill-extrusion-height': ['get', 'height']
            },
            layout: {
                'visibility': "visible"
            }
        });

    });

    hoveredTowerId = null;
    hoveredCircleId = null;

    function handleExtrusionTooltip() {
        map.on('mousemove', '3d-buildings', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

            if (hoveredTowerId) {
                map.removeFeatureState(
                    { source: 'data', id: hoveredTowerId }
                );
            }
            hoveredTowerId = e.features[0].id;
            map.setFeatureState(
                { source: 'data', id: hoveredTowerId },
                { hover: true }
            );

            let cx = e.originalEvent.clientX + 10;
            let cy = e.originalEvent.clientY - 10;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(
                    e.features[0].properties.name + " County<br>Total Impact: " +
                    e.features[0].properties.full_value +
                    "<br>Faith-Based Initiatives: " +
                    e.features[0].properties.faith +
                    "<br>Health and Counseling Services: " +
                    e.features[0].properties.health +
                    "<br>Educational and Leadership Development: " +
                    e.features[0].properties.education +
                    "<br>Community Support and Advocacy: " +
                    e.features[0].properties.community +
                    "<br>Arts, Culture, and Media: " +
                    e.features[0].properties.arts +
                    "<br>International Outreach and Development: " +
                    e.features[0].properties.international
                )

        });

        map.on('mouseleave', '3d-buildings', function () {
            tooltip.style("visibility", "hidden")
            map.getCanvasContainer().style.cursor = 'default';

            map.setFeatureState(
                { source: 'data', id: hoveredTowerId },
                { hover: false }
            );
            hoveredTowerId = null;
        });
    }

    function handlePointTooltip() {
        map.on('mousemove', 'points', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

            if (hoveredCircleId) {
                map.removeFeatureState(
                    { source: 'point_data', id: hoveredCircleId }
                );
            }
            hoveredCircleId = e.features[0].id;
            map.setFeatureState(
                { source: 'point_data', id: hoveredCircleId },
                { hover: true }
            );

            let cx = e.originalEvent.clientX + 10;
            let cy = e.originalEvent.clientY - 10;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html("hello")
                .html(
                    e.features[0].properties.name + "<br>" +
                    e.features[0].properties.category
                )
        });

        map.on('mouseleave', 'points', function () {
            tooltip.style("visibility", "hidden")
            map.getCanvasContainer().style.cursor = 'default';

            map.setFeatureState(
                { source: 'point_data', id: hoveredCircleId },
                { hover: false }
            );
            hoveredCircleId = null;
        });
    }

    if (map.getZoom() < 6.95) {
        handleExtrusionTooltip()
    }

    map.on('zoomstart', () => {
        let zoomLevel = map.getZoom()
        if (zoomLevel >= 5) {
            map.setPitch(0)
            // map.setBearing(0)
        }
        if (zoomLevel < 5) {
            map.setPitch(20)
            // map.setBearing(10)
        }
        if (zoomLevel < 6) {
            map.setLayoutProperty('3d-buildings', 'visibility','visible')
            map.setLayoutProperty('points', 'visibility', 'none')
            handleExtrusionTooltip()
        } 
            
        if(zoomLevel >=5.95) {
            map.setLayoutProperty('3d-buildings', 'visibility','none')
            map.setLayoutProperty('points', 'visibility', 'visible')
            handlePointTooltip()
        }
        

    });

    updateBtn.on("click", function () {

        let filtered = partners.filter(d => d.category === "Arts, Culture, and Media")

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
        //yellows
        //colorScale.range(['#483205', '#6c4b08', '#90640a', "#cf8a11", "#f6c414", "#ffd727", "#ffde4b", '#fff0b1', '#ffffff'])

        //blues
        // colorScale.range(['#0b294a', '#103e6e', '#155293', "#1264c3", "#1492fc", "#2bafff", "#53cbff", '#d8f3ff', '#ffffff'])

        //purples
        colorScale.range(['#2f0d45', '#461368', '#5d198a', "#711dac", "#9b2eef", "#af51fb", "#c581ff", '#f4e7ff', '#ffffff'])


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

        point_data = {
            "type": "FeatureCollection",
            "features": filtered.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.name,
                        full_value: 1,
                        category: d.category,
                        fill: "#9b2eef"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            parseFloat(d.lon),
                            parseFloat(d.lat)
                        ]
                    }
                }
            })
        }

        map.getSource("point_data").setData(point_data)

    });


});

function parse(d) {
    return {
        partner: d.PARTNER,
        name: d.CHURCH,
        category: d.MINISTRY_CATEGORY,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        lat: +d.LAT,
        lon: +d.LNG,
        n: 1,
        county: d.COUNTY
    }
}





