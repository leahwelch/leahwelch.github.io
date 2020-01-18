d3.csv("data/gapminder.csv").then(function(data) {

    console.log(data);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};
    //Filtering the data to 2007//
    var filtered_data2007 = data.filter(function(d) {
        return d.year == 2007;
    });
    //Filtering the data for 1957//
    var filtered_data1957 = data.filter(function(d) {
        return d.year == 1957;
    });


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        //Adding the second min/max sets (1957) for each variable//
    var lifeExp = {
        min1957: d3.min(filtered_data1957, function(d) { return +d.lifeExp; }),
        max1957: d3.max(filtered_data1957, function(d) { return +d.lifeExp; }),
        min2007: d3.min(filtered_data2007, function(d) { return +d.lifeExp; }),
        max2007: d3.max(filtered_data2007, function(d) { return +d.lifeExp; })
    };

    var gdpPercap = {
        min1957: d3.min(filtered_data1957, function(d) { return +d.gdpPercap; }),
        max1957: d3.max(filtered_data1957, function(d) { return +d.gdpPercap; }),
        min2007: d3.min(filtered_data2007, function(d) { return +d.gdpPercap; }),
        max2007: d3.max(filtered_data2007, function(d) { return +d.gdpPercap; })
    };

    var pop = {
        min1957: d3.min(filtered_data1957, function(d) { return +d.pop; }),
        max1957: d3.max(filtered_data1957, function(d) { return +d.pop; }),
        min2007: d3.min(filtered_data2007, function(d) { return +d.pop; }),
        max2007: d3.max(filtered_data2007, function(d) { return +d.pop; })
    }

    //updating the xScale, yScale, and rScale so 1957 is our starting point//
    var xScale = d3.scaleLinear()
        .domain([lifeExp.min1957, lifeExp.max1957])
        .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
        .domain([gdpPercap.min1957, gdpPercap.max1957])
        .range([height-margin.bottom, margin.top]);

    var rScale = d3.scaleSqrt()
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

});
