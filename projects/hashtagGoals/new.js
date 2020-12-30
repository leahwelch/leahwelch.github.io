window.createGraphic = function(graphicSelector) {
    var dataLoc = "data/sdg_totals2.csv";

    var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

    var width = document.querySelector('.graphic__vis').clientWidth;
    var height = document.querySelector('.graphic__vis').clientHeight;
    var margin = {top: 250, left: 100, right: 260, bottom: 50};

    var svg = graphicVisEl.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var xScale = d3.scaleBand()

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${width-margin.right-30},0)`)

    var xAxis =  svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${margin.top - 30})`)

    var annotation = svg.append("g")
        .attr("class", "annotation")
        .style("opacity", 1)

    
    var legendWidth = document.querySelector("#legendContainer").clientWidth;
    var legendHeight = document.querySelector("#legendContainer").clientHeight;
    var legendMargin = {top: 40, left: 60, right: 60, bottom: 10};
    var legend = d3.select("#legendContainer").append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    legend.append("circle")
        .attr("cx", legendMargin.left)
        .attr("cy", legendMargin.top + 22)
        .attr("r", 8)
        .attr("fill", "#1f1f89")
        .attr("opacity", 0.3)

    legend.append("circle")
        .attr("cx", legendWidth - legendMargin.right - legendMargin.left)
        .attr("cy", legendMargin.top)
        .attr("r", 30)
        .attr("fill", "#1f1f89")
        .attr("opacity", 0.3)

    legend.append("text")
        .attr("x", legendMargin.left)
        .attr("y", legendMargin.top + 55)
        .attr("class", "legendText")
        .attr("fill", "#1F1F89")
        .style("text-anchor", "middle")
        .text("1 item")

    legend.append("text")
        .attr("x", legendWidth - legendMargin.right - legendMargin.left)
        .attr("y", legendMargin.top + 55)
        .attr("class", "legendText")
        .attr("fill", "#1F1F89")
        .style("text-anchor", "middle")
        .text("5 items")


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
        function showTshirt() {
            d3.csv(dataLoc).then(function(data) {
                var t = d3.transition()
                    .duration(800)
                    .ease(d3.easeQuadInOut)

                var tshirt_data = data.filter(function(d) {
                    return d.t_shirt == 1;
                });

                var uniqueArray = removeDuplicates(data, "goalNames");  
                uniqueArray.pop(); 

                xScale.domain(tshirt_data.map(function(d) { return d.industry}))
                    .range([margin.left, width-margin.right])
                    .padding(1);

                var yScale = d3.scaleLinear()
                    .domain([17, 1])
                    .range([height-margin.bottom, margin.top]);

                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 50)
                    .ticks(17);

                var xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);
                
                xAxis.transition(t).call(xAxisGenerator);
            
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start");

                yAxis.transition(t).call(yAxisGenerator);
            
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(15,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 1);

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .style("opacity", 0);
                sdgLabels.merge(labelEnter)
                    .transition(t)
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("font-size", "10pt")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition(t)
                    .style("opacity", 0)
                    .remove();
                    
                var points = svg.selectAll(".point").data(tshirt_data)
                var enter = points.enter().append("circle")
                    .attr("class", "point")
                    .call(zeroState)
                    .attr("cx", function(d) { return xScale(d.industry); })
                    .attr("cy", function(d) { return yScale(d.goal); });
                points.merge(enter)
                    .transition(t)
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
                    .transition(t)
                    .call(zeroState)
                    .remove();

                svg.selectAll(".annotation").append("rect")
                    .attr("x", function() {
                        return +xScale("Transportation & Logistics") + 20
                    })
                    .attr("y", function() {
                        return + yScale("1") - 20
                    })
                    .attr("width", 300)
                    .attr("height", 70)
                    .attr("fill", "#FFF8F6")
                    .style("opacity", 1.0)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Social & Labor")
                    })
                    .attr("y1", function() {
                        return + yScale("1")
                    })
                    .attr("x2", function() {
                        return +xScale("Transportation & Logistics") + 20
                    })
                    .attr("y2", function() {
                        return + yScale("1")
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Transportation & Logistics") + 40
                    })
                    .attr("y", function() {
                        return + yScale("1") + 8
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("Only 1.8% of the cost of a white t-shirt")

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Transportation & Logistics") + 40
                    })
                    .attr("y", function() {
                        return + yScale("1") + 28
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("is represented by workers’ earnings.")
                    
            });
        },
        function showAll() {
            d3.csv(dataLoc).then(function(data) {
                var t = d3.transition()
                    .duration(800)
                    .ease(d3.easeQuadInOut)

                annotation.selectAll("rect").style("opacity", 0)
                annotation.selectAll("line").style("opacity", 0)
                annotation.selectAll("text").style("opacity", 0)

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
                    .attr("class", "point")
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition(t)
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
                    .style("opacity", 0.3);

                //exit method for new data points, remove the points that are no longer in the set//
                newPoints.exit()
                    .transition(t)
                    .call(zeroState)
                    .remove();

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .style("opacity", 0)
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)});
                sdgLabels.merge(labelEnter)
                    .transition(t)
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})  
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("font-size", "10pt")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition(t)
                    .style("opacity", 0)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 50)
                    .ticks(17);

                //transition the axes//
                xAxis.transition(t).call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 1);

                yAxis.transition(t).call(yAxisGenerator);
            
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(15,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 1);

                svg.selectAll(".colorLabels").transition(t).style("opacity",0)
            });
        },
        function showAllHighlighted() {
            d3.csv(dataLoc).then(function(data) {
                var t = d3.transition()
                    .duration(800)
                    .ease(d3.easeQuadInOut)

                var totals = {
                    min: d3.min(data, function(d) { return +d.totals; }),
                    max: d3.max(data, function(d) { return +d.totals; }),
                };

                var uniqueArray = removeDuplicates(data, "goalNames");  
                uniqueArray.pop();

                annotation.raise();

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
                    .attr("class", "point")
                    .attr("fill", function(d) { 
                        if(d.industry === "Marketing") {
                            return "#ffffff";
                        } else  {
                            return "#1F1F89";   
                        }
                    }).style("opacity", 0)
                    //merge and transition of datapoints//
                newPoints.merge(enter)
                    .transition(t)
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
                    .style("opacity", function(d) {
                        if(d.industry === "Social & Labor" && d.goal == 6) {
                            return 1;
                        } else if (d.industry === "Waste & Circular Living" && d.goal == 13) {
                            return 1;
                        } else {
                            return 0.3;
                        }
                    });

                //exit method for new data points, remove the points that are no longer in the set//
                newPoints.exit()
                    .transition(t)
                    .call(zeroState)
                    .remove();

                var sdgLabels = svg.selectAll(".mylabels").data(uniqueArray) 
                var labelEnter = sdgLabels.enter().append("text")
                    .attr("class", "mylabels")
                    .style("opacity", 0)
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})    
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito");
                sdgLabels.merge(labelEnter)
                    .transition(t)
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal) + 5})  
                    .text(function(d){ return(d.goalNames)})
                    .attr("fill","#1F1F89")
                    .style("font-family", "Nunito")
                    .style("font-size", "10pt")
                    .style("opacity", 1);
                sdgLabels.exit()
                    .transition(t)
                    .style("opacity", 0)
                    .remove();

                let xAxisGenerator = d3.axisTop(xScale)
                    .tickSize(-height+margin.bottom+margin.top - 30);

                var yAxisGenerator = d3.axisRight(yScale)
                    .tickSize(-width+margin.left+margin.right + 50)
                    .ticks(17);

                //transition the axes//
                xAxis.transition(t).call(xAxisGenerator);
                xAxis.selectAll(".tick text")
                    .attr("class", "topLabels")
                    .attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
                    .style("text-anchor", "start")
                    .style("opacity", 1);

                yAxis.transition(t).call(yAxisGenerator);
            
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(15,0)")})
                    .style("text-anchor", "middle")
                    .style("opacity", 1);

                svg.selectAll(".colorLabels").transition(t).style("opacity",0)

                svg.selectAll(".annotation").append("rect")
                    .attr("x", function() {
                        return +xScale("Social & Labor") + 30
                    })
                    .attr("y", function() {
                        return + yScale("4") - 20
                    })
                    .attr("width", 180)
                    .attr("height", 70)
                    .attr("fill", "#FFF8F6")
                    .style("opacity", 1.0)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .raise()

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Social & Labor")
                    })
                    .attr("y1", function() {
                        return + yScale("6")
                    })
                    .attr("x2", function() {
                        return +xScale("Retail & eCommerce")
                    })
                    .attr("y2", function() {
                        return + yScale("6")
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Retail & eCommerce")
                    })
                    .attr("y1", function() {
                        return + yScale("6")
                    })
                    .attr("x2", function() {
                        return +xScale("Retail & eCommerce")
                    })
                    .attr("y2", function() {
                        return + yScale("6") - 15
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Social & Labor") + 37
                    })
                    .attr("y", function() {
                        return + yScale("4") 
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("Levi's has a labor code")
                
                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Social & Labor") + 37
                    })
                    .attr("y", function() {
                        return + yScale("4") + 20
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("of conduct that impacts")

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Social & Labor") + 37
                    })
                    .attr("y", function() {
                        return + yScale("4") + 40
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("clean water and sanitation")

                svg.selectAll(".annotation").append("rect")
                    .attr("x", function() {
                        return +xScale("Stakeholder Well-Being") + 30
                    })
                    .attr("y", function() {
                        return + yScale("13") - 10
                    })
                    .attr("width", 180)
                    .attr("height", 70)
                    .attr("fill", "#FFF8F6")
                    .style("opacity", 1.0)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Waste & Circular Living") + 50
                    })
                    .attr("y1", function() {
                        return + yScale("13")
                    })
                    .attr("x2", function() {
                        return +xScale("Waste & Circular Living")
                    })
                    .attr("y2", function() {
                        return + yScale("13")
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Waste & Circular Living") + 50
                    })
                    .attr("y1", function() {
                        return + yScale("13")
                    })
                    .attr("x2", function() {
                        return +xScale("Waste & Circular Living") + 50
                    })
                    .attr("y2", function() {
                        return + yScale("14")
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("line")
                    .attr("x1", function() {
                        return xScale("Stakeholder Well-Being") + 30
                    })
                    .attr("y1", function() {
                        return + yScale("14")
                    })
                    .attr("x2", function() {
                        return +xScale("Waste & Circular Living") + 50
                    })
                    .attr("y2", function() {
                        return + yScale("14")
                    })
                    .attr('stroke', "#443730")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", 4)
                    .style("opacity", 1);

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Stakeholder Well-Being") + 40
                    })
                    .attr("y", function() {
                        return + yScale("13") + 8
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("5 key items are")
                
                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Stakeholder Well-Being") + 40
                    })
                    .attr("y", function() {
                        return + yScale("13") + 28
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("produced with attention")

                svg.selectAll(".annotation").append("text")
                    .attr("x", function() {
                        return +xScale("Stakeholder Well-Being") + 40
                    })
                    .attr("y", function() {
                        return + yScale("13") + 48
                    })
                    .attr("fill","#443730")
                    .style("font-family", "Nunito")
                    .style("font-size", 14)
                    .style("opacity", 1)
                    .text("paid to waste generation")

            });
        },
        function reorganize() {
            d3.csv(dataLoc).then(function(data) {
                svg.selectAll(".newTopLabels").transition().duration(500).style("opacity",0)
                svg.selectAll(".topLine").transition().duration(500).style("opacity",0)

                annotation.selectAll("rect").style("opacity", 0)
                annotation.selectAll("line").style("opacity", 0)
                annotation.selectAll("text").style("opacity", 0)
                
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
                    .tickSize(-width+margin.left+margin.right + 50)
                    .ticks(17);
                yAxis.transition()
                    .duration(1000)
                    .delay(250)
                    .call(yAxisGenerator);
                yAxis.selectAll(".tick text")
                    .attr("class", "sideLabels")
                    .attr("transform", function(d){ return( "translate(15,0)")})
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
                    .attr("x", width-margin.right-13)
                    .attr("y", function(d){return yScale(d.goal)})
                    .text(function(d){ return(d.goal)});
                colorLabels.merge(colorEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right-13)
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
                    .attr("x", width-margin.right + 5)
                    .attr("y", function(d){return yScale(d.goal)})    
                    .text(function(d){ return(d.goalNames)})
                    //.attr("fill","#1F1F89")
                    .style("font-family", "Nunito");
                sdgLabels.merge(labelEnter)
                    .transition()
                    .duration(500)
                    .attr("x", width-margin.right + 5)
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
                    .style("font-size", "10pt")
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

                

            });
        },
        function topIndustries() {
            d3.csv(dataLoc).then(function(data) {

                

                svg.selectAll(".bottomLine").transition().duration(500).style("opacity",0)
                
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
                            return 18;
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

                
                var topLine = svg.selectAll(".topline").data(uniqueIndustry)
                var topLineEnter = topLine.enter().append("line")
                    .attr("class", "topLine")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", 0);

                topLine.merge(topLineEnter)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .attr("class", "topLine")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", function(d) {
                        if(d.industry === "Manufacturing" || d.industry === "Waste & Circular Living" || d.industry === "Social & Labor") {
                            return 0.9;
                        } else {
                            return 0;
                        }
                    })
                topLine.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();

            });
        },
        function bottomIndustries() {
            d3.csv(dataLoc).then(function(data) {
                svg.selectAll(".topLine").transition().duration(500).style("opacity",0)
                svg.selectAll(".highlightline").transition().duration(500).style("opacity",0)
                svg.selectAll(".table").transition().duration(500).style("opacity",0)

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

                svg.selectAll(".newTopLabels").style("opacity", 0)
                
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
                            return 18;
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
                var bottomLine = svg.selectAll(".bottomline").data(uniqueIndustry)
                var bottomLineEnter = bottomLine.enter().append("line")
                    .attr("class", "bottomLine")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", 0);

                bottomLine.merge(bottomLineEnter)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .attr("class", "bottomLine")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", function(d) {
                        if(d.industry === "Transportation & Logistics" || d.industry === "Retail & eCommerce" || d.industry === "Marketing") {
                            return 0.9;
                        } else {
                            return 0;
                        }
                    })
                bottomLine.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();
                    
                svg.selectAll(".highlightLabels").style("opacity", 0); 
                   
                
            });
        },
        function highlights() {
            d3.csv(dataLoc).then(function(data) {
                svg.selectAll(".bottomLine").style("opacity", 0)
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
                            return 18;
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

                var highlightLine = svg.selectAll(".highlightline").data(uniqueIndustry)
                var highlightLineEnter = highlightLine.enter().append("line")
                    .attr("class", "highlightline")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", 0);

                highlightLine.merge(highlightLineEnter)
                    .transition()
                    .delay(500)
                    .duration(1000)
                    .attr("class", "highlightline")
                    .attr("x1", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y1", margin.top-30)
                    .attr("x2", function(d) {
                        return xScale(d.industry);
                    })
                    .attr("y2", height-margin.bottom+20)
                    .attr("stroke", "#443730")
                    .attr("stroke-width", 2)
                    .style("opacity", function(d) {
                        if(d.industry === "Consumer Engagement" || d.industry === "Transparency & Governance") {
                            return 0.9;
                        } else {
                            return 0;
                        }
                    })
                highlightLine.exit()
                    .transition()
                    .duration(500)
                    .style("opacity", 0)
                    .remove();
            });
        }
    ]

    // update our chart
	function update(step) {
        steps[step].call()
    }
    
    function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
    }
    
    function init() {
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}
