var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/111999474";
var frequency = 10 * 1000; //10 seconds

function fetchData() {
    d3.json(realTimeURL, function(error,users) {
        console.log("users:", users);
        d3.select("#users").html(users);

        var data=[]
        data.push({value: users});
        console.log(data);

        function convert2numbers(d,i) {
            d.value = +d.value;
        }

        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;
        var margin = {top: 50, left: 150, right: 50, bottom: 150};

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var lines = svg.selectAll(".myline")
            .data(data)
            .enter()
            .append("line")
              .attr("x1", margin.left)
              .attr("x2", function(data) { return (data.value*5); })
              .attr("y1", 100)
              .attr("y2", 100)
              .attr("class", "myline")
              .attr("stroke", "#A7A7A7")
              .attr("stroke-width", 5);

        var newLines = svg.selectAll(".myline").data(data);

        newLines.enter().append("line")
            .attr("x1", margin.left)
            .attr("x2", function(data) { return (data.value*5); })
            .attr("y1", 100)
            .attr("y2", 100)
        .merge(newLines)
            .transition()
                .attr("x1", margin.left)
                .attr("x2", function(data) { return (data.value*5); })
                .attr("y1", 100)
                .attr("y2", 100)
            .attr("stroke", "#A7A7A7")
            .attr("stroke-width", 5);
        
        newLines.exit()
            .transition()
            .remove();

        /*var points = svg.selectAll("circle")
            .data(data/*, function(d) { return d.country; })
            .enter()
            .append("circle")
                .attr("cx", width/2)
                .attr("cy", 350)
                .attr("r", function(d) { return d.value; })
                .attr("fill", "red"/*function(d) { return colorScale(d.continent); });

        var newPoints = svg.selectAll("circle")
            .data(data);

        newPoints.enter().append("circle")
            .attr("cx", width/2)
            .attr("cy", 350)
            .attr("r", function(d) { return d.value; })
            .attr("fill", "red")
        .merge(newPoints)
        .transition()
        .duration(1000)
        .delay(250)
        .attr("cx", width/2)
        .attr("cy", 350)
        .attr("r", function(d) { return d.value; })
        .attr("fill", "red");
        newPoints.exit()
            .transition()
            .duration(1000)
            .delay(250)
            .attr("r", 0)
            .remove();*/
    });
}

fetchData();
setInterval(fetchData, frequency);


    /*var rScale = d3.scaleSqrt()
        .domain([pop.min1957, pop.max1957])
        .range([3, 25]);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));
    //Drawing points using the 1957 filtered data set//
    var points = svg.selectAll("circle")
        .data(filtered_data1957, function(d) { return d.country; })
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.lifeExp); })
            .attr("cy", function(d) { return yScale(d.gdpPercap); })
            .attr("r", function(d) { return rScale(d.pop); })
            .attr("fill", function(d) { return colorScale(d.continent); });

    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Life Expectancy");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("GDP Per Capita");

      // The data update //
      //setting the new scales for 2007//
      xScale.domain([lifeExp.min2007, lifeExp.max2007]);
      yScale.domain([gdpPercap.min2007, gdpPercap.max2007]);
      rScale.domain([pop.min2007, pop.max2007]);
      //grabbing all circles and assigning the filtered data set for 2007//
      var newPoints = svg.selectAll("circle")
        .data(filtered_data2007, function(d) { return d.country; });
      //drawing circles for that new dataset//
      newPoints.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.lifeExp); })
        .attr("cy", function(d) { return yScale(d.gdpPercap); })
        .attr("r", function(d) { return rScale(d.pop); })
        .attr("fill", function(d) { return colorScale(d.continent); })
        //merge and transition of datapoints//
      .merge(newPoints)
        .transition()
        .duration(1000)
        .delay(250)
        .attr("cx", function(d) { return xScale(d.lifeExp); })
        .attr("cy", function(d) { return yScale(d.gdpPercap); })
        .attr("r", function(d) { return rScale(d.pop); })
        .attr("fill", function(d) { return colorScale(d.continent); });
      //exit method for new data points, remove the points that are no longer in the set//
      newPoints.exit()
        .transition()
        .duration(1000)
        .delay(250)
        .attr("r", 0)
        .remove();
      //transition the axes//
      xAxis.transition()
        .duration(1000)
        .delay(250)
        .call(d3.axisBottom().scale(xScale));

      yAxis.transition()
        .duration(1000)
        .delay(250)
        .call(d3.axisLeft().scale(yScale));

});*/
