

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 250, left: 250, right: 250, bottom: 350};

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

    nested.forEach(function(d) {
        data.forEach(function(g) {
            if(g.id == d.key) {
                d.hex1 = g.hex1;
            }
        })
    })

    console.log(nested)

    var xScale = d3.scaleLinear()
        .range([margin.left, width-margin.right])
        .domain(d3.extent(nested, function(d) {
            return +d["value"];
        }))

    let simulation = d3.forceSimulation(nested)
        .force("x", d3.forceX(function(d) {
            return xScale(+d["value"]);
        }).strength(0.1))
        .force("y", d3.forceY((height/2) - margin.bottom/2).strength(0.1))
        .force("collide", d3.forceCollide(9))

    for(let i = 0; i < nested.length; i++) {
        simulation.tick(10);
    }

    let nodes = svg.selectAll(".nodes")
        .data(nested, function(d) { return d.key });

    nodes.exit()
        .transition()
        .duration(1000)
        .attr("cx", 0)
        .attr("cy", (height/2) - margin.bottom/2)
        .remove();

    nodes.enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("cx", 0)
        .attr("cy", (height/2) - margin.bottom/2)
        .attr("r", 8)
        .attr("fill", function(d) { return d.hex1; })
        .merge(nodes)
        .transition()
        .duration(2000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    var xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    
        

   
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