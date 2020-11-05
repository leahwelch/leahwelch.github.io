d3.csv("./data/deserts.csv").then(function(data) {
    /* defining variables for the width and heigth of the SVG */
        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;
        var margin = {top: 50, left: 150, right: 700, bottom: 50};

        
    
        /*
        TASK 1
        Create a variable named `filtered_data` that stores a filtered copy of `data`.
        Specifically, `filtered_data` should hold all rows of data in the data set 
        where the country is the United States (and only the United States).
    
        */
    /* filter subset of data, grabbing only the rows where the country = United States */
    
    
      /*creating the actual SVG */
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
        /* setting min and max values of lifeExp as numbers */
        var obesity = {
            min: d3.min(data, function(d) { return +d.obesity; }),
            max: d3.max(data, function(d) { return +d.obesity; })
        };

        console.log(obesity);
    
        /*
        TASK 2
        Create a variable named `year` whose value is an object.
        The object should have 2 properties that store the values of the minimum 
        and maximum value of the column named `year` in the data set, 
        similar to `lifeExp` above.
    
        */
        /* setting min and max values of year as numbers */
       var swamps = {
            min: d3.min(data, function(d) { return +d.median_ff; }),
            max: d3.max(data, function(d) { return +d.median_ff; })
        };

        var deserts = {
            min: d3.min(data, function(d) { return +d.median_groc; }),
            max: d3.max(data, function(d) { return +d.median_groc; })
        };
    
    
        /*
        TASK 3
        Using the values in `year`, create a variable named `xScale` that 
        constructs a d3.scaleLinear() for the x-axis of the scatter plot.
        The scale will be used later in the code to construct an x-axis 
        for the chart based on the value of the `year` column in the data set.
    
        */
       /* setting xScale to map data values to the size of the SVG 
    
    
        /* setting yScale to mape data values to the size of the SVG */
    
        var xScale = d3.scaleLinear()
            .domain([0, 1.3])
            .range([margin.left, width-margin.right]);
        
        var yScale = d3.scaleBand()
            .domain(data.map(function(d) { return d.state_name; }))
            .range([height-margin.bottom, margin.top])
            .padding(1);
    
        var lines = svg.selectAll(".myline")
            .data(data)
            .enter()
            .append("line")
              .attr("x1", function(d) { return xScale(d.median_groc); })
              .attr("x2", function(d) { return xScale(d.median_ff); })
              .attr("y1", function(d) { return yScale(d.state_name); })
              .attr("y2", function(d) { return yScale(d.state_name); })
              .attr("class", "myline")
              .attr("stroke", "#aaaaaa");

        svg.selectAll("mycircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.median_groc); })
            .attr("cy", function(d) { return yScale(d.state_name); })
            .attr("r", "6")
            .style("fill", "#69b3a2")
        
        // Circles of variable 2
        svg.selectAll("mycircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.median_ff); })
            .attr("cy", function(d) { return yScale(d.state_name); })
            .attr("r", "6")
            .style("fill", "#4C4082")

        // var area = d3.area()
        //     .x(function(d) { return xScale(d.median_ff); })
        //     .y1(function(d) { return yScale(d.obesity); })
        //     .y0(height-margin.bottom);
        
    
        var xAxis = svg.append("g")
            .attr("class","axis")
            .attr("transform", `translate(0,${height-margin.bottom})`)
            .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));
    
        var yAxis = svg.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft().ticks(10).scale(yScale));
    
    
        var path = svg.append("path")
            .datum(data)
            .attr("d", function(d) { return line(d); })
            .attr("stroke","steelblue")
            .attr("fill","none")
            .attr("stroke-width",2); 

        var path = svg.append("path")
        .datum(data)
        .attr("d", area)
        .attr("fill","orange");
        
        
        // var xAxisLabel = svg.append("text")
        //     .attr("class","axisLabel")
        //     .attr("x", width/2)
        //     .attr("y", height-margin.bottom/2)
        //     .text("Year");
    
        // var yAxisLabel = svg.append("text")
        //     .attr("class","axisLabel")
        //     .attr("transform","rotate(-90)")
        //     .attr("x",-height/2)
        //     .attr("y",margin.left/2)
        //     .text("Amount Paid");
    
    });
    
    

// d3.csv("./data/Crop Loss - Composite.csv").then(function(data) {
// /* defining variables for the width and heigth of the SVG */
//     var width = document.querySelector("#chart").clientWidth;
//     var height = document.querySelector("#chart").clientHeight;
//     var margin = {top: 50, left: 150, right: 50, bottom: 150};

// /* filter subset of data, grabbing only the rows where the country = United States */
//     var filtered_data = data.filter(function(d) {
//         return d.system_type === "Rural and Traditional";
//     }) ;

//   /*creating the actual SVG */
//     var svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     /* setting min and max values of gdpPercap as numbers */

// //    var lossVal = [];
// //    for(i = 0; i < filtered_data.length; i++) {
// //         if(filtered_data.year == 1967) {
// //             lossVal.push(d3.mean([filtered_data.value]));
// //         }

// //    }
// //    console.log(lossVal);
//     var lossVal = {
//         min: d3.min(filtered_data, function(d) { return +d.avg_loss; }),
//         max: d3.max(filtered_data, function(d) { return +d.avg_loss; })
//     };

//     console.log(lossVal);
//     /* setting min and max values of year as numbers */
//    var year = {
//         min: d3.min(filtered_data, function(d) { return +d.year; }),
//         max: d3.max(filtered_data, function(d) { return +d.year; })
//     };


//     /* setting xScale to map data values to the size of the SVG */
//     var xScale = d3.scaleLinear()
//         .domain([year.min, year.max])
//         .range([margin.left, width-margin.right]);
    
//     /* setting yScale to mape data values to the size of the SVG */
//     var yScale = d3.scaleLinear()
//         .domain([lossVal.min, lossVal.max])
//         .range([height-margin.bottom, margin.top]);

//     var line = d3.line()
//         .x(function(d) { return xScale(d.year); })
//         .y(function(d) { return yScale(d.lossVal); })
//         .curve(d3.curveLinear); 
    
//     var area = d3.area()
//         .x(function(d) { return xScale(d.year); })
//         .y1(function(d) { return yScale(d.lossVal); })
//         .y0(height-margin.bottom);
    
//     /*making the bars in the barchart:
//     uses filtered data
//     defines height and width of bars
//     */    

//     /*var bar = svg.selectAll("rect")   
//         .data(filtered_data)
//         .enter()
//         .append("rect")
//             .attr("x", function(d) {return xScale(d.year); } )
//             .attr("y", function(d) {return yScale(d.lifeExp); } ) 
//             .attr("width", xScale.bandwidth())
//             .attr("height", function(d) {return height - margin.bottom - yScale(d.lifeExp); })
//             .attr("fill", "pink");*/

//     var xAxis = svg.append("g")
//         .attr("class","axis")
//         .attr("transform", `translate(0,${height-margin.bottom})`)
//         .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

//     var yAxis = svg.append("g")
//         .attr("class","axis")
//         .attr("transform", `translate(${margin.left},0)`)
//         .call(d3.axisLeft().scale(yScale));


//     var path = svg.append("path")
//         .datum(filtered_data)
//         .attr("d", function(d) { return line(d); })
//         .attr("stroke","steelblue")
//         .attr("fill","none")
//         .attr("stroke-width",2); 
    
//     // var path = svg.append("path")
//     //     .datum(filtered_data)
//     //     .attr("d", lossVal)
//     //     .attr("fill","orange");
    
    
//     var xAxisLabel = svg.append("text")
//         .attr("class","axisLabel")
//         .attr("x", width/2)
//         .attr("y", height-margin.bottom/2)
//         .text("Year");

//     var yAxisLabel = svg.append("text")
//         .attr("class","axisLabel")
//         .attr("transform","rotate(-90)")
//         .attr("x",-height/2)
//         .attr("y",margin.left/2)
//         .text("Loss Percentage");

// });

