d3.csv("./data/deserts.csv").then(function(data) {
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
        return d.region == "West North Central";
    });
   
/* filtered by column header */
    // });

    // var filtered_data = filtered_data.filter(function(d) {
    //     return d.continent === "Europe";
    // }) ;

    // console.log(filtered_data);

    var deserts = {
        min: d3.min(filtered_data, function(d){ return +d.median_groc; }),
        max: d3.max(filtered_data, function(d){ return +d.median_groc; })
    /* + sign makes sure the code reads the min and max as numbers, not strings 
    d.lifeExp (lifeExp in this scenario comes from the column headers)
    */
    };

    var swamps = {
        min: d3.min(filtered_data, function(d){ return +d.median_ff; }),
        max: d3.max(filtered_data, function(d){ return +d.median_ff; })       
    };

    var obesity = {
        min: d3.min(filtered_data, function(d){ return +d.obesity; }),
        max: d3.max(filtered_data, function(d){ return +d.obesity; })       
    };

    var xScale = d3.scaleLinear()
        .domain([0, 0.5])
        .range([margin.left, width/2]);

    var yScale = d3.scaleLinear()
        .domain([0, 1.3])
        .range([height-margin.bottom, margin.top]);

    /* takes the square root of the values to be used as the radii for the circles */
        var rScale = d3.scaleSqrt()
        .domain([obesity.min, obesity.max])
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
            .attr("cx", function(d) { return xScale(d.median_groc); }) /* accessing values inside the function that is attached to it. d is referencing each individual object. The way we access values and properties of that object is to name the column whose properties we want to access. Accessing values inside the object and assigning those to attributes */
            .attr("cy", function(d) { return yScale(d.median_ff); })
            .attr("r", function(d) { return rScale(d.obesity); })
            .attr("fill", "#9e182e")
            .attr("opacity", 0.8)

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");
    
    var xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width/2)
        .attr("y", height - margin.bottom/2)
        .text("Median Grocery Stores/1000 Population");
    
    var yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", margin.left/2)
        .text("Median Fast Food Restaurants/1000 Population");

    points.on("mouseover", function(d){ /*d is referencing each of the cirlces*/
    
        var cx = +d3.select(this).attr("cx")+10;
        var cy = +d3.select(this).attr("cy")-15;
    
        tooltip.style("visibility", "visible")
            .style("left", cx+"px")
            .style("top", cy+"px")
            .text(d.state);
    
        d3.select(this)
            .attr("stroke", "red")
            .attr("stroke-width", 2);
        }).on("mouseout", function(){
        tooltip.style("visibility", "hidden");
    
        d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        });

});