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

const supplement_width = 250;
const supplement_height = 120;
const supplement_margin = { top: 10, left: 10, right: 10, bottom: 20 };
const supplement_svg = d3.select("#supplement_chart")
  .append("svg")
  .attr("width", supplement_width)
  .attr("height", supplement_height);

const denseSlider = document.getElementById("dense");
const diverseSlider = document.getElementById("diverse");
const walkableSlider = document.getElementById("walkable");
const drivableSlider = document.getElementById("drivable");

let denseVal = 1;
let diverseVal = 1;
let walkableVal = 1;
let drivableVal = 1;


let colorScale = d3.scaleSequential(d3.interpolateViridis)
// let colorScale = d3.scaleLinear()
//   .range(['white', 'red'])

let rScale = d3.scaleSqrt()
  .domain([1, 5])
  .range([1, 5])

let zoomLevel = map.getZoom();

const scoreScale = d3.scaleLinear()
  .domain([-3, 3])
  .range([1, 10])

function project(d) {
  return map.project(new mapboxgl.LngLat(d[0], d[1]));
}



const promises = [
  d3.csv("./data/indices-vis.csv", parse)
];

Promise.all(promises).then(function (geoData) {
  const xMin = -80.10000;
  const xMax = -79.44796;
  const yMin = 40.38783;
  const yMax = 40.50548;
  // const xMin = -79.98929;
  // const xMax = -79.96796;
  // const yMin = 40.42783;
  // const yMax = 40.44048;

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

  const ramp_svg = d3.select("#ramp")
    .attr("width", 250)
    .attr("height", 30);

  const scaleWidth = 250;
  const scaleHeight = 10;

  const scale = ramp_svg.select("#scale")
    .attr("transform", "translate(0,0)");

  scale.select("#scaleRect")
    .attr("width", scaleWidth)
    .attr("height", scaleHeight);

  var barColor = d3.scaleSequential(d3.interpolateViridis)
    .domain([0,10]);

  var stops = d3.range(0, 1.25, 0.25);
  ramp_svg.select("#colorGradient").selectAll("stop")
    .data(stops).enter()
    .append("stop")
    .attr("offset", function (d) {
      return d * 100 + "%";
    })
    .attr("stop-color", function (d) {
      return barColor(d * 10);
    });

  ramp_svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("class", "ramp_label")
    .text("Lower Scoring")

    ramp_svg.append("text")
    .attr("x", 187)
    .attr("y", 25)
    .attr("class", "ramp_label")
    .text("Higher Scoring")

  updateFilters();

  let dots = svg
    .selectAll("circle") //revisit this, don't need to select all every time
    .data(filtered)
    .enter()
    .append("circle")
    .attr("fill", function (d) {
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
  map.on('zoom', function () {
    zoomLevel = map.getZoom();
    updateZoom(zoomLevel)
  })
  render();

  const xScale = d3.scaleLinear()
    .domain([scoreMin, scoreMax])
    // .range([supplement_margin.left, supplement_width - supplement_margin.right])
    .range([0,250])

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

  denseSlider.oninput = function () {
    updateFilters()
  }

  diverseSlider.oninput = function () {
    updateFilters()
  }

  walkableSlider.oninput = function () {
    updateFilters()
  }

  drivableSlider.oninput = function () {
    updateFilters()
  }

  function updateFilters() {

    console.log(denseSlider.value, denseVal)
    denseVal = denseSlider.value / 10;
    diverseVal = diverseSlider.value / 10;
    walkableVal = walkableSlider.value / 10;
    drivableVal = drivableSlider.value / 10;

    filtered.forEach(function (d) {
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
      .attr("fill", function (d) {

        return colorScale(d.score);

      })

  }

  function updateZoom(zoomLevel) {
    console.log(zoomLevel)
    svg.selectAll("circle").transition().attr("r", () => {
      if (zoomLevel > 13) {
        return 3;
      } else {
        return 2;
      }
    })
  }



  // var dense_xAxis = supplement_svg.append("g")
  //   .attr("class", "xaxis")
  //   .attr("transform", `translate(0, ${supplement_height - supplement_margin.bottom})`)
  //   .call(d3.axisBottom().scale(xScale));

  d3.select("#dense_info").on("click", function () {
    d3.select("#supplement").style("display", "block")
    d3.select("#supplement_header").html("Accessibility by cycling")
    d3.select("#supplement_text").html("Locations with higher scores have shorter travel times by bike to a variety of destinations, especially school, parks, and grocery stores.")

    const dense_histogram = d3.histogram()
      .value(function (d) { return d.dense })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(100))

    dense_bins = dense_histogram(filtered);

    const dense_yScale = d3.scaleLinear()
      .domain([0, d3.max(dense_bins, function (d) { return d.length; })])
      .range([supplement_height - supplement_margin.bottom, supplement_margin.top])

    let bars = supplement_svg.selectAll("rect").data(dense_bins)

    let enter = bars.enter()
      .append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("width", (supplement_width - supplement_margin.left - supplement_margin.right) / dense_bins.length - 1)
      .attr("y", dense_yScale(0))
    // .attr("height", dense_yScale(0))
    bars.merge(enter)
      .transition()
      .duration(500)
      .attr("y", d => dense_yScale(d.length))
      .attr("height", d => dense_yScale(0) - dense_yScale(d.length))

    bars.exit()
      .transition()
      .duration(500)
      .remove()
  })

  d3.select("#diverse_info").on("click", function () {
    d3.select("#supplement").style("display", "block")
    d3.select("#supplement_header").html("Diversity of people and buildings")
    d3.select("#supplement_text").html("Locations with higher scores have a greater number of different land uses in the immediate vicinity, a higher proportion of Black residents in the immediate vicinity, lower lot sizes, and are located further from undesirable land uses (such as coal mines and poultry farms).")

    const diverse_histogram = d3.histogram()
      .value(function (d) { return d.diverse })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(100))

    diverse_bins = diverse_histogram(filtered);

    const diverse_yScale = d3.scaleLinear()
      .domain([0, d3.max(diverse_bins, function (d) { return d.length; })])
      .range([supplement_height - supplement_margin.bottom, supplement_margin.top])

    let bars = supplement_svg.selectAll("rect").data(diverse_bins)

    let enter = bars.enter()
      .append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("width", (supplement_width - supplement_margin.left - supplement_margin.right) / diverse_bins.length - 1)
    bars.merge(enter)
      .transition()
      .duration(500)
      .attr("y", d => diverse_yScale(d.length))
      .attr("height", d => diverse_yScale(0) - diverse_yScale(d.length))

    bars.exit()
      .transition()
      .duration(500)
      .remove();
  })

  d3.select("#walkable_info").on("click", function () {
    d3.select("#supplement").style("display", "block")
    d3.select("#supplement_header").html("Accessibility by walking")
    d3.select("#supplement_text").html("Locations with higher scores have shorter travel times by walking and transit to a variety of destinations, especially commercial locations and employment centers.")

    const walkable_histogram = d3.histogram()
      .value(function (d) { return d.walkable })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(100))

    walkable_bins = walkable_histogram(filtered);

    const walkable_yScale = d3.scaleLinear()
      .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
      .range([supplement_height - supplement_margin.bottom, supplement_margin.top])

    let bars = supplement_svg.selectAll("rect").data(walkable_bins)

    let enter = bars.enter()
      .append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("width", (supplement_width - supplement_margin.left - supplement_margin.right) / walkable_bins.length - 1)
    bars.merge(enter)
      .transition()
      .duration(500)
      .attr("y", d => walkable_yScale(d.length))
      .attr("height", d => walkable_yScale(0) - walkable_yScale(d.length))

    bars.exit()
      .transition()
      .duration(500)
      .remove();
  })

  d3.select("#drivable_info").on("click", function () {
    d3.select("#supplement").style("display", "block")
    d3.select("#supplement_header").html("Accessibility by driving")
    d3.select("#supplement_text").html("Locations with higher scores have shorter travel times by car to a variety of destinations, especially commercial locations and employment centers.")

    const drivable_histogram = d3.histogram()
      .value(function (d) { return d.drivable })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(100))

    drivable_bins = drivable_histogram(filtered);

    const drivable_yScale = d3.scaleLinear()
      .domain([0, d3.max(drivable_bins, function (d) { return d.length; })])
      .range([supplement_height - supplement_margin.bottom, supplement_margin.top])

    let bars = supplement_svg.selectAll("rect").data(drivable_bins)

    let enter = bars.enter()
      .append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("width", (supplement_width - supplement_margin.left - supplement_margin.right) / drivable_bins.length - 1)
    bars.merge(enter)
      .transition()
      .duration(500)
      .attr("y", d => drivable_yScale(d.length))
      .attr("height", d => drivable_yScale(0) - drivable_yScale(d.length))

    bars.exit()
      .transition()
      .duration(500)
      .remove();
  })




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
