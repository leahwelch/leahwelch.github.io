// colors
const countiesBorderColor = '#ff0000';
const countiesFillColor = '#ff0000';

// window constants
const width = window.innerWidth;
const height = window.innerHeight;
const mapSize = [width, height];

const promises = [
    d3.json("https://d3js.org/us-10m.v1.json"),
    d3.json('./data/tribal-geojson.json'), // tribal lands geojson
];

Promise.all(promises).then((data) => {

    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

    const us = data[0];

    var path = d3.geoPath();

    svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .attr("stroke", "white");

  svg.append("path")
      .attr("class", "county-borders")
      .attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })))
      .attr("stroke", "white");

});
