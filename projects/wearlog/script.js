var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 150, right: 50, bottom: 150};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    console.group(data);
    var filtered_data = data.filter(function(d) {
        return d.group == "Coats";
    });

    console.log(filtered_data);

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-05-11")])
        .range(margin.left, width-margin.right)

    // var yScale = d3.scalePoint()
    //     .domain(data.map(function(d) { return d.id; }))
    //     .range(margin.top, height-margin.bottom)
    //     .padding(1)

    var xAxis = svg.append("g").attr("class","xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(scaleDate).ticks(20));

    // svg.append("g")
    //     .call(d3.axisLeft(yScale))

    // svg.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d) { return scaleDate(d.date); })
    //     .attr("cy", function(d) { return yScale(d.id); })
    //     .attr("cy", height/2)
    //     .attr("r", 10)
    //     .attr("fill", "black")
    //     .style("opacity", 0.25)
    //     .style("mix-blend-mode", "multiply")
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}