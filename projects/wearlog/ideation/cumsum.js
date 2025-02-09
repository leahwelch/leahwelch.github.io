var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 150, left: 150, right: 150, bottom: 150};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    // console.group(data);
    var filtered_data = data.filter(function(d) {
        return d.id == "327";
    });

    console.log(filtered_data);

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-10-04")])
        .range([margin.left, width-margin.right])

    var cumData = [];
    for(var i = 0; i < filtered_data.length; i++) {
        cumData.push({date: filtered_data[i].date, quantity: i+1})
    }
    console.log(cumData)

    

    var yScale = d3.scaleLinear()
        // .domain([0, d3.max(bins, function(d) { return d.length; })])
        //.domain([0, d3.max(cumData, function(d) { return d.quantity; })])
        .domain([0,100])
        .range([height-margin.bottom, margin.top])
        

    var xAxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(scaleDate));

    var line = d3.line()
        .x(function(d) { return scaleDate(d.date); })
        .y(function(d){ return yScale(d.quantity); })
        .curve(d3.curveStep)

    var path = svg.selectAll(".path").data([cumData])

    path.enter().append("path")
        .attr("class", "path")
        .attr("d", line)
        .attr("stroke", "#cccccc")
        .attr("fill", "none")
        .attr("stroke-width", 1)

    // var line = d3.area()
    //     .x(function(d) { return scaleDate(d.x0); })
    //     .y1(function(d) { return yScale(d.length); })
    //     .y0(height - margin.bottom)
    //     .curve(d3.curveBasis);

    // wearLine = svg.selectAll(".path").data([bins])

    // wearLine.enter().append("path")
    //     .attr("class", "path")
    //     .merge(wearLine)
    //     .attr("d", line)
    //     .attr("stroke", "#cccccc")
    //     .attr("fill", "#cccccc")
    //     .attr("stroke-width", 1)

    // svg.selectAll("rect")
    //     .data(bins)
    //     .enter()
    //     .append("rect")
    //     .attr("x", d => scaleDate(d.x0))
    //     .attr("width", (width-margin.left-margin.right)/bins.length-10)
        
    //     .attr("y", d => yScale(d.length))
    //     .attr("height", d => yScale(0)- yScale(d.length))

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}