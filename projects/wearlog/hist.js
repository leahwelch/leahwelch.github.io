var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 50, right: 50, bottom: 50};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    // console.group(data);
    var filtered_data = data.filter(function(d) {
        return d.sold != "Y";
    });

    var nested = d3.nest()
        .key(function(d) { return d.id; })
        .rollup(function(v) { return v.length;})
        // .rollup()
        .entries(filtered_data)
        .sort((a,b) => d3.ascending(a.key,b.key));

    console.log(nested)

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-10-04")])
        .range([margin.left, width-margin.right])

    var xScale = d3.scaleLinear()
        .domain([0,192])
        .range([margin.left, width-margin.right])

    var histogramValues = d3.histogram()
        .value(function(d) {return d.value})
        .domain(xScale.domain())
        .thresholds(xScale.ticks(192))

    bins = histogramValues(nested);
    console.log(bins)

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        // .domain([0, 15])
        .range([height-margin.bottom, margin.top])
        

    var xAxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", (width-margin.left-margin.right)/bins.length-1)
        
        .attr("y", d => yScale(d.length))
        .attr("height", d => yScale(0)- yScale(d.length))

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group,
        sold: d.sold
    }
    
}s