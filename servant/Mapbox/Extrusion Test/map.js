(function () {
    "use strict";
  
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGlyb3NhamkiLCJhIjoiY2szOWlqZWNzMDJueTNjcWhyNjhqdXBnOSJ9._6mJT202QqpnMuK-jvMr3g';
  
    const mapObj = new mapboxgl.Map({
      container: 'mapID',
      style: 'mapbox://styles/hirosaji/cklfggkyj4ytl17qhtxrp2qco',
      center: [135.68380, 36.85676],
      zoom: 5.2,
      pitch: 60.00,
      bearing: -17.60,
      interactive: true
    });
  
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
  
      mapObj.on('load', function() {
  
        mapObj.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
  
        mapObj.addSource("data", {
          type: "geojson",
          data: geojson,
        });
  
        mapObj.addLayer({
          'id': 'tower_points',
          'type': 'circle',
          'source': 'data',
          'paint': {
            'circle-opacity': 0
          }
        });
  
        mapObj.addSource('extrusion_source', {
          "type": "geojson",
          "data": {
            type: 'FeatureCollection',
            features: []
          }
        });
  
        mapObj.addLayer({
          'id': 'extrusion',
          'type': 'fill-extrusion',
          'source': 'extrusion_source',
          'paint': {
            'fill-extrusion-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              'red',
              '#808080'
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base'],
            'fill-extrusion-opacity': 1.0
          }
        });
  
        function update() {
  
          const qfs = mapObj.queryRenderedFeatures({
            layers: ['tower_points']
          });
          const data = {
            "type": "FeatureCollection",
            "features": []
          };
          const radiusPX = 1;
  
          qfs.forEach(function (object, i) {
  
            const center = object.geometry.coordinates
  
            let xy = mapObj.project(center);
            xy.x += radiusPX;
  
            let LL = mapObj.unproject(xy);
            LL = turf.point([LL.lng, LL.lat]);
  
            const radius = turf.distance(center, LL, {
              units: 'meters'
            }) + 0.00000001;
  
            object.properties.height = object.properties.full_value * 500;
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
  
          mapObj.getSource('extrusion_source').setData(data);
        }
  
        mapObj.on('data', function(e) {
          if (e.sourceId !== 'data') return
          update()
        })
      })
  
      mapObj.on('mousemove', 'extrusion', function(e) {
        mapObj.getCanvasContainer().style.cursor = 'pointer';
  
        if (hoveredTowerId) {
          mapObj.setFeatureState(
            { source: 'extrusion_source', id: hoveredTowerId },
            { hover: false }
          );
        }
        hoveredTowerId = e.features[0].id;
        mapObj.setFeatureState(
          { source: 'extrusion_source', id: hoveredTowerId },
          { hover: true }
        );
        updatePosition(e.features[0].properties)
      });
  
      mapObj.on('mouseleave', 'extrusion', function() {
        mapObj.getCanvasContainer().style.cursor = 'default';
  
        mapObj.setFeatureState(
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
  
  })();