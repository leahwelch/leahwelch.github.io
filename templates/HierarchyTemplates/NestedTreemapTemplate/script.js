d3.csv("data/2018-boston-crimes.csv").then(function(data) {
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
    We want to eventually create a treemap that shows the relative proportion of each offense code group
    for the top 10 (by frequency) offense code groups in 2018.
    We can use the function d3.nest() to count the number of incidents of each unique offense code group:
    */

    /*
    VARIATION:
    How does our treemap change if we have a multi-level nesting?
    What happens if we rearrange the order of the .key() methods?
    */
    var nested = d3.nest()
        .key(function(d) { return d.OFFENSE_CODE_GROUP; })
        .key(function(d) { return d.DAY_OF_WEEK; })
        .rollup(function(d) { return d.length;})
        .entries(data)
        .sort(function(a,b) { return b.value - a.value; });


    /*
    After sorting the data above from largest to smallest, use array.slice() to grab only the first 10 entries
    */
    nested = nested.slice(0,10);

    console.log(nested);

    /*
    CREATE A COLOR SCALE
    The D3 module d3-scale-chromatic features several different color palettes we can use.
    How do these differ in their usage?
    What kinds of color palettes are best for these data?
    */
    var color = d3.scaleOrdinal(d3.schemeDark2);
    // var color = d3.scaleOrdinal(d3.schemeBlues[5]);
    // var color = d3.scaleOrdinal(d3.schemeSpectral[9]);

    /*
    CREATE THE TREEMAP LAYOUT GENERATOR
    */

    var treemap = d3.treemap()
        .size([width, height])
        .padding(1);

    /*
    CREATE THE HIERARCHY
    We need to use d3.hierarchy() to turn our data set into a 'hierarchical' data structure;
    d3.treemap() REQUIRES a hierarchical structure to generate the treemap layout
    */
    var hierarchy = d3.hierarchy({values: nested}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    /*
    GENERATE THE ROOT HIERARCHY
    By passing in our hierarchical data structure into our treemap() function,
    we generate the geometries required to create the treemap in the SVG canvas
    */
    var root = treemap(hierarchy);
    console.log(root);
    console.log(root.leaves());

    /*
    DRAW THE RECTANGLES FOR THE TREEMAP
    We will use our `root` structure, from above, to draw the rectangles for the treemap;
    we will do this by performing a data join with the array of nodes returned by root.leaves()
    (What does this return? Inspect the structure in the JS console)

    VARIATION:
    What if we use the multi-level nesting from above to generate our treemap?
    How would we color the rectangles according to their parent category
    (i.e., each day of week rectangle is colored according to the offense code category
    to which it belongs)?
    */





    /*
    ADD LABELS
    We can join the same root.leaves(), used to create the rectangles, to a new selection
    to generate text labels for the rectangles
    */
    // svg.selectAll("text")
    //   .data(root.leaves())
    //   .enter()
    //   .append("text")
    //     .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
    //     .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
    //     .attr("font-size", "15px")
    //     .attr("fill", "white")
    //     .text(function(d){ return d.data.key});

    /*
    ADD TOOLTIP
    The visualization gets too cluttered if we try to add text labels;
    use a tooltip instead
    */
    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class","tooltip");

    rect.on("mouseover", function(d) {





    }).on("mouseout", function() {





    });
});
