d3.csv("./data/gapminder.csv").then(function(data) {
/* defining variables for the width and heigth of the SVG */
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};

    /*
    TASK 1
    Create a variable named `filtered_data` that stores a filtered copy of `data`.
    Specifically, `filtered_data` should hold all rows of data in the data set 
    where the country is the United States (and only the United States).

    */
/* filter subset of data, grabbing only the rows where the country = United States */
    var filtered_data = data.filter(function(d) {
        return d.country === "United States";
    }) ;

    console.log(filtered_data);

  /*creating the actual SVG */
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /* setting min and max values of lifeExp as numbers */
    var lifeExp = {
        min: d3.min(filtered_data, function(d) { return +d.lifeExp; }),
        max: d3.max(filtered_data, function(d) { return +d.lifeExp; })
    };


    /*
    TASK 2
    Create a variable named `year` whose value is an object.
    The object should have 2 properties that store the values of the minimum 
    and maximum value of the column named `year` in the data set, 
    similar to `lifeExp` above.

    */
    /* setting min and max values of year as numbers */
   var year = {
        min: d3.min(filtered_data, function(d) { return +d.year; }),
        max: d3.max(filtered_data, function(d) { return +d.year; })
    };


    /*
    TASK 3
    Using the values in `year`, create a variable named `xScale` that 
    constructs a d3.scaleLinear() for the x-axis of the scatter plot.
    The scale will be used later in the code to construct an x-axis 
    for the chart based on the value of the `year` column in the data set.

    */
   /* setting xScale to map data values to the size of the SVG 
   Is there a more effiient way to set up the domain for the xScale of a bar chart? */
   
  var xScale = d3.scaleBand()
        .domain(["1952", "1957", "1962", "1967", "1972", "1977", "1982", "1987", "1992", "1997", "2002", "2007"])
        .range([margin.left, width-margin.right])  
        .padding(0.5);  

    /* setting yScale to mape data values to the size of the SVG */
    
    var yScale = d3.scaleLinear()
        .domain([lifeExp.min, lifeExp.max])
        .range([height-margin.bottom, margin.top]);

    
    /*making the bars in the barchart:
    uses filtered data
    defines height and width of bars
    */    

    var bar = svg.selectAll("rect")   
        .data(filtered_data)
        .enter()
        .append("rect")
            .attr("x", function(d) {return xScale(d.year); } )
            .attr("y", function(d) {return yScale(d.lifeExp); } ) 
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - margin.bottom - yScale(d.lifeExp); })
            .attr("fill", "pink");

    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
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
        .attr("y",margin.left/2)
        .text("Life Expectancy");

});

