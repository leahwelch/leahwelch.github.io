

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 150, left: 150, right: 150, bottom: 150};

// console.log(width);
// console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    console.log(data);
    // var filtered_data = data.filter(function(d) {
    //     return d.date >= new Date("2021-01-01") && d.date <= new Date("2021-01-02");
    // });

    // console.log(filtered_data);

    var dateNest = d3.nest()
        .key(function(d) { return d.date; })
        // .rollup()
        .entries(data)

    console.log(dateNest);

    var filteredNest = dateNest.filter(function(d,i) {
        return i == 0;
    });

    console.log(filteredNest);

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-05-15")])
        .range([margin.left, width-margin.right])

    var histogramValues = d3.histogram()
        .value(function(d) {return d.date})
        .domain(scaleDate.domain())
        .thresholds(scaleDate.ticks(28))

    var testData = [];
    var keys = [];
    var sumstat = [];
    for(var i = 0; i < filteredNest[0].values.length; i++) {
        var key = filteredNest[0].values[i].id;
        var filtered_data = data.filter(function(d) {
            return d.id === key
        })
        var bins = histogramValues(filtered_data);
        for(var j = 0; j < bins.length; j++) {
            var x0 = bins[j].x0;
            sumstat.push({
                key: x0, values: [
                    {id: key, n: bins[i].length}
                ]
            })
        }
        testData.push({id: key, data: bins})
        keys.push(key)
    }
    console.log(testData);
    console.log(keys);
    

    // var stackedData = d3.stack()
    //     .keys(keys)
    //     .value(function(d, key){
    //         return d.values[key].n
    //     })

    

    

    
    

    
    // console.log(bins)

    // var histogramValues = d3.histogram()
    //     .value(function(d) {return d.date})
    //     .domain(scaleDate.domain())
    //     .thresholds(scaleDate.ticks(7))

    // bins = histogramValues(filtered_data);
    // console.log(bins)

    // var yScale = d3.scaleLinear()
    //     // .domain([0, d3.max(bins, function(d) { return d.length; })])
    //     .domain([0, 30])
    //     .range([height-margin.bottom, margin.top])
        

    // var xAxis = svg.append("g")
    //     .attr("class","xaxis")
    //     .attr("transform", `translate(0, ${height-margin.bottom})`)
    //     .call(d3.axisBottom().scale(scaleDate));

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