window.createGraphic = function(graphicSelector) {
    var dataLoc = "data/sdg_totals2.csv";

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

    // var yScale = d3.scaleLinear()
    //     .domain([17, 1])
    //     .range([height-margin.bottom, margin.top]);

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${width-margin.right-40},0)`)

    var xAxis =  svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${margin.top - 30})`)

    // var c = svg.enter().append("circle")
    // 	.attr('cx', 0)
    //     .attr('cy', 0)
    //     .attr("r", 0)
    //     .style("opacity", 0)
    

    

    var settings = {
        margin:margin, width:width, height:height, svg:svg, xScale: xScale, yAxis: yAxis, xAxis: xAxis
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

                var yScale = d3.scaleLinear()
                    .domain([17, 1])
                    .range([height-margin.bottom, margin.top]);

                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 100)
                    .ticks(17);

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);
                
                xAxis.transition()
                    .duration(1000)
                    .delay(250).call(xAxisGenerator);
            
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start");

                yAxis.transition()
                    .duration(1000)
                    .delay(250).call(yAxisGenerator);
            
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(30,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 1);;

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("opacity", 0);
                sdgLabels.merge(labelEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();
                    
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


            });
        },
        function showAll(settings) {
            d3.csv(dataLoc).then(function(data) {
                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var uniqueArray = removeDuplicates(data, "goalNames");  
                uniqueArray.pop();

                xScale.domain(data.map(function(d) { return d.industry}));
                
                var yScale = d3.scaleLinear()
                    .domain([17, 1])
                    .range([height-margin.bottom, margin.top]);
                
                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);


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

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .style("opacity", 0)
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito");
                sdgLabels.merge(labelEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return yScale(d.goal) + 5})
                    //.attr("transform", function(d){ return( "translate(0,-5)")})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 100)
                    .ticks(17);

                //transition the axes//
                xAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 1);

                yAxis.transition()
                    .duration(1000)
                    .delay(250).call(yAxisGenerator);
            
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(30,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 1);

                svg.selectAll(".colorLabels").style("opacity",0)
            });
        },
        function reorganize(settings) {
            d3.csv(dataLoc).then(function(data) {
                var uniqueArray = removeDuplicates(data, "goalNames");  
                uniqueArray.pop();
                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);
                var yScale = d3.scaleBand()
                    .domain([17, 11, 10, 9, 8, 7, 16, 5, 4, 3, 2, 1, 15, 14, 13, 12, 6])
                    .range([height-margin.bottom, margin.top])
                    .paddingOuter(0)
                    .paddingInner(1);
                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 100)
                    .ticks(17);
                yAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(yAxisGenerator);
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(30,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 0);

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);
                xAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 1);

                var colorLabels = svg.selectAll(".colorLabels").data(uniqueArray) 
                var colorEnter = colorLabels.enter().append("text")
                    .attr("class", "colorLabels")
                    .attr("x", width-margin.right-9)
                    .attr("y", function(d){return yScale(d.goal)})
                    .text(function(d){ return(d.goal)});
                colorLabels.merge(colorEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right-9)
                    .attr("y", function(d){return +yScale(d.goal) + 5})
                    .text(function(d){ return(d.goal)}) 
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-family", "Nunito")
                    .style("font-weight", "bold")
                    .style("opacity", 1);
                colorLabels.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .style("opacity", 0)
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return yScale(d.goal)})    
                    .text(function(d){ return(d.goalNames)})
                    //.attr("fill","#1F1F89")
                    .style("font-family", "Nunito");
                sdgLabels.merge(labelEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right + 20)
                    .attr("y", function(d){return +yScale(d.goal) + 5})   
                    .text(function(d){ return(d.goalNames)})
                    //.attr("fill","#1F1F89")
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    .style("font-family", "Nunito")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();

                var newPoints = svg.selectAll(".point")
                    .data(data);
                //drawing circles for that new dataset//
                var enter = newPoints.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    //.call(zeroState)
                    .attr("class", "point")
                    .style("opacity", .3)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("r", function(d) { return rScale(d.totals); })
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    //.style("opacity", .3)
                    .style("opacity", function(d) {
                        if(d.industry === "Marketing") {
                            return 0;
                        } else {
                            return 0.3;
                        }
                    });

                
                //exit method for new data points, remove the points that are no longer in the set//
                newPoints.exit()
                    .transition()
                    .duration(1000)
                    .delay(1000)
                    .call(zeroState)
                    .remove();

                svg.selectAll(".newTopLabels").transition().duration(500).style("opacity",0)


            });
        },
        function topIndustries(settings) {
            d3.csv(dataLoc).then(function(data) {
                
                var uniqueArray = removeDuplicates(data, "goalNames");  
                    uniqueArray.pop();

                var uniqueIndustry = removeDuplicates(data, "industry");

                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var newPoints = svg.selectAll(".point")
                    .data(data);

                
                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);
                var yScale = d3.scaleBand()
                    .domain([17, 11, 10, 9, 8, 7, 16, 5, 4, 3, 2, 1, 15, 14, 13, 12, 6])
                    .range([height-margin.bottom, margin.top])
                    .paddingOuter(0)
                    .paddingInner(1);
                //drawing circles for that new dataset//
                var enter = newPoints.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    //.call(zeroState)
                    .attr("class", "point")
                    .style("opacity", .3)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("r", function(d) { return rScale(d.totals); })
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    .style("opacity", function(d) {
                        if(d.industry === "Manufacturing" || d.industry === "Waste & Circular Living" || d.industry === "Social & Labor") {
                            return 0.8;
                        } else {
                            return 0.1;
                        }
                    });
                newPoints.exit()
                    .transition()
                    .duration(1000)
                    .delay(1000)
                    .call(zeroState)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                xAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 0);

                var topLabels = svg.selectAll(".newTopLabels").data(uniqueIndustry) 
                var topEnter = topLabels.enter().append("text")
                    
                    .attr("class", "newTopLabels")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("transform", function(d){ return( "translate(" + (+xScale(d.industry)) + "," + (margin.top-53) + ")rotate(-45)")})
                    .text(function(d){ return(d.industry)})
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-size", function(d) {
                        if(d.industry === "Manufacturing" || d.industry === "Waste & Circular Living" || d.industry === "Social & Labor") {
                            return 24;
                        } else {
                            return 12;
                        }
                    })
                    .style("opacity",0)
                    
                topLabels.merge(topEnter)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .attr("x", 0)
                    .attr("y", 0)
                    .text(function(d){ return(d.industry)}) 
                    .attr("fill", "#443730")
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-weight", "light")
                    .style("opacity", function(d) {
                        if(d.industry === "Manufacturing" || d.industry === "Waste & Circular Living" || d.industry === "Social & Labor") {
                            return 1;
                        } else {
                            return 0.3;
                        }
                    });
                topLabels.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();

                svg.selectAll(".bottomLabels").transition().duration(500).style("opacity",0)
                
            });
        },
        function bottomIndustries(settings) {
            d3.csv(dataLoc).then(function(data) {
                
                var uniqueArray = removeDuplicates(data, "goalNames");  
                    uniqueArray.pop();

                var uniqueIndustry = removeDuplicates(data, "industry");

                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var newPoints = svg.selectAll(".point")
                    .data(data);

                
                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);
                var yScale = d3.scaleBand()
                    .domain([17, 11, 10, 9, 8, 7, 16, 5, 4, 3, 2, 1, 15, 14, 13, 12, 6])
                    .range([height-margin.bottom, margin.top])
                    .paddingOuter(0)
                    .paddingInner(1);
                //drawing circles for that new dataset//
                var enter = newPoints.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    //.call(zeroState)
                    .attr("class", "point")
                    .style("opacity", .3)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition()
                    .duration(1000)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("r", function(d) { return rScale(d.totals); })
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    .style("opacity", function(d) {
                        if(d.industry === "Transportation & Logistics" || d.industry === "Retail & eCommerce") {
                            return 0.8;
                        } else {
                            return 0.1;
                        }
                    });
                newPoints.exit()
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .call(zeroState)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                xAxis.transition()
                    .duration(1000)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .transition()
                    .duration(1000)
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 0);

                var topLabels = svg.selectAll(".newTopLabels").style("opacity", 0)
                
                var bottomLabels = svg.selectAll(".bottomLabels").data(uniqueIndustry)
                var bottomEnter = bottomLabels.enter().append("text")
                    
                    .attr("class", "bottomLabels")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("transform", function(d){ return( "translate(" + (+xScale(d.industry)) + "," + (margin.top-53) + ")rotate(-45)")})
                    .text(function(d){ return(d.industry)})
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-size", function(d) {
                        if(d.industry === "Transportation & Logistics" || d.industry === "Retail & eCommerce" || d.industry === "Marketing") {
                            return 24;
                        } else {
                            return 12;
                        }
                    })
                    .style("opacity",0)
                    
                bottomLabels.merge(bottomEnter)
                    .transition()
                    .delay(250)
                    .duration(1000)
                    .attr("x", 0)
                    .attr("y", 0)
                    .text(function(d){ return(d.industry)}) 
                    .attr("fill", "#443730")
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-weight", "light")
                    .style("opacity", function(d) {
                        if(d.industry === "Transportation & Logistics" || d.industry === "Retail & eCommerce" || d.industry === "Marketing") {
                            return 1;
                        } else {
                            return 0.3;
                        }
                    });
                // topLabels.exit()
                //     .transition()
                //     .duration(250)
                //     .style("opacity", 0)
                //     .remove();
                    
                svg.selectAll(".highlightLabels").style("opacity", 0);    
                
            });
        },
        function highlights(settings) {
            d3.csv(dataLoc).then(function(data) {
                var uniqueIndustry = removeDuplicates(data, "industry");

                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var newPoints = svg.selectAll(".point")
                    .data(data);

                
                var rScale = d3.scaleLinear()
                    .domain([totals.min, totals.max])
                    .range([3,30]);
                var yScale = d3.scaleBand()
                    .domain([17, 11, 10, 9, 8, 7, 16, 5, 4, 3, 2, 1, 15, 14, 13, 12, 6])
                    .range([height-margin.bottom, margin.top])
                    .paddingOuter(0)
                    .paddingInner(1);
                //drawing circles for that new dataset//
                var enter = newPoints.enter().append("circle")
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    //.call(zeroState)
                    .attr("class", "point")
                    .style("opacity", .3)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition()
                    .duration(1000)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); })
                    .attr("r", function(d) { return rScale(d.totals); })
                    .attr("fill", function(d) {
                        if(d.category == "Planet") {
                            return "#46A76E";
                        }else if(d.category == "People"){
                            return "#ED7F2E";
                        }else if(d.category == "Prosperity"){
                            return "#6337AA";
                        }else {
                            return "#0065AA";
                        }
                    })
                    .style("opacity", function(d) {
                        if(d.industry === "Consumer Engagement" || d.industry === "Transparency & Governance") {
                            return 0.8;
                        } else {
                            return 0.1;
                        }
                    });
                newPoints.exit()
                    .transition()
                    .duration(1000)
                    .delay(250)
                    .call(zeroState)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                xAxis.transition()
                    .duration(1000)
                    .call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .transition()
                    .duration(1000)
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 0);
                
                var highlightLabels = svg.selectAll(".highlightLabels").data(uniqueIndustry)
                var highlightEnter = highlightLabels.enter().append("text")
                    
                    .attr("class", "highlightLabels")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("transform", function(d){ return( "translate(" + (+xScale(d.industry)) + "," + (margin.top-53) + ")rotate(-45)")})
                    .text(function(d){ return(d.industry)})
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-size", function(d) {
                        if(d.industry === "Consumer Engagement" || d.industry === "Transparency & Governance") {
                            return 24;
                        } else {
                            return 12;
                        }
                    })
                    .style("opacity",0)
                    
                highlightLabels.merge(highlightEnter)
                    .transition()
                    .delay(250)
                    .duration(1000)
                    .attr("x", 0)
                    .attr("y", 0)
                    .text(function(d){ return(d.industry)}) 
                    .attr("fill", "#443730")
                    .style("text-anchor", "start")
                    .style("font-family", "Nunito")
                    .style("font-weight", "light")
                    .style("opacity", function(d) {
                        if(d.industry === "Consumer Engagement" || d.industry === "Transparency & Governance") {
                            return 1;
                        } else {
                            return 0.3;
                        }
                    });
                
                    svg.selectAll(".bottomLabels").transition().duration(500).style("opacity",0)
            });
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
        //setupCharts(settings)
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}
