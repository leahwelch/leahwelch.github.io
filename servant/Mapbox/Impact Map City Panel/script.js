const updateBtn = d3.select("#update");

let tooltip = d3.select("#map")
    .append("div")
    .attr("class", "tooltip")

let panel = d3.select("#map")
    .append("div")
    .attr("id", "panel")

const loadFiles = [
    d3.json("./data/partner_categories_by_county.geojson"),
    d3.csv("./data/partners_county_level.csv", parse)
];

const images = [
    { url: './assets/arts.png', id: 'arts' },
    { url: './assets/community.png', id: 'community' },
    { url: './assets/education.png', id: 'education' },
    { url: './assets/faith.png', id: 'faith' },
    { url: './assets/health.png', id: 'health' },
    { url: './assets/international.png', id: 'international' }
]

let hoveredTowerId;
let hoveredCircleId;
let hoveredIconId;

Promise.all(loadFiles).then(function (data) {
    //data manipulation for local map
    let partners = data[1]
    let faith_data = partners.filter(d => d.category === "Faith-Based Initiatives")
    let health_data = partners.filter(d => d.category === "Health and Counseling Services")
    let education_data = partners.filter(d => d.category === "Educational and Leadership Development")
    let community_data = partners.filter(d => d.category === "Community Support and Advocacy")
    let arts_data = partners.filter(d => d.category === "Arts, Culture, and Media")
    let international_data = partners.filter(d => d.category === "International Outreach and Development")

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

    let colorScale = d3.scaleLinear()
        .domain(bins.map(d => d.x0))
        .range(['#002b1e', "#006747", "#00a469", "#00c980", "#25e297", '#cdfee3', '#ffffff'])

    const bounds = [
        [-140.0, 20.5],
        [-60.1, 60.0]
    ]

    mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/lwelch/cm7jliui4006801r484ev9g8c',
        projection: 'globe',
        zoom: 3,
        minZoom: 1,
        pitch: 20,
        bearing: 0,
        center: [-82.9988, 36.9612],
        maxBounds: bounds
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    let point_data;

    map.on('load', function () {
        images.forEach((img) => {
            map.loadImage(img.url, function (error, res) {
                map.addImage(img.id, res)

                map.addSource('arts_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': arts_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addSource('community_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': community_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addSource('education_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': education_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addSource('faith_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': faith_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addSource('health_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': health_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addSource('international_icons', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': international_data.map(function (d) {
                            return {
                                'type': 'Feature',
                                properties: {
                                    name: d.name,
                                    category: d.category,
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        parseFloat(d.lon),
                                        parseFloat(d.lat)
                                    ]
                                }
                            }
                        })

                    },
                    generateId: true
                });

                map.addLayer({
                    'id': 'arts_icons',
                    'type': 'symbol',
                    'source': 'arts_icons', // reference the data source
                    'layout': {
                        'icon-image': 'arts', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'community_icons',
                    'type': 'symbol',
                    'source': 'community_icons', // reference the data source
                    'layout': {
                        'icon-image': 'community', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'education_icons',
                    'type': 'symbol',
                    'source': 'education_icons', // reference the data source
                    'layout': {
                        'icon-image': 'education', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'faith_icons',
                    'type': 'symbol',
                    'source': 'faith_icons', // reference the data source
                    'layout': {
                        'icon-image': 'faith', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'health_icons',
                    'type': 'symbol',
                    'source': 'health_icons', // reference the data source
                    'layout': {
                        'icon-image': 'health', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'international_icons',
                    'type': 'symbol',
                    'source': 'international_icons', // reference the data source
                    'layout': {
                        'icon-image': 'international', // reference the image
                        'icon-size': 0.2,
                        'visibility': 'none'
                    }
                });
            })
        })

        point_data = {
            "type": "FeatureCollection",
            "features": partners.map(function (d) {
                return {
                    type: "Feature",
                    properties: {
                        name: d.name,
                        full_value: 1,
                        category: d.category,
                        city: d.city,
                        state: d.state,
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
                'circle-radius': 3,
                'circle-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1.0,
                    0.3
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
    hoveredIconId = null;

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

    function handleIconTooltip() {
        map.on('mousemove', 'arts_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'arts_icons', function () {
            tooltip.style("visibility", "hidden")
        });

        map.on('mousemove', 'community_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'community_icons', function () {
            tooltip.style("visibility", "hidden")
        });

        map.on('mousemove', 'education_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'education_icons', function () {
            tooltip.style("visibility", "hidden")
        });

        map.on('mousemove', 'faith_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'faith_icons', function () {
            tooltip.style("visibility", "hidden")
        });

        map.on('mousemove', 'health_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'health_icons', function () {
            tooltip.style("visibility", "hidden")
        });

        map.on('mousemove', 'international_icons', function (e) {
            map.getCanvasContainer().style.cursor = 'pointer';

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

        map.on('mouseleave', 'international_icons', function () {
            tooltip.style("visibility", "hidden")
        });
    }

    if (map.getZoom() < 6.95) {
        handleExtrusionTooltip()
    }

    //use this to filter the data

    map.on('zoomend', () => {

        let zoomLevel = map.getZoom()

        if (zoomLevel < 6) {
            console.log(zoomLevel)
            map.setPitch(20)
            map.setLayoutProperty('3d-buildings', 'visibility', 'visible')
            map.setLayoutProperty('points', 'visibility', 'none')
            handleExtrusionTooltip()
            panel.style("visibility", "hidden")
        } else if (zoomLevel >= 6 && zoomLevel < 8) {
            console.log(zoomLevel)
            map.setPitch(0)
            panel.style("visibility", "visible")
            //only render the points that are in bounds
            map.on('moveend', () => {
                let currentBounds = map.getBounds().toArray()

                let filtered = point_data.features.filter(d => d.geometry.coordinates[0] > currentBounds[0][0] &&
                    d.geometry.coordinates[0] < currentBounds[1][0] &&
                    d.geometry.coordinates[1] > currentBounds[0][1] &&
                    d.geometry.coordinates[1] < currentBounds[1][1])

                let filtered_by_city = d3.groups(filtered, d => d.properties.city).sort((a, b) => d3.descending(a[1].length, b[1].length))

                let top_cities = filtered_by_city.filter((d, i) => i <= 4)
                let top_cities_all_points = point_data.features.filter(d => d.properties.city === top_cities[0][0] ||
                    d.properties.city === top_cities[1][0] || d.properties.city === top_cities[2][0] ||
                    d.properties.city === top_cities[3][0] || d.properties.city === top_cities[4][0]
                )
                let top_cities_by_name = d3.groups(top_cities_all_points, d => d.properties.city)
                top_cities_by_name.forEach((d) => {
                    d.by_category = d3.groups(d[1], d => d.properties.category)
                        .sort((a, b) => d3.descending(a[1].length, b[1].length))
                })
                top_cities_by_name.sort((a, b) => d3.descending(a[1].length, b[1].length))
                panel.html(
                    "<h3>Top Cities in this Region</h3><br><h2>" + top_cities_by_name[0][0] + ", " + top_cities_by_name[0][1][0].properties.state + "</h2>" + top_cities_by_name[0][1].length +
                    " partners<br><br><h2>" + top_cities_by_name[1][0] + ", " + top_cities_by_name[1][1][0].properties.state + "</h2>" + top_cities_by_name[1][1].length +
                    " partners<br><br><h2>" + top_cities_by_name[2][0] + ", " + top_cities_by_name[2][1][0].properties.state + "</h2>" + top_cities_by_name[2][1].length +
                    " partners<br><br><h2>" + top_cities_by_name[3][0] + ", " + top_cities_by_name[3][1][0].properties.state + "</h2>" + top_cities_by_name[3][1].length +
                    " partners<br><br><h2>" + top_cities_by_name[4][0] + ", " + top_cities_by_name[4][1][0].properties.state + "</h2>" + top_cities_by_name[4][1].length +
                    " partners"
                )

                let newData = {
                    "type": "FeatureCollection",
                    "features": filtered
                }
                map.getSource("point_data").setData(newData)
            })
            map.setLayoutProperty('3d-buildings', 'visibility', 'none')
            map.setLayoutProperty('points', 'visibility', 'visible')
            handlePointTooltip()
            map.setLayoutProperty('arts_icons', 'visibility', 'none')
            map.setLayoutProperty('community_icons', 'visibility', 'none')
            map.setLayoutProperty('education_icons', 'visibility', 'none')
            map.setLayoutProperty('faith_icons', 'visibility', 'none')
            map.setLayoutProperty('health_icons', 'visibility', 'none')
            map.setLayoutProperty('international_icons', 'visibility', 'none')

            d3.selectAll(".panel_svg").remove()
        } else if (zoomLevel >= 8 && zoomLevel < 10) {
            console.log(zoomLevel)
            map.setLayoutProperty('3d-buildings', 'visibility', 'none')
            map.setLayoutProperty('points', 'visibility', 'visible')
            handlePointTooltip()
            map.setLayoutProperty('arts_icons', 'visibility', 'none')
            map.setLayoutProperty('community_icons', 'visibility', 'none')
            map.setLayoutProperty('education_icons', 'visibility', 'none')
            map.setLayoutProperty('faith_icons', 'visibility', 'none')
            map.setLayoutProperty('health_icons', 'visibility', 'none')
            map.setLayoutProperty('international_icons', 'visibility', 'none')
            map.on('moveend', () => {
                let currentBounds = map.getBounds().toArray()

                let filtered = point_data.features.filter(d => d.geometry.coordinates[0] > currentBounds[0][0] &&
                    d.geometry.coordinates[0] < currentBounds[1][0] &&
                    d.geometry.coordinates[1] > currentBounds[0][1] &&
                    d.geometry.coordinates[1] < currentBounds[1][1])

                let filtered_by_city = d3.groups(filtered, d => d.properties.city).sort((a, b) => d3.descending(a[1].length, b[1].length))

                let top_city = filtered_by_city.filter((d, i) => i == 0)
                let top_city_all_points = point_data.features.filter(d => d.properties.city === top_city[0][0])

                top_city[0].by_category = d3.groups(top_city[0][1], d => d.properties.category)
                    .sort((a, b) => d3.descending(a[1].length, b[1].length))

                panel.html(
                    "<h2>" + top_city[0][0] + ", " + top_city[0][1][0].properties.state + "</h2>" +
                    "<br><h3>Reach</h3><span>" + top_city_all_points.length + "</span> Partners<br><br><h3>AREAS OF IMPACT</h3>"
                )

                const panel_svg_width = 250;
                const panel_svg_height = 250;
                const panel_svg_margin = {
                    top: 10,
                    right: 30,
                    bottom: 10,
                    left: 0
                }

                let panel_svg = panel.append("svg")
                    .attr("class", "panel_svg")
                    .attr("width", panel_svg_width)
                    .attr("height", panel_svg_height)

                let panel_xScale = d3.scaleLinear()
                    .domain([0, d3.max(top_city[0].by_category, d => d[1].length)])
                    .range([panel_svg_margin.left, panel_svg_width - panel_svg_margin.right])

                let panel_rScale = d3.scaleSqrt()
                    .domain([d3.min(top_city[0].by_category, d => d[1].length), d3.max(top_city[0].by_category, d => d[1].length)])
                    .range([3, 10])

                let panel_yScale = d3.scaleBand()
                    .domain(top_city[0].by_category.map(d => d[0]))
                    .range([panel_svg_margin.top, panel_svg_height - panel_svg_margin.bottom])
                    .padding(0.2)

                const panel_colorScale = d3.scaleOrdinal()
                    .domain(top_city[0].by_category.map(d => d[0]))
                    .range(["#cdfee3", "#25E297", "#00C980", "#00A469", "#006747", "#00553B"]);

                // let panel_circles = panel_svg.selectAll("circle")
                //     .data(top_city[0].by_category)

                // panel_circles.enter()
                //     .append("circle")
                //     .attr("cx", panel_xScale(0) + 15)
                //     .attr("cy", p => panel_yScale(p[0]))
                //     .attr("r", p => panel_rScale(p[1].length))
                //     .attr("fill", p => panel_colorScale(p[0]))


                let panel_bars = panel_svg.selectAll("rect")
                    .data(top_city[0].by_category)
                panel_bars.enter()
                    .append("rect")
                    .attr("x", panel_xScale(0))
                    .attr("height", panel_yScale.bandwidth() / 2)
                    .attr("y", p => panel_yScale(p[0]) + panel_yScale.bandwidth() / 4)
                    .attr("fill", p => panel_colorScale(p[0]))
                    // .merge(panel_bars)
                    // .transition()
                    // .duration(500)
                    .attr("width", p => panel_xScale(p[1].length) - panel_xScale(0))

                let panel_categories = panel_svg.selectAll(".category_label")
                    .data(top_city[0].by_category)

                panel_categories.enter()
                    .append("text")
                    .attr("class", "category_label")
                    .attr("x", panel_svg_margin.left)
                    .attr("y", p => panel_yScale(p[0]))
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .text(p => p[0])

                let panel_values = panel_svg.selectAll(".value_label")
                    .data(top_city[0].by_category)

                panel_values.enter()
                    .append("text")
                    .attr("class", "value_label")
                    .attr("x", p => panel_xScale(p[1].length) + 5)
                    .attr("y", p => panel_yScale(p[0]) + panel_yScale.bandwidth() / 2)
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .text(p => p[1].length)

                let newData = {
                    "type": "FeatureCollection",
                    "features": filtered
                }
                map.getSource("point_data").setData(newData)
            })
        } else {
            console.log(zoomLevel)
            map.setLayoutProperty('points', 'visibility', 'none')
            handleIconTooltip()
            map.setLayoutProperty('arts_icons', 'visibility', 'visible')
            map.setLayoutProperty('community_icons', 'visibility', 'visible')
            map.setLayoutProperty('education_icons', 'visibility', 'visible')
            map.setLayoutProperty('faith_icons', 'visibility', 'visible')
            map.setLayoutProperty('health_icons', 'visibility', 'visible')
            map.setLayoutProperty('international_icons', 'visibility', 'visible')
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

function findClosest(arr, target) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let closestx = arr[0]
    let closesty = arr[0]
    let closest = []
    let minDiffx = Math.abs(target[0] - closestx);
    let minDiffy = Math.abs(target[1] - closesty);

    for (let i = 1; i < arr.length; i++) {
        const currentDiffx = Math.abs(target[0] - arr[i].geometry.coordinates[0]);
        const currentDiffy = Math.abs(target[1] - arr[i].geometry.coordinates[1]);
        if (currentDiffx < minDiffx) {
            minDiffx = currentDiffx;
            closestx = arr[i]
        } else if (currentDiffx === minDiffx && arr[i].geometry.coordinates[0] < closest) {
            closestx = arr[i]
        }
        if (currentDiffy < minDiffy) {
            minDiffy = currentDiffy;
            closesty = arr[i]
        } else if (currentDiffy === minDiffy && arr[i].geometry.coordinates[1] < closest) {
            closesty = arr[i]
        }
    }
    closest.push(closestx)
    closest.push(closesty)
    return closest;
}

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





