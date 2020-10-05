d3.csv("data/sdgs_totals.csv").then(function(data) {

    console.log(data);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 300, left: 50, right: 350, bottom: 100};
    
    // //Filtering the data for t-shirt only//
    var tshirt_data = data.filter(function(d) {
        return d.t_shirt == 1;
    });
    console.log(tshirt_data);

    // var goalNames = [
    //     "No Poverty",
    //     "Zero Hunger",
    //     "Good Heath & Well-Being",
    //     "Quality Education",
    //     "Gender Equality",
    //     "Clean Water & Sanitation",
    //     "Affordable & Clean Energy",
    //     "Decent Work & Economic Growth",
    //     "Industry, Innovation & Infrastructure",
    //     "Reduced Inequalities",
    //     "Sustainable Cities & Communities",
    //     "Responsible Consumption & Production",
    //     "Climate Action",
    //     "Life Below Water",
    //     "Life On Land",
    //     "Peace, Justice & Strong Institutions",
    //     "Partnerships For The Goals"
    // ];

    function removeDuplicates(originalData, prop) {
        var newData = [];
        var lookupObject = {};

        for(var i in originalData) {
            lookupObject[originalData[i][prop]] = originalData[i];
         }
    
         for(i in lookupObject) {
             newData.push(lookupObject[i]);
         }
          return newData;

    }

    var uniqueArray = removeDuplicates(data, "goalNames");  
    uniqueArray.pop();
    
    var uniqueT = removeDuplicates(tshirt_data, "goalNames");  
    
    console.log(uniqueT);


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        //Adding the min/max sets for each variable//
    var sdg = {
        min: d3.min(data, function(d) { return +d.goal; }),
        max: d3.max(data, function(d) { return +d.goal; })
    };

    var totals = {
        minAll: d3.min(data, function(d) { return +d.totals; }),
        maxAll: d3.max(data, function(d) { return +d.totals; }),
        minT: 1,
        maxT: 1
    };


    console.log(sdg.min);
    // xScale, yScale, and rScale//
    var xScale = d3.scaleBand()
        .domain(tshirt_data.map(function(d) { return d.industry}))
        .range([margin.left, width-margin.right])
        .padding(1);

    var yScale = d3.scaleLinear()
        .domain([17, 1])
        .range([height-margin.bottom, margin.top]);

    // var rScale = d3.scaleLinear()
    //     .domain([totals.minT, totals.maxT])
    //     .range([5,5]);

    // var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    let xAxisGenerator = d3.axisTop(xScale)
        .tickSize(-height+margin.bottom+margin.top - 30);
    
    let xAxis =  svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${margin.top - 30})`)
        .call(xAxisGenerator);

    xAxis.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
        .style("text-anchor", "start");

    let yAxisGenerator = d3.axisRight(yScale)
        .tickSize(-width+margin.left+margin.right + 100)
        .ticks(17);

    let yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${width-margin.right-40},0)`)
        .call(yAxisGenerator);

    yAxis.selectAll(".tick text")
        .attr("class", "sideLabels")
        .attr("transform", function(d){ return( "translate(30,0)")})
        .style("text-anchor", "middle");

    
    let sdgLabels = svg.selectAll("mylabels")
        .data(uniqueArray)
        .enter()
        .append("text")
        .attr("x", width-margin.right + 20)
        .attr("y", function(d){return yScale(d.goal) + 5})    
        .text(function(d){ return(d.goalNames)})
        .attr("fill","#1F1F89")
        .style("font-family", "Nunito");
    
        //Drawing points using the totals//
    var points = svg.selectAll("dot")
        .data(tshirt_data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.industry); })
            .attr("cy", function(d) { return yScale(d.goal); })
            .attr("r", 8)
            .attr("class", "point")
            .attr("fill", function(d) {
                if(d.industry === "Marketing") {
                    return "#ffffff";
                } else  {
                    return "#1F1F89";   
                }
            });

    //   // The data update //
    //   //setting the new scales for all data//
      xScale.domain(data.map(function(d) { return d.industry}));
      var rScale = d3.scaleLinear()
        .domain([totals.minAll, totals.maxAll])
        .range([3,30]);
    
      points.transition().duration(500)
      .attr("r",0);
      

      //grabbing all circles and assigning the filtered data set for 2007//
      var newPoints = svg.selectAll(".point")
        .data(data);
      //drawing circles for that new dataset//
      newPoints.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.industry); })
        .attr("cy", function(d) { return yScale(d.goal); })
        .attr("r", 0)
        .attr("class", "point")
        .attr("fill", function(d) { 
            if(d.industry === "Marketing") {
                return "#ffffff";
            } else  {
                return "#1F1F89";   
            }
        })
        .style("opacity", .3)
        //merge and transition of datapoints//
      .merge(newPoints)
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("cx", function(d) { return xScale(d.industry); })
        .attr("cy", function(d) { return yScale(d.goal); })
        .attr("r", function(d) { return rScale(d.totals); })
        .attr("fill", function(d) { 
            if(d.industry === "Marketing") {
                return "#ffffff";
            } else  {
                return "#1F1F89";   
            }
        })
        .attr("opacity", .3);

      
      //exit method for new data points, remove the points that are no longer in the set//
      newPoints.exit()
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("r", 0)
        .remove();

      //transition the axes//
      xAxis.transition()
        .duration(1000)
        .delay(250)
        .call(xAxisGenerator);
      xAxis.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
        .style("text-anchor", "start");

    //   yAxis.transition()
    //     .duration(1000)
    //     .delay(250)
    //     .call(d3.axisLeft().scale(yScale));

});
