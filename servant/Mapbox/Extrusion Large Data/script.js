const loadFiles = [
  d3.csv("./surfers.csv")
];
let hoveredTowerId;

Promise.all(loadFiles).then(function (csv) {

  //extract categories for color-coding the towers
  let byCategory = d3.groups(csv[0], d => d.continent)
  let categories = byCategory.map(d => d[0])

  let colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(["#f6c414", "#00A469", "#1492fc", "#9b2eef", "#90640a", "#25e297", "#53cbff", "#5d198a"])

  //scales for dynamically adjusting tower radius and height
  const heightScale = d3.scaleLinear()
    .domain([0, 22])
    .range([1, 5])

  let radiusScale = d3.scaleLinear()
    .domain([0, 20000000])
    .range([1000, 10000])

  //map
  const position = d3.select("#position");
  map.on('load', function () {

    map.addLayer({
      'id': 'sky',
      'type': 'sky',
      'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
      }
    });

    //dynamic 3d building extrusions
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;
    map.addLayer(
      {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',

          // Use an 'interpolate' expression to
          // add a smooth transition effect to
          // the buildings as the user zooms in.
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
    );

    //create a geojson dataset to draw the towers
    let geojson = {
      "type": "FeatureCollection",
      "features": csv[0].map(function (d) {
        return {
          type: "Feature",
          properties: {
            name: d.continent,
            full_value: parseFloat(d.n)
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

    map.addSource("data", {
      id: "geojson",
      type: "geojson",
      data: geojson,
    });


    map.addLayer({
      'id': "tower_points",
      'type': 'circle',
      'source': "data",
      'paint': {
        'circle-opacity': 0
      }
    });

    map.addSource("extrusion_source", {
      "type": "geojson",
      "data": {
        type: 'FeatureCollection',
        features: []
      }
    });

    //draw the towers
    map.addLayer({
      'id': "extrusion",
      'type': 'fill-extrusion',
      'source': "extrusion_source",
      'paint': {
        'fill-extrusion-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'red',
          ['get', 'fill']
        ],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base'],
        'fill-extrusion-opacity': 1.0
      }
    });

    //function for creating the data that populates the extrusions
    function update() {
      let qfs = map.queryRenderedFeatures({
        layers: [`tower_points`]
      });
      let data = {
        "type": "FeatureCollection",
        "features": []
      };

      let zoom_level = map.getZoom();

      //tower height reduces when users zoom in
      let height_multiplier = 400 / heightScale(zoom_level);
      const radiusPX = 2 

      qfs.forEach(function (object, i) {
        const center = object.geometry.coordinates

        let xy = map.project(center);
        xy.x += radiusPX;

        let LL = map.unproject(xy);
        LL = turf.point([LL.lng, LL.lat]);

        //radius rescales on zoom and also in relation to the center of the globe
        let radius = radiusScale(turf.distance(center, LL, {
          units: 'meters'
        })) + 0.00000001;

        //setting the properties for the extrusions
        object.properties.height = object.properties.full_value * height_multiplier;
        object.properties.base = 0;
        object.properties.index = i;
        object.properties.fill = colorScale(object.properties.name)

        let options = {
          steps: 16,
          units: 'meters',
          properties: object.properties
        };

        const feature = turf.circle(center, radius, options);
        feature.id = i;

        data.features.push(feature);
      })

      map.getSource(`extrusion_source`).setData(data);
    }

    map.on(`data`, function (e) {
      if (e.sourceId !== `data`) return
      update()
    })
  })

  map.on('mousemove', 'extrusion', function (e) {
    map.getCanvasContainer().style.cursor = 'pointer';

    if (hoveredTowerId) {
      map.setFeatureState(
        { source: 'extrusion_source', id: hoveredTowerId },
        { hover: false }
      );
    }
    hoveredTowerId = e.features[0].id;
    map.setFeatureState(
      { source: 'extrusion_source', id: hoveredTowerId },
      { hover: true }
    );
    updatePosition(e.features[0].properties)
  });

  map.on('mouseleave', 'extrusion', function () {
    map.getCanvasContainer().style.cursor = 'default';

    map.setFeatureState(
      { source: 'extrusion_source', id: hoveredTowerId },
      { hover: false }
    );
    hoveredTowerId = null;
  });

  const updatePosition = function (props) {
    const info =
      '<p>Name: ' + props.name + '</p>' +
      '<p>Height of tower: ' + props.full_value + 'm</p>' +
      '<p>Height of observatory: ' + props.observatory_value + 'm</p>';

    position.html(info);
  };
})