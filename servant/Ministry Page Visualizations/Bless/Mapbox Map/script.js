let tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip")

const loadFiles = [
  d3.csv("./data/churches.csv", parse)
];

Promise.all(loadFiles).then(function (csv) {

  //filter to include surrounding counties
  let churches = csv[0]

  let rScale = d3.scaleSqrt()
        .domain([d3.min(churches, d => d.prayers), d3.max(churches, d => d.prayers)])
        .range([1, 25]);

  //center the map based on the filtered dataset
  // let centerLat = d3.median(city, d => d.lat)
  // let centerLon = d3.median(city, d => d.lon)

  mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lwelch/cm83atj7d000201so0v3abz0k',
    // projection: 'globe',
    zoom: 3, //local map has a higher default zoom
    maxZoom: 18,
    minZoom: 2,
    // pitch: 75.00, //flatten pitch for better city view
    bearing: 0, //adjust bearing to point north toward top of screen
    center: [-83.0032, 39.9625]
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


  //map

  map.on('load', function () {
    const layers = map.getStyle().layers;

    // //create a geojson dataset to draw the towers
    let geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            prayers: rScale(d.prayers),
            lights: d.lights,
            listens: d.listen,
            eat: d.eat,
            serve: d.serve,
            story: d.story
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
        'circle-opacity': 0.4,
        'circle-color': '#00a469',
        'circle-radius': ['get', 'prayers']
      }
    });
  })

})

function parse(d) {
  return {
    id: d.ID,
    org: d.ORGANIZATION_NAME,
    type: d.ORGANIZATION_TYPE,
    address: d.STREET_ADDRESS,
    city: d.CITY,
    state: d.STATE,
    zip: d.ZIP,
    lat: +d.LATITUDE,
    lon: +d.LONGITUDE,
    lights: +d.NUMBER_OF_LIGHTS,
    prayers: +d.PRAYERS,
    listen: +d.LISTEN_EVENTS,
    eat: +d.EAT_EVENTS,
    serve: +d.SERVE_EVENTS,
    story: +d.SHARE_YOUR_STORY_EVENTS,
    account_type: d.ACCOUNT_TYPE
  }
}