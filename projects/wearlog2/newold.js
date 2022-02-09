var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 50, right: 50, bottom: 50};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    const newItems = data.filter(d => d.new === "Y")
    const soldItems = data.filter(d => d.sold === "Y")

    const weeklyNew = d3.nest()
        .key(d=>d.week)
        .rollup()
        .entries(newItems)

    const weeklySold = d3.nest()
        .key(d=>d.week)
        .rollup()
        .entries(soldItems)

    weeklyNew.forEach(d=>d.key = +d.key)
    weeklySold.forEach(d=>d.key = +d.key)
    
    const xScale = d3.scaleLinear()
        .domain([1,70])
        .range([margin.left, width-margin.right])

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(weeklyNew, d => d.values.length)])
        .range([margin.left, width-margin.right])

    const line = d3.line()
        .x(function(d) { return xScale(d.week); })
        .y(function(d){ return yScale(d.values.length); })
        // .curve(d3.curveStep)

    var path = svg.selectAll(".path").data([cumData])

    path.enter().append("path")
        .attr("class", "path")
        .attr("d", line)
        .attr("stroke", "#cccccc")
        .attr("fill", "none")
        .attr("stroke-width", 1)
});

function parse(d) {

    return {
        date: new Date(d.date),
        week: +d.week,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold
    }
    
}