var width = document.querySelector("#map").clientWidth;
var height = document.querySelector("#map").clientHeight;

//MAP & PARCELS

const container = map.getCanvasContainer();
const svg = d3.select(container)
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("position", "absolute")
  .style("z-index", 2)

const denseSlider = document.getElementById("dense");
const diverseSlider = document.getElementById("diverse");
const walkableSlider = document.getElementById("walkable");
const drivableSlider = document.getElementById("drivable");

let denseVal = 1;
let diverseVal = 1;
let walkableVal = 1;
let drivableVal = 1;


let colorScale = d3.scaleSequential(d3.interpolateRdYlBu)

let rScale = d3.scaleSqrt()
  .domain([1,5])
  .range([1,5])

let zoomLevel = map.getZoom();

const scoreScale = d3.scaleLinear()
  .domain([-3, 3])
  .range([1,10])

function project(d) {
  return map.project(new mapboxgl.LngLat(d[0], d[1]));
}



const promises = [
  d3.csv("./data/indices-vis.csv", parse)
];

Promise.all(promises).then(function (geoData) {
  // const xMin = -80.10000;
  // const xMax = -79.94796;
  // const yMin = 40.38783;
  // const yMax = 40.50548;
  const xMin = -79.98929;
  const xMax = -79.96796;
  const yMin = 40.42783;
  const yMax = 40.44048;

  let filtered = geoData[0].filter(function (d) {
    return d.geometry[0] > xMin && d.geometry[0] < xMax && d.geometry[1] > yMin && d.geometry[1] < yMax;
  })
  
  filtered.forEach(function (d) {
    d.dense = d.dense * denseVal;
    d.diverse = d.diverse * diverseVal;
    d.drivable = d.drivable * drivableVal;
    d.walkable = d.walkable * walkableVal;
    d.score = (d.walkable + d.drivable + d.dense + d.diverse) / 4;
  })
  
  let scoreMin = d3.min(filtered, d => d.score)
  let scoreMax = d3.max(filtered, d => d.score)
  // console.log(scoreMin, scoreMax)

  colorScale.domain([scoreMin, scoreMax])
  rScale.domain([scoreMin, scoreMax])

  updateFilters();

  let dots = svg
    .selectAll("circle") //revisit this, don't need to select all every time
    .data(filtered)
    .enter()
    .append("circle")
    .attr("fill", function(d) {
      return colorScale(d.score);
    })
    .attr("r", 3)

  function render() {

    dots
      .attr("cx", function (d) {
        return project(d.geometry).x;
      })
      .attr("cy", function (d) {
        return project(d.geometry).y;
      });
  }
  map.on("viewreset", render);
  map.on("move", render);
  map.on("moveend", render);
  map.on('zoom', function() {
    zoomLevel = map.getZoom();
    updateZoom(zoomLevel)
  })
  render();


// DRAGGABLE CONTROL PANEL
dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

denseSlider.oninput = function() {
  updateFilters()
}

diverseSlider.oninput = function() {
  updateFilters()
}

walkableSlider.oninput = function() {
  updateFilters()
}

drivableSlider.oninput = function() {
  updateFilters()
}

function updateFilters() {

  console.log(denseSlider.value, denseVal)
  denseVal = denseSlider.value / 10;
  diverseVal = diverseSlider.value / 10;
  walkableVal = walkableSlider.value / 10;
  drivableVal = drivableSlider.value / 10;

  filtered.forEach(function(d){
    // d.dense = d.dense * denseVal;
    d.updatedDense = d.dense * denseVal;
    // d.diverse = d.diverse * diverseVal;
    d.updatedDiverse = d.diverse * diverseVal;
    // d.drivable = d.drivable * drivableVal;
    d.updatedDrivable = d.drivable * drivableVal;
    // d.walkable = d.walkable * walkableVal;
    d.updatedWalkable = d.walkable * walkableVal;
    d.score = (d.updatedWalkable + d.updatedDrivable + d.updatedDense + d.updatedDiverse) / 4;
  })

  denseMin = d3.min(filtered, d => d.dense)
  denseMax = d3.max(filtered, d => d.dense)
  
  scoreMin = d3.min(filtered, d => d.score)
  scoreMax = d3.max(filtered, d => d.score)
  console.log(denseMin, denseMax)
  svg.selectAll("circle")
    .transition()
    .attr("fill", function(d) {

      return colorScale(d.score);

    })

}

function updateZoom(zoomLevel) {
    console.log(zoomLevel)
    svg.selectAll("circle").transition().attr("r", () => {
      if(zoomLevel > 13) {
        return 3;
      } else {
        return 2;
      }
    })
}


});

function parse(d) {
  return {
    affordable: +d.f_affordable,
    dense: +d.f_dense,
    diverse: +d.f_diverse,
    drivable: +d.f_drivable,
    walkable: +d.f_walkable,
    geometry: [
      +d.geometry.split(",")[0].slice(2),
      +d.geometry.split(",")[1].slice(1, -1)
    ]
    
  }
}
