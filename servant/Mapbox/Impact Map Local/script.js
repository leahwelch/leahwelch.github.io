const updateBtn = d3.select("#update");
let tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip")

const loadFiles = [
  d3.csv("./data/prayer_walks.csv", parse_walks),
  d3.csv("./data/partner_data.csv", parse_partners)
];
let hoveredTowerId;

Promise.all(loadFiles).then(function (csv) {
  //if user input = Chicago
  let walks = csv[0].filter(d => d.city === "Chicago")
  let partners = csv[1].filter(d => d.city === "Chicago")

  //ideally the data would already come to us combined
  let combined = []
  for (let i = 0; i < walks.length; i++) {
    combined.push(walks[i])
  }
  for (let i = 0; i < partners.length; i++) {
    combined.push(partners[i])
  }

  //center the map based on the filtered dataset
  let centerLat = d3.median(combined, d => d.lat)
  let centerLon = d3.median(combined, d => d.lon)

  mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lwelch/cm68fnw0m009z01st0cbyatoo',
    projection: 'globe',
    zoom: 13, //local map has a higher default zoom
    maxZoom: 18,
    minZoom: 10,
    pitch: 75.00, //flatten pitch for better city view
    bearing: 0, //adjust bearing to point north toward top of screen
    center: [centerLon, centerLat]
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();
  let userInteracting = false;

  // Pause spinning on interaction
  map.on('mousedown', () => {
    userInteracting = true;
  });
  map.on('dragstart', () => {
    userInteracting = true;
  });

  //extract categories for color-coding the towers
  let categories = ["prayer_walk", "partner"]

  let colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(["#f6c414", "#00A469"])

  //map
  const position = d3.select("#position");
  map.on('load', function () {

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
      "features": combined.map(function (d) {
        return {
          type: "Feature",
          properties: {
            name: d.name,
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
          'white',
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
      // console.log(qfs)
      let data = {
        "type": "FeatureCollection",
        "features": []
      };

      let height_multiplier = 300;
      const radiusPX = 1.5

      qfs.forEach(function (object, i) {
        const center = object.geometry.coordinates

        let xy = map.project(center);
        xy.x += radiusPX;

        let LL = map.unproject(xy);
        LL = turf.point([LL.lng, LL.lat]);

        //radius rescales on zoom and also in relation to the center of the globe
        let radius = turf.distance(center, LL, {
          units: 'meters'
        }) + 0.00000001;


        //setting the properties for the extrusions
        object.properties.height = height_multiplier; //on local view we're not scaling the extrusions by height
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

    update();

    map.on(`data`, function (e) {
      if (e.sourceId !== `data`) return
      update()
    })
  })

  map.on('mousemove', 'extrusion', function (e) {
    console.log(e.features[0].properties.name)
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

    let cx = e.originalEvent.clientX + 10;
    let cy = e.originalEvent.clientY - 10;

    tooltip.style("visibility", "visible")
      .style("left", cx + "px")
      .style("top", cy + "px")
      .text(e.features[0].properties.name)
  });

  map.on('mouseleave', 'extrusion', function () {
    tooltip.style("visibility", "hidden")
    map.getCanvasContainer().style.cursor = 'default';

    map.setFeatureState(
      { source: 'extrusion_source', id: hoveredTowerId },
      { hover: false }
    );
    hoveredTowerId = null;
  });

  //proxy for dropdown selection to filter data
  updateBtn.on("click", function () {
    let filtered = combined.filter(d => d.category === "prayer_walk")

    //re-center map onto filtered dataset
    let newLat = d3.median(filtered, d => d.lat)
    let newLon = d3.median(filtered, d => d.lon)
    map.flyTo({
      center: [newLon, newLat]
    });

    //override geojson to only include filtered values
    geojson = {
      "type": "FeatureCollection",
      "features": filtered.map(function (d) {
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
    //update the data source on the map to only show filtered towers
    map.getSource("data").setData(geojson)

  })
})

function parse_walks(d) {
  return {
    name: d.CAMPUS_NAME,
    n: +d.WALK_COUNT,
    city: d.CITY,
    state: d.STATE,
    zip: +d.ZIPCODE,
    lat: +d.LATITUDE,
    lon: +d.LONGITUDE,
    category: "prayer_walk"
  }
}

function parse_partners(d) {
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
    category: "partner"
  }
}