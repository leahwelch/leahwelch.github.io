const updateBtn = d3.select("#update");

let tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip")

const loadFiles = [
  d3.csv("./data/partners_county_level.csv", parse_partners)
];
let hoveredTowerId;

Promise.all(loadFiles).then(function (csv) {

  //filter to include surrounding counties
  let partners = csv[0]
    .filter(d => d.state === "TX")

  let city = csv[0]
  .filter(d => d.city === "Houston")

  console.log(partners)

  let by_category = d3.groups(partners, d => d.category)
  console.log(by_category)

  //center the map based on the filtered dataset
  let centerLat = d3.median(city, d => d.lat)
  let centerLon = d3.median(city, d => d.lon)

  mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lwelch/cm670i0eb00bd01st4aje8uec',
    // projection: 'globe',
    zoom: 9, //local map has a higher default zoom
    maxZoom: 18,
    minZoom: 7,
    // pitch: 75.00, //flatten pitch for better city view
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

  // //extract categories for color-coding the towers
  // let categories = by_category.map(d => d[0])

  // let colorScale = d3.scaleOrdinal()
  //   .domain(categories)
  //   .range(["#F6C414",
  //     "#90640A",
  //     "#00A469",
  //     "#1492FC",
  //     "#C581FF",
  //     "#5D198A"])

  //map
  const position = d3.select("#position");
  map.on('load', function () {
    const layers = map.getStyle().layers;

    // //create a geojson dataset to draw the towers
    let geojson = {
      "type": "FeatureCollection",
      "features": partners.map(function (d) {
        return {
          type: "Feature",
          properties: {
            name: d.name,
            full_value: 1,
            category: d.category
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
        'circle-opacity': 1,
        'circle-color': [
          'match',
          ['get', 'category'],
          'Faith-Based Initiatives',
          '#F6C414',
          'Health and Counseling Services',
          '#90640A',
          'Educational and Leadership Development',
          '#00A469',
          'Community Support and Advocacy',
          '#1492FC',
          'Arts, Culture, and Media',
          '#C581FF',
          'International Outreach and Development',
          '#5D198A',
                        /* other */ '#ccc'
        ],
        // 'circle-color': 'white',
        'circle-radius': 2
      }
    });

    // map.addSource("extrusion_source", {
    //   "type": "geojson",
    //   "data": {
    //     type: 'FeatureCollection',
    //     features: []
    //   }
    // });


    //draw the towers
    // map.addLayer({
    //   'id': "extrusion",
    //   'type': 'fill-extrusion',
    //   'source': "extrusion_source",
    //   'paint': {
    //     'fill-extrusion-color': [
    //       'case',
    //       ['boolean', ['feature-state', 'hover'], false],
    //       'white',
    //       ['get', 'fill']
    //     ],
    //     'fill-extrusion-height': ['get', 'height'],
    //     'fill-extrusion-base': ['get', 'base'],
    //     'fill-extrusion-opacity': 1.0
    //   }
    // });

    //function for creating the data that populates the extrusions
    // function update() {
    //   let qfs = map.queryRenderedFeatures({
    //     layers: [`tower_points`]
    //   });
    //   // console.log(qfs)
    //   let data = {
    //     "type": "FeatureCollection",
    //     "features": []
    //   };

    //   let height_multiplier = 300;
    //   const radiusPX = 1.5

    //   qfs.forEach(function (object, i) {
    //     const center = object.geometry.coordinates

    //     let xy = map.project(center);
    //     xy.x += radiusPX;

    //     let LL = map.unproject(xy);
    //     LL = turf.point([LL.lng, LL.lat]);

    //     //radius rescales on zoom and also in relation to the center of the globe
    //     let radius = turf.distance(center, LL, {
    //       units: 'meters'
    //     }) + 0.00000001;


    //     //setting the properties for the extrusions
    //     object.properties.height = height_multiplier; //on local view we're not scaling the extrusions by height
    //     object.properties.base = 0;
    //     object.properties.index = i;
    //     object.properties.fill = colorScale(object.properties.name)

    //     let options = {
    //       steps: 16,
    //       units: 'meters',
    //       properties: object.properties
    //     };

    //     const feature = turf.circle(center, radius, options);
    //     feature.id = i;

    //     data.features.push(feature);
    //   })
    //   map.getSource(`extrusion_source`).setData(data);
    // }

    // update();

    // map.on(`data`, function (e) {
    //   if (e.sourceId !== `data`) return
    //   update()
    // })
  })

  // map.on('mousemove', 'extrusion', function (e) {
  //   console.log(e.features[0].properties.name)
  //   map.getCanvasContainer().style.cursor = 'pointer';

  //   if (hoveredTowerId) {
  //     map.setFeatureState(
  //       { source: 'extrusion_source', id: hoveredTowerId },
  //       { hover: false }
  //     );
  //   }
  //   hoveredTowerId = e.features[0].id;
  //   map.setFeatureState(
  //     { source: 'extrusion_source', id: hoveredTowerId },
  //     { hover: true }
  //   );

  //   let cx = e.originalEvent.clientX + 10;
  //   let cy = e.originalEvent.clientY - 10;

  //   tooltip.style("visibility", "visible")
  //     .style("left", cx + "px")
  //     .style("top", cy + "px")
  //     .text(e.features[0].properties.name)
  // });

  // map.on('mouseleave', 'extrusion', function () {
  //   tooltip.style("visibility", "hidden")
  //   map.getCanvasContainer().style.cursor = 'default';

  //   map.setFeatureState(
  //     { source: 'extrusion_source', id: hoveredTowerId },
  //     { hover: false }
  //   );
  //   hoveredTowerId = null;
  // });

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
    county: d.COUNTY
  }
}