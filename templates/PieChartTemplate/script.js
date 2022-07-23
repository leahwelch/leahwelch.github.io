d3.csv("./data/2018-boston-crimes.csv").then(function(data) {
    /*
    BOSTON CRIME DATA from the BOSTON POLICE DEPARTMENT, 2018
    Adapted from:
    https://www.kaggle.com/ankkur13/boston-crime-data/
    */
    console.log(data);

    /*
    BEGIN BY DEFINING THE DIMENSIONS OF THE SVG and CREATING THE SVG CANVAS
    */
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    /*
    TRANSFORM THE DATA
    We want to eventually create a pie chart that shows the relative proportion of each offense code group
    for the top 10 (by frequency) offense code groups in 2018.
    We can use the function d3.nest() to count the number of incidents of each unique offense code group.
    Essentially, we are creating a hierarchical data structure, grouped by the values of the OFFENSE_CODE_GROUP column
    */

    var nested = d3.nest()
        .key(function(d){ return d.OFFENSE_CODE_GROUP; })
        .rollup(function(d){ return d.length; })
        .entries(data)
        .sort(function(a, b) { return b.value - a.value; });

        console.log(nested);


    /*
    After sorting the data above from largest to smallest, use array.slice() to grab only the first 10 entries
    */

    var filtered = nested.slice(0,10); /* grabs all of the items in the aray numbered 0, 1, 2, 3, 4 all the way up to 9*/

    console.log(filtered);

    /*
    CREATE A GROUP ELEMENT
    We will create a `g` element to position the pie chart (to come!) in the center of the SVG
    the g element centers the pie chart for us
    */
    var g = svg.append("g")
        .attr("transform",`translate(${width/2},${height/2})`); /*halfway across width and height of screen*/


    /*
    CREATE THE PIE GENERATOR
    The function d3.pie() will convert our data above into a transformed data set we can use
    to draw the wedges of the pie chart
    */

    var pie = d3.pie()
        .value(function(d) { return d.value; });



    /*
    We create a color palette to assign each wedge a unique color with d3.scaleOrdinal()
    */
    var color = d3.scaleOrdinal(d3.schemeCategory10);



    /*
    CREATE THE ARC GENERATOR
    This is similar to d3.line(), d3.area(), etc. in that it will help us create `path` elements
    */


    var arc = d3.arc()
        .innerRadius(150)
        .outerRadius(250);


    /*
    CREATE THE ARCS
    The pie() function (which we defined above, using d3.pie()) will be used to convert our data in `filtered`
    into a data structure that can be used to generate the wedges of the pie.
    Here, we are first creating `g` elements for each wedge...
    */
    
    console.log(pie(filtered));

    var arcs = g.selectAll(".arc")
        .data(pie(filtered))
        .enter()
        .append("g")
            .attr("class", "arc");



    /*
    ...and then we are appending new SVG `path` elements to those g elements, one for each wedge
    */
/*i is a reference to the index of each of the newly created path elements)*/
    arcs.append("path")
        .attr("d", function(d) { return arc(d); })
        .attr("fill", function(d, i) {
            return color(i);
        });




    /*
    Optionally, create a tooltip for the chart!
    */

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");
    
    arcs.on("mousemove", function(d){

        var mouse = d3.mouse(this);
        var cx = mouse[0] + width/2;
        var cy = mouse[1] + height/2;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .text(d.data.key);
        d3.select(this)
            .attr("stroke", "orange")
            .attr("stroke-width", 5)
            .raise();
    }).on("mouseout", function(){
        tooltip.style("visibility", "hidden");
        d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
    });





});
