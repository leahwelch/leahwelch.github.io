d3.csv("./data/adam_movie_details.csv", function(data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {left: 70, top: 100, right: 70, bottom: 100};
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var runTime = {
        min: d3.min(data, function(d){ return +d.runTime; }),
        max: d3.max(data, function(d){ return +d.runTime; })       
    };
    console.log(runTime);

    var budget = {
        min: d3.min(data, function(d){ return +d.budget; }),
        max: d3.max(data, function(d){ return +d.budget; })       
    };

    var revenue = {
        min: d3.min(data, function(d){ return +d.revenue; }),
        max: d3.max(data, function(d){ return +d.revenue; })       
    };
    console.log(revenue);
    console.log(data);

    var xScale = d3.scaleBand()
        .domain(["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"])
        .range([margin.left, width-margin.right])  
        .padding(1); 

    var yScale = d3.scaleLinear()
        .domain([8, 180])
        .range([height-margin.bottom, margin.top]);
    
    var rScale = d3.scaleSqrt()
        .domain([1000, 250000000])
        .range([3, 25]);

    var colors = ["#193847", "#4c6470", "#809199", "#b3bdc2", "#ffffff"];

    var xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .attr("class", "axis")
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("class", "axis")
        .call(d3.axisLeft().scale(yScale));

    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Year");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .style("text-anchor", "middle")
        .attr("y",margin.left/2 -20)
        .text("Run Time (minutes)");

    /*var lines = svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
          .attr("x1", function(d) { return xScale(d.year); })
          .attr("x2", function(d) { return xScale(d.year); })
          .attr("y1", height-margin.bottom)
          .attr("y2", function(d) { return height - yScale(d.runTime); })
          .attr("class", "myline")
          .attr("stroke", "#FFFFFF")
          .attr("stroke-width", 5);*/

    var points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.year); }) 
            .attr("cy", function(d) { return yScale(d.runTime); })
            .attr("r", function(d) { return rScale(d.budget); })
            .attr("fill", function(d) { 
                if(d.revenue < 7000) {
                    return colors[0];
                } else if(d.revenue >=7000 && d.revenue < 8000000 ) {
                    return colors[1];
                } else if(d.revenue >= 8000000 && d.revenue < 50000000) {
                    return colors[2];
                } else if(d.revenue >=50000000 && d.revenue < 2000000000) {
                    return colors[3];
                } else {
                    return colors[4];
                }
             })

    

});