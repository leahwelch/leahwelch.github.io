

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 250, left: 550, right: 550, bottom: 350};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    var nested = d3.nest()
        .key(function(d) { return d.id; })
        .rollup(function(v) { return v.length;})
        // .rollup()
        .entries(data);

    console.log(nested)

    let yScale = d3.scaleLinear()
        .domain(d3.extent(nested.map((d)=>d["value"])))
        .range([height-margin.bottom, margin.top])

    svg.selectAll(".circ")
        .data(nested)
        .enter()
        .append("circle")
        .attr("class", ".circ")
        // .attr("fill", (d)=>d.hex1)
        .attr("r", 10)
        .attr("cx", 500)
        .attr("cy", (d)=>yScale(d.value))

    let simulation = d3.forceSimulation(nested)
        .force("x", d3.forceX((d) => {
            return 500;
            }).strength(0.2))
        .force("y", d3.forceY((d) => {
            return yScale(d.value);
            }).strength(1))
        .force("collide", d3.forceCollide((d) => {
            return 10;
           }))
        .alphaDecay(0)
        .alpha(0.3)
        .on("tick", tick);

    function tick() {
        d3.selectAll(".circ")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
    }

    let init_decay = setTimeout(function () {
        console.log("sim")
        simulation.alphaDecay(0.1);
    }, 3000);

    init_decay;



    
        

   
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group,
        hex1: d.hex1
    }
    
}