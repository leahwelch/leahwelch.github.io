let tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip")

function showVis(evt) {
  // Declare all variables
  var i, tablinks;

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  evt.currentTarget.className += " active";
}

let prayer_button = d3.select("#prayer_button");
let light_button = d3.select("#light_button");
let listen_button = d3.select("#listen_button");
let eat_button = d3.select("#eat_button");
let serve_button = d3.select("#serve_button");
let story_button = d3.select("#story_button");

const loadFiles = [
  d3.csv("./data/churches.csv", parse)
];

Promise.all(loadFiles).then(function (csv) {

  //filter to include surrounding counties
  let churches = csv[0]

  let rScale = d3.scaleSqrt()
    .domain([d3.min(churches, d => d.prayers), d3.max(churches, d => d.prayers)])
    .range([2, 25]);

  mapboxgl.accessToken = 'pk.eyJ1IjoibHdlbGNoIiwiYSI6ImNtNjZ6MmtraDA1aXoybHB6YXV6bm45dzMifQ.MBGZ3-bqIZtaF5-UbfkkaA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lwelch/cm83atj7d000201so0v3abz0k',
    // projection: 'globe',
    zoom: 3.5, //local map has a higher default zoom
    maxZoom: 18,
    minZoom: 2,
    bearing: 0, //adjust bearing to point north toward top of screen
    center: [-87.0032, 38.9625]
  });

  // map.addControl(new mapboxgl.NavigationControl());
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
            value: rScale(d.prayers)
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
        'circle-radius': ['get', 'value']
      }
    });
  })

  prayer_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.prayers), d3.max(churches, d => d.prayers)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.prayers)
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
    map.getSource("data").setData(geojson)
  });

  light_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.lights), d3.max(churches, d => d.lights)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.lights)
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
    map.getSource("data").setData(geojson)
  });

  listen_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.listen), d3.max(churches, d => d.listen)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.listen)
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
    map.getSource("data").setData(geojson)

  });

  eat_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.eat), d3.max(churches, d => d.eat)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.eat)
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
    map.getSource("data").setData(geojson)

  });

  serve_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.serve), d3.max(churches, d => d.serve)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.serve)
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
    map.getSource("data").setData(geojson)

  });

  story_button.on("click", function () {
    rScale.domain([d3.min(churches, d => d.story), d3.max(churches, d => d.story)])
    geojson = {
      "type": "FeatureCollection",
      "features": churches.map(function (d) {
        return {
          type: "Feature",
          properties: {
            value: rScale(d.story)
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
    map.getSource("data").setData(geojson)

  });

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