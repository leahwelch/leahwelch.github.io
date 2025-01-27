const loadFiles = [
    d3.csv("./tower_height.csv")
  ];
  let hoveredTowerId;

  Promise.all(loadFiles).then(function (csv) {

    const geojson = {
      "type": "FeatureCollection",
      "features": csv[0].map(function(d) {
        return {
          type: "Feature",
          properties: {
            name: d.name,
            full_value: parseFloat(d.full_height),
            observatory_value: parseFloat(d.observatory_height)
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(d.lng),
              parseFloat(d.lat)
            ]
          }
        }
      })
    }

    const position = d3.select("#position");

    map.on('load', function() {

      map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });

      map.addSource("data", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        'id': 'tower_points',
        'type': 'circle',
        'source': 'data',
        'paint': {
          'circle-opacity': 0
        }
      });

      map.addSource('extrusion_source', {
        "type": "geojson",
        "data": {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        'id': 'extrusion',
        'type': 'fill-extrusion',
        'source': 'extrusion_source',
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'red',
            '#f6c414'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'base'],
          'fill-extrusion-opacity': 1.0
        }
      });

      function update() {

        const qfs = map.queryRenderedFeatures({
          layers: ['tower_points']
        });
        const data = {
          "type": "FeatureCollection",
          "features": []
        };
        const radiusPX = 1;

        qfs.forEach(function (object, i) {

          const center = object.geometry.coordinates

          let xy = map.project(center);
          xy.x += radiusPX;

          let LL = map.unproject(xy);
          LL = turf.point([LL.lng, LL.lat]);

          const radius = turf.distance(center, LL, {
            units: 'meters'
          }) + 0.00000001;

          object.properties.height = object.properties.full_value * 200;
          object.properties.base = 0;
          object.properties.index = i;

          const options = {
            steps: 16,
            units: 'meters',
            properties: object.properties
          };

          const feature = turf.circle(center, radius, options);
          feature.id = i;

          data.features.push(feature);
        })

        map.getSource('extrusion_source').setData(data);
      }

      map.on('data', function(e) {
        if (e.sourceId !== 'data') return
        update()
      })
    })

    map.on('mousemove', 'extrusion', function(e) {
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

    map.on('mouseleave', 'extrusion', function() {
      map.getCanvasContainer().style.cursor = 'default';

      map.setFeatureState(
        { source: 'extrusion_source', id: hoveredTowerId },
        { hover: false }
      );
      hoveredTowerId = null;
    });

    const updatePosition = function(props) {
      const info = 
        '<p>Name: ' + props.name + '</p>' +
        '<p>Height of tower: ' + props.full_value + 'm</p>' +
        '<p>Height of observatory: ' + props.observatory_value + 'm</p>';

      position.html(info);
    };
  })