var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 50, right: 50, bottom: 50};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    const newItems = data.filter(d => d.new === "N")
    const soldItems = data.filter(d => d.sold === "Y")

    const newNest = d3.nest()
        .key(d=>d.id)
        .rollup()
        .entries(newItems)
        .sort((a,b) => d3.descending(b.key,a.key))

    

    newNest.forEach(function(d) {
        d.firstWear = d3.min(d.values, function(p) { return p.date; })
    })

    console.log(newNest)

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2022-05-31")])
        .range([margin.left, width-margin.right])

    var yScale = d3.scalePoint()
        .domain(newNest.map(function(d) { return d.key; }))
        .range([margin.top, height-margin.bottom])
        .padding(1)

    var xAxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(scaleDate)
            .ticks(16));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))

    const grouping = svg.selectAll(".stackGroup")
        .data(newNest)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(0,${yScale(d.key) - 4})`)

    let bars = grouping.selectAll("rect").data(d=>d.values)


    bars.enter()
        .append("rect")
        .attr("x", function(d) { return scaleDate(d.date); })
        // .attr("y", function(d) { return yScale(d.id)-4; })
        //.attr("cy", height/2)
        .attr("width", 1)
        .attr("height", 8)
        .attr("fill", function(d) {
            if(d.sold === "Y") {
                return "red";
            } else {
                return "black";
            }
        })
});

function parse(d) {

    return {
        date: new Date(d.date),
        week: +d.week,
        group: d.group,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold
    }
    
}