window.createGraphic = function(graphicSelector) {
    var dataLoc = "data/sdgs_totals.csv";

    var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

    var width = document.querySelector('.graphic__vis').clientWidth;
    var height = document.querySelector('.graphic__vis').clientHeight;
    var margin = {top: 300, left: 400, right: 400, bottom: 100};

    var svg = graphicVisEl.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var xScale = d3.scaleBand()

    var yScale = d3.scaleLinear()
        .domain([17, 1])
        .range([height-margin.bottom, margin.top]);

    var yAxisGenerator = d3.axisRight(yScale)
        .tickSize(-width+margin.left+margin.right + 100)
        .ticks(17);

    var xAxis =  svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${margin.top - 30})`)

    var c = svg.enter().append("circle")
    	.attr('cx', 0)
        .attr('cy', 0)
        .attr("r", 0)
        .style("opacity", 0)

    

    var settings = {
        margin:margin, width:width, height:height, svg:svg, xScale: xScale, yScale: yScale, yAxisGenerator: yAxisGenerator
    }

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

    function zeroState(selection) {
        selection
            .attr("r", 0)
            .style("opacity", 0);
        }

    var steps = [
        function showTshirt(settings) {
            d3.csv(dataLoc).then(function(data) {
                var tshirt_data = data.filter(function(d) {
                    return d.t_shirt == 1;
                });
                console.log(tshirt_data);

                var uniqueArray = removeDuplicates(data, "goalNames");  
                uniqueArray.pop();
                var uniqueT = removeDuplicates(tshirt_data, "goalNames");  

                xScale.domain(tshirt_data.map(function(d) { return d.industry}))
                    .range([margin.left, width-margin.right])
                    .padding(1);

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);
                
                xAxis.transition()
                    .duration(1000)
                    .delay(250).call(xAxisGenerator);
            
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start");

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
                
                
                var points = svg.selectAll(".point").data(tshirt_data)
                var enter = points.enter().append("circle")
                    .attr("class", "point")
                    .call(zeroState)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("fill", function(d) {
                        if(d.industry === "Marketing") {
                            return "#ffffff";
                        } else  {
                            return "#1F1F89";   
                        }
                    });
                points.merge(enter)
                    .transition()
                    .duration(500)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("r", 8)
                    .style("opacity", 1)
                    .attr("fill", function(d) {
                        if(d.industry === "Marketing") {
                            return "#ffffff";
                        } else  {
                            return "#1F1F89";   
                        }
                    });

                points.exit()
                    .transition()
                    .duration(500)
                    .call(zeroState)
                    .remove();


                // var points = svg.selectAll("circle")
                //     .data(tshirt_data)
                //     .enter().append("circle")
                //         .attr("cx", function(d) { return xScale(d.industry); })
                //         .attr("cy", function(d) { return yScale(d.goal); })
                //         .attr("r", 0)
                //     .merge(points)
                //         .transition()
                //         .duration(1000)
                //         .delay(1000)
                //         .attr("cx", function(d) { return xScale(d.industry); })
                //         .attr("cy", function(d) { return yScale(d.goal); })
                //         .attr("r", 8)
                //         .attr("fill", function(d) {
                //             if(d.industry === "Marketing") {
                //                 return "#ffffff";
                //             } else  {
                //                 return "#1F1F89";   
                //             }
                //         }).style("opacity", 1)
                //     points.exit()
                //         .transition()
                //         .duration(1000)
                //         .delay(1000)
                //         .attr("r", 0)
                //         .remove();


            });
        },
        function showAll(settings) {
            d3.csv(dataLoc).then(function(data) {
                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                xScale.domain(data.map(function(d) { return d.industry}));
                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);
                
                // points.transition().duration(500)
                // .attr("r",0);
                

                var newPoints = svg.selectAll(".point")
                    .data(data);
                //drawing circles for that new dataset//
                var enter = newPoints.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    //.call(zeroState)
                    .attr("class", "point")
                    .attr("fill", function(d) { 
                        if(d.industry === "Marketing") {
                            return "#ffffff";
                        } else  {
                            return "#1F1F89";   
                        }
                    }).style("opacity", .3)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
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
                    .style("opacity", .3);

                
                //exit method for new data points, remove the points that are no longer in the set//
                newPoints.exit()
                    .transition()
                    .duration(1000)
                    .delay(1000)
                    .call(zeroState)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                //transition the axes//
                xAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start");
            });
        },
        function reorganize(settings) {
            console.log("step2");
        },
        function topIndustries(settings) {
            console.log("step3");
        },
        function bottomIndustries(settings) {
            console.log("step4");
        },
        function highlights(settings) {
            console.log("step5");
        }
    ]
    
    function setupCharts(settings) {
        d3.csv(dataLoc).then(function(data) {

            var tshirt_data = data.filter(function(d) {
                return d.t_shirt == 1;
            });

            xScale.domain(tshirt_data.map(function(d) { return d.industry}))
                    .range([margin.left, width-margin.right])
                    .padding(1);

            


            // var points = svg.selectAll(".point")
            //     .data(tshirt_data)
            //     .enter()
            //     .append("circle")
            //         .attr("cx", function(d) { return xScale(d.industry); })
            //         .attr("cy", function(d) { return yScale(d.goal); })
            //         .attr("r", 8)
            //         .attr("class", "point")
            //         .attr("fill", function(d) {
            //             if(d.industry === "Marketing") {
            //                 return "#ffffff";
            //             } else  {
            //                 return "#1F1F89";   
            //             }
            //         });
        });
    }

    // update our chart
	function update(step) {
        steps[step].call()
        console.log("chart is updating");
    }
    
    function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
    }
    
    function init() {
        setupCharts(settings)
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}
