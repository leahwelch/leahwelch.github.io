d3.csv("data/sdgs_totals.csv").then(function(data) {

    console.log(data);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 300, left: 50, right: 250, bottom: 100};
    // //Filtering the data to 2007//
    // var filtered_data2007 = data.filter(function(d) {
    //     return d.year == 2007;
    // });
    // //Filtering the data for 1957//
    // var filtered_data1957 = data.filter(function(d) {
    //     return d.year == 1957;
    // });


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        //Adding the min/max sets for each variable//
    var sdg = {
        min: d3.min(data, function(d) { return +d.goal; }),
        max: d3.max(data, function(d) { return +d.goal; })
    };

    var totals = {
        min: d3.min(data, function(d) { return +d.totals; }),
        max: d3.max(data, function(d) { return +d.totals; })
    };

    console.log(sdg.min);
    // xScale, yScale, and rScale//
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.industry}))
        .range([margin.left, width-margin.right])
        .padding(1);

    var yScale = d3.scaleLinear()
        .domain([sdg.max, 1])
        .range([height-margin.bottom, margin.top]);

    var rScale = d3.scaleSqrt()
        .domain([totals.min, totals.max])
        .range([3, 25]);

    // var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    let xAxisGenerator = d3.axisTop(xScale)
        .tickSize(-height+margin.bottom+margin.top - 30);
    
    let xAxis =  svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${margin.top - 30})`)
        .call(xAxisGenerator);

    xAxis.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
        .style("text-anchor", "start");

    let yAxisGenerator = d3.axisRight(yScale)
        .tickSize(-width+margin.left+margin.right + 100)
        //.attr("transform", function(d){ return( "translate(-50,0)")})
        .ticks(17);

    let yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${width-margin.right-40},0)`)
        .call(yAxisGenerator);

    yAxis.selectAll(".tick text")
        .attr("class", "sideLabels")
        .attr("transform", function(d){ return( "translate(30,0)")})
        .style("text-anchor", "middle");
    
        //Drawing points using the totals//
    var points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.industry); })
            .attr("cy", function(d) { return yScale(d.goal); })
            .attr("r", function(d) { return rScale(d.totals); })
            .attr("fill", function(d) {
                if(d.industry === "Marketing") {
                    return "#ffffff";
                } else  {
                    return "#1F1F89";   
                }
            })
            .attr("opacity", .3);

    // var xAxisLabel = svg.append("text")
    //     .attr("class","axisLabel")
    //     .attr("x", width/2)
    //     .attr("y", height-margin.bottom/2)
    //     .text("Life Expectancy");

    // var yAxisLabel = svg.append("text")
    //     .attr("class","axisLabel")
    //     .attr("transform","rotate(-90)")
    //     .attr("x",-height/2)
    //     .attr("y",margin.left/2)
    //     .text("GDP Per Capita");

    //   // The data update //
    //   //setting the new scales for 2007//
    //   xScale.domain([lifeExp.min2007, lifeExp.max2007]);
    //   yScale.domain([gdpPercap.min2007, gdpPercap.max2007]);
    //   rScale.domain([pop.min2007, pop.max2007]);
    //   //grabbing all circles and assigning the filtered data set for 2007//
    //   var newPoints = svg.selectAll("circle")
    //     .data(filtered_data2007, function(d) { return d.country; });
    //   //drawing circles for that new dataset//
    //   newPoints.enter().append("circle")
    //     .attr("cx", function(d) { return xScale(d.lifeExp); })
    //     .attr("cy", function(d) { return yScale(d.gdpPercap); })
    //     .attr("r", function(d) { return rScale(d.pop); })
    //     .attr("fill", function(d) { return colorScale(d.continent); })
    //     //merge and transition of datapoints//
    //   .merge(newPoints)
    //     .transition()
    //     .duration(1000)
    //     .delay(250)
    //     .attr("cx", function(d) { return xScale(d.lifeExp); })
    //     .attr("cy", function(d) { return yScale(d.gdpPercap); })
    //     .attr("r", function(d) { return rScale(d.pop); })
    //     .attr("fill", function(d) { return colorScale(d.continent); });
    //   //exit method for new data points, remove the points that are no longer in the set//
    //   newPoints.exit()
    //     .transition()
    //     .duration(1000)
    //     .delay(250)
    //     .attr("r", 0)
    //     .remove();
    //   //transition the axes//
    //   xAxis.transition()
    //     .duration(1000)
    //     .delay(250)
    //     .call(d3.axisBottom().scale(xScale));

    //   yAxis.transition()
    //     .duration(1000)
    //     .delay(250)
    //     .call(d3.axisLeft().scale(yScale));

});
