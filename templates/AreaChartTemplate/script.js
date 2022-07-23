d3.csv("./data/gapminder.csv").then(function(data) {
/* defining variables for the width and heigth of the SVG */
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};

/* filter subset of data, grabbing only the rows where the country = United States */
    var filtered_data = data.filter(function(d) {
        return d.country === "United States";
    }) ;

  /*creating the actual SVG */
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /* setting min and max values of gdpPercap as numbers */

    var gdpPercap = {
        min: d3.min(filtered_data, function(d) { return +d.gdpPercap; }),
        max: d3.max(filtered_data, function(d) { return +d.gdpPercap; })
    };

    /* setting min and max values of year as numbers */
   var year = {
        min: d3.min(filtered_data, function(d) { return +d.year; }),
        max: d3.max(filtered_data, function(d) { return +d.year; })
    };


    /* setting xScale to map data values to the size of the SVG */
    var xScale = d3.scaleLinear()
        .domain([year.min, year.max])
        .range([margin.left, width-margin.right]);
    
    /* setting yScale to mape data values to the size of the SVG */
    var yScale = d3.scaleLinear()
        .domain([gdpPercap.min, gdpPercap.max])
        .range([height-margin.bottom, margin.top]);

    /*var line = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.lifeExp); })
        .curve(d3.curveLinear); */
    
    var area = d3.area()
        .x(function(d) { return xScale(d.year); })
        .y1(function(d) { return yScale(d.gdpPercap); })
        .y0(height-margin.bottom);
    
    /*making the bars in the barchart:
    uses filtered data
    defines height and width of bars
    */    

    /*var bar = svg.selectAll("rect")   
        .data(filtered_data)
        .enter()
        .append("rect")
            .attr("x", function(d) {return xScale(d.year); } )
            .attr("y", function(d) {return yScale(d.lifeExp); } ) 
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - margin.bottom - yScale(d.lifeExp); })
            .attr("fill", "pink");*/

    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    /*var path = svg.append("path")
        .datum(filtered_data)
        .attr("d", function(d) { return line(d); })
        .attr("stroke","steelblue")
        .attr("fill","none")
        .attr("stroke-width",2); */
    
    var path = svg.append("path")
        .datum(filtered_data)
        .attr("d", area)
        .attr("fill","orange");
    
    
    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Year");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("GDP Per Capita");

});

