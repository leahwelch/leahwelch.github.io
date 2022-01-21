//MAPPING AGE OF ITEM AGAINST WEAR COUNT

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 150, right: 50, bottom: 50};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    console.group(data);

    let nested = d3.nest()
        .key(d=>d.id)
        .rollup()
        .entries(data)

    nested.forEach(function(d) {
        d.values.sort((a,b) => d3.ascending(a.date,b.date))
        if(d.values[0].new === 'N') {
            d.age = 450;
        } else {
            d.age = Math.round(getDifferenceInDays(new Date(), d.values[0].date))
        }
        d.wearCount = d.values.length;
    })
    
    console.log(nested)

    const xScale = d3.scaleLinear()
        .domain([0,451])
        .range([margin.left, width-margin.right])

    var yScale = d3.scaleLinear()
        .domain([0,150])
        .range([height-margin.bottom, margin.top])

    var xAxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))

    svg.selectAll("circle")
        .data(nested)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.age); })
        .attr("cy", function(d) { return yScale(d.wearCount); })
        .attr("r", 8)
        .style("opacity", 0.25)
        .style("mix-blend-mode", "multiply")

    
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group,
        new: d.new
    }
    
}

function getDifferenceInDays(date1,date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
}