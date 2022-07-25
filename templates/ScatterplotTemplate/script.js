d3.csv("./data/gapminder.csv").then(function(data) {
    console.log(data);
/* `data` acts like a variable that holds everything in the CSV */
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var filtered_data = data.filter(function(d) {
        return d.year == 1957;
   
/* filtered by column header */
    });

    // var filtered_data = filtered_data.filter(function(d) {
    //     return d.continent === "Europe";
    // }) ;

    console.log(filtered_data);

    var lifeExp = {
        min: d3.min(filtered_data, function(d){ return +d.lifeExp; }),
        max: d3.max(filtered_data, function(d){ return +d.lifeExp; })
    /* + sign makes sure the code reads the min and max as numbers, not strings 
    d.lifeExp (lifeExp in this scenario comes from the column headers)
    */
    };

    var gdpPercap = {
        min: d3.min(filtered_data, function(d){ return +d.gdpPercap; }),
        max: d3.max(filtered_data, function(d){ return +d.gdpPercap; })       
    };

    var pop = {
        min: d3.min(filtered_data, function(d){ return +d.pop; }),
        max: d3.max(filtered_data, function(d){ return +d.pop; })       
    };

    var xScale = d3.scaleBand()
        .domain([lifeExp.min, lifeExp.max])
        .range([margin.left, width-margin.right])
        .padding(1);

    var yScale = d3.scaleLinear()
        .domain([gdpPercap.min, gdpPercap.max])
        .range([height-margin.bottom, margin.top]);

    /* takes the square root of the values to be used as the radii for the circles */
        var rScale = d3.scaleSqrt()
        .domain([pop.min, pop.max])
        .range([3, 25]);

    /* Produces our color palette */    
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft().scale(yScale));

    /* "g" element is a group element 
    "$" evaluates what is in curly braces as an expression and inserts it as a string into the template-literal (the stuff inside the back-ticks ``)
    When you create an axis generator, you need to instruct the scale
    */

    /* Draw points for scatterplot based on dataset
    Defining attributes, dynamically assigning them based on the objects inside the array
    Every row in the spreadhseet in an object */
    var points = svg.selectAll("circle")
        .data(filtered_data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.lifeExp); }) /* accessing values inside the function that is attached to it. d is referencing each individual object. The way we access values and properties of that object is to name the column whose properties we want to access. Accessing values inside the object and assigning those to attributes */
            .attr("cy", function(d) { return yScale(d.gdpPercap); })
            .attr("r", function(d) { return rScale(d.pop); })
            // .attr("fill", function(d) { return colorScale(d.continent); })
    
    var xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width/2)
        .attr("y", height - margin.bottom/2)
        .text("Life Expectancy");
    
    var yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", margin.left/2)
        .text("GDP Per Capita");

});