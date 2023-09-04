var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = { top: 50, left: 50, right: 1000, bottom: 50 };

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/indices-vis.csv", parse).then(function (data) {

    var xScale = d3.scaleLinear()
        .domain([-3, 3])
        .range([margin.left, width - margin.right])

    var drivable_histogram = d3.histogram()
        .value(function (d) { return d.drivable })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(100))

    drivable_bins = drivable_histogram(data);

    var walkable_histogram = d3.histogram()
        .value(function (d) { return d.walkable })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(100))

    walkable_bins = walkable_histogram(data);

    var dense_histogram = d3.histogram()
        .value(function (d) { return d.dense })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(100))

    dense_bins = dense_histogram(data);

    var diverse_histogram = d3.histogram()
        .value(function (d) { return d.diverse })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(100))

    diverse_bins = diverse_histogram(data);

    var affordable_histogram = d3.histogram()
        .value(function (d) { return d.affordable })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(100))

    affordable_bins = affordable_histogram(data);

    var drivable_yScale = d3.scaleLinear()
        .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
        .range([(height - margin.bottom) / 5 - 50, margin.top])

    var drivable_xAxis = svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(${((width - margin.left - margin.right) / drivable_bins.length - 1) / 2}, ${(height - margin.bottom) / 5 - 50})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll(".drivable_rect")
        .data(drivable_bins)
        .enter()
        .append("rect")
        .attr("class", "drivable_rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width - margin.left - margin.right) / drivable_bins.length - 1)
        .attr("y", d => drivable_yScale(d.length))
        .attr("height", d => drivable_yScale(0) - drivable_yScale(d.length))

    svg.append("text")
        .attr("x", (width - margin.right) / 2)
        .attr("y", (height - margin.bottom) / 5 - 20)
        .text("Drivable Score")
        .attr("class", "label")

    var walkable_yScale = d3.scaleLinear()
        .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
        .range([((height - margin.bottom) / 5) * 2 - 50, (height - margin.bottom) / 5])

    var walkable_xAxis = svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(${((width - margin.left - margin.right) / drivable_bins.length - 1) / 2}, ${((height - margin.bottom) / 5) * 2 - 50})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll(".walkable_rect")
        .data(walkable_bins)
        .enter()
        .append("rect")
        .attr("class", "walkable_rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width - margin.left - margin.right) / walkable_bins.length - 1)
        .attr("y", d => walkable_yScale(d.length))
        .attr("height", d => walkable_yScale(0) - walkable_yScale(d.length))

    svg.append("text")
        .attr("x", (width - margin.right) / 2)
        .attr("y", ((height - margin.bottom) / 5) * 2 - 20)
        .text("Walkable Score")
        .attr("class", "label")

    var dense_yScale = d3.scaleLinear()
        .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
        .range([((height - margin.bottom) / 5) * 3 - 50, ((height - margin.bottom) / 5) * 2])

    var dense_xAxis = svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(${((width - margin.left - margin.right) / drivable_bins.length - 1) / 2}, ${((height - margin.bottom) / 5) * 3 - 50})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll(".dense_rect")
        .data(dense_bins)
        .enter()
        .append("rect")
        .attr("class", "dense_rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width - margin.left - margin.right) / dense_bins.length - 1)
        .attr("y", d => dense_yScale(d.length))
        .attr("height", d => dense_yScale(0) - dense_yScale(d.length))

    svg.append("text")
        .attr("x", (width - margin.right) / 2)
        .attr("y", ((height - margin.bottom) / 5) * 3 - 20)
        .text("Dense Score")
        .attr("class", "label")

    var diverse_yScale = d3.scaleLinear()
        .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
        .range([((height - margin.bottom) / 5) * 4 - 50, ((height - margin.bottom) / 5) * 3])

    var diverse_xAxis = svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(${((width - margin.left - margin.right) / drivable_bins.length - 1) / 2}, ${((height - margin.bottom) / 5) * 4 - 50})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll(".diverse_rect")
        .data(diverse_bins)
        .enter()
        .append("rect")
        .attr("class", "dense_rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width - margin.left - margin.right) / diverse_bins.length - 1)
        .attr("y", d => diverse_yScale(d.length))
        .attr("height", d => diverse_yScale(0) - diverse_yScale(d.length))

    svg.append("text")
        .attr("x", (width - margin.right) / 2)
        .attr("y", ((height - margin.bottom) / 5) * 4 - 20)
        .text("Diverse Score")
        .attr("class", "label")

    var affordable_yScale = d3.scaleLinear()
        .domain([0, d3.max(walkable_bins, function (d) { return d.length; })])
        .range([((height - margin.bottom) / 5) * 5 - 50, ((height - margin.bottom) / 5) * 4])

    var affordable_xAxis = svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(${((width - margin.left - margin.right) / drivable_bins.length - 1) / 2}, ${((height - margin.bottom) / 5) * 5 - 50})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll(".affordable_rect")
        .data(affordable_bins)
        .enter()
        .append("rect")
        .attr("class", "affordable_rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width - margin.left - margin.right) / affordable_bins.length - 1)
        .attr("y", d => affordable_yScale(d.length))
        .attr("height", d => affordable_yScale(0) - affordable_yScale(d.length))

    svg.append("text")
        .attr("x", (width - margin.right) / 2)
        .attr("y", ((height - margin.bottom) / 5) * 5 - 20)
        .text("Affordable Score")
        .attr("class", "label")




});

function parse(d) {

    return {
        drivable: +d.f_drivable,
        walkable: +d.f_walkable,
        dense: +d.f_dense,
        diverse: +d.f_diverse,
        affordable: +d.f_affordable
    }

}