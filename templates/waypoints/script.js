window.createGraphic = function(graphicSelector) {
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
    var graphicProseEl = graphicEl.select('.graphic__prose')
    // var width = document.querySelector(".graphic__vis").clientWidth;
    // var height = document.querySelector(".graphic__vis").clientHeight;

	// var margin = 50
    // var size = 800
    var margin = {top: 300, left: 50, right: 350, bottom: 100};
	var size = {w: document.querySelector(".graphic__vis").clientWidth, h: document.querySelector(".graphic__vis").clientHeight}
    //var chartSize = size - margin * 2
    var chartWidth = size.w - margin.left - margin.right
    var chartHeight = size.h - margin.top - margin.bottom
    var scaleX = null
    var scaleY = null
	var scaleR = null
	var xAxisGenerator = null
	var xAxis = null
    var data = [8, 6, 7, 5, 3, 0, 9]
    var sdgTotals = [{"industry": "Design & Innovation","goal": 1,"goalNames": "No Poverty","totals": 1,"t_shirt": null},
	{"industry": "Manufacturing","goal": 1,"goalNames": "No Poverty","totals": 3,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 1,"goalNames": "No Poverty","totals": 3,"t_shirt": 1},
	{"industry": "Retail & eCommerce","goal": 1,"goalNames": "No Poverty","totals": 1,"t_shirt": null},
	{"industry": "Consumer Engagement","goal": 1,"goalNames": "No Poverty","totals": 1,"t_shirt": null},
	{"industry": "Finance","goal": 1,"goalNames": "No Poverty","totals": 3,"t_shirt": null},
	{"industry": "Technology","goal": 1,"goalNames": "No Poverty","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 2,"goalNames": "Zero Hunger","totals": 2,"t_shirt": null},
	{"industry": "Agriculture & Raw Materials","goal": 2,"goalNames": "Zero Hunger","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 2,"goalNames": "Zero Hunger","totals": 1,"t_shirt": null},
	{"industry": "Manufacturing","goal": 2,"goalNames": "Zero Hunger","totals": 3,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 2,"goalNames": "Zero Hunger","totals": 3,"t_shirt": 1},
	{"industry": "Retail & eCommerce","goal": 2,"goalNames": "Zero Hunger","totals": 1,"t_shirt": null},
	{"industry": "Consumer Engagement","goal": 2,"goalNames": "Zero Hunger","totals": 2,"t_shirt": null},
	{"industry": "Finance","goal": 2,"goalNames": "Zero Hunger","totals": 2,"t_shirt": null},
	{"industry": "Technology","goal": 2,"goalNames": "Zero Hunger","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 3,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 3,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 1,"t_shirt": null},
	{"industry": "Manufacturing","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 2,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 3,"t_shirt": 1},
	{"industry": "Packaging","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 1,"t_shirt": null},
	{"industry": "Waste & Circular Living","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 3,"t_shirt": null},
	{"industry": "Consumer Engagement","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 1,"t_shirt": null},
	{"industry": "Finance","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 3,"goalNames": "Good Heath & Well-Being","totals": 2,"t_shirt": null},
	{"industry": "Social & Labor","goal": 4,"goalNames": "Quality Education","totals": 2,"t_shirt": 1},
	{"industry": "Transparency & Governance","goal": 4,"goalNames": "Quality Education","totals": 1,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 5,"goalNames": "Gender Equality","totals": 3,"t_shirt": 1},
	{"industry": "Transparency & Governance","goal": 5,"goalNames": "Gender Equality","totals": 1,"t_shirt": null},
	{"industry": "Finance","goal": 5,"goalNames": "Gender Equality","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 3,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 3,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 2,"t_shirt": null},
	{"industry": "Manufacturing","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 2,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 1,"t_shirt": null},
	{"industry": "Transportation & Logistics","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 1,"t_shirt": 1},
	{"industry": "Packaging","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 1,"t_shirt": null},
	{"industry": "Waste & Circular Living","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 4,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 6,"goalNames": "Clean Water & Sanitation","totals": 2,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 2,"t_shirt": 1},
	{"industry": "Transportation & Logistics","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": null},
	{"industry": "Finance","goal": 7,"goalNames": "Affordable & Clean Energy","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 2,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 3,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 3,"t_shirt": null},
	{"industry": "Transportation & Logistics","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": 1},
	{"industry": "Retail & eCommerce","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": null},
	{"industry": "Waste & Circular Living","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": null},
	{"industry": "Consumer Engagement","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 2,"t_shirt": null},
	{"industry": "Transparency & Governance","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 2,"t_shirt": 1},
	{"industry": "Finance","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 3,"t_shirt": null},
	{"industry": "Technology","goal": 8,"goalNames": "Decent Work & Economic Growth","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 1,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 3,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 5,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 2,"t_shirt": null},
	{"industry": "Transportation & Logistics","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 1,"t_shirt": 1},
	{"industry": "Packaging","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 3,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 5,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 1,"t_shirt": null},
	{"industry": "Transparency & Governance","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 2,"t_shirt": 1},
	{"industry": "Finance","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 3,"t_shirt": null},
	{"industry": "Technology","goal": 9,"goalNames": "Industry, Innovation & Infrastructure","totals": 4,"t_shirt": null},
	{"industry": "Manufacturing","goal": 10,"goalNames": "Reduced Inequalities","totals": 2,"t_shirt": null},
	{"industry": "Social & Labor","goal": 10,"goalNames": "Reduced Inequalities","totals": 3,"t_shirt": 1},
	{"industry": "Retail & eCommerce","goal": 10,"goalNames": "Reduced Inequalities","totals": 1,"t_shirt": null},
	{"industry": "Consumer Engagement","goal": 10,"goalNames": "Reduced Inequalities","totals": 1,"t_shirt": null},
	{"industry": "Transparency & Governance","goal": 10,"goalNames": "Reduced Inequalities","totals": 2,"t_shirt": 1},
	{"industry": "Finance","goal": 10,"goalNames": "Reduced Inequalities","totals": 1,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 3,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 3,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 3,"t_shirt": null},
	{"industry": "Manufacturing","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 2,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 2,"t_shirt": 1},
	{"industry": "Packaging","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 2,"t_shirt": null},
	{"industry": "Waste & Circular Living","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 5,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 2,"t_shirt": null},
	{"industry": "Finance","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 11,"goalNames": "Sustainable Cities & Communities","totals": 4,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 3,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 3,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 4,"t_shirt": 1},
	{"industry": "Transportation & Logistics","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 1,"t_shirt": 1},
	{"industry": "Packaging","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 3,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 4,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 2,"t_shirt": null},
	{"industry": "Finance","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 2,"t_shirt": null},
	{"industry": "Technology","goal": 12,"goalNames": "Responsible Consumption & Production","totals": 4,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 13,"goalNames": "Climate Action","totals": 1,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 13,"goalNames": "Climate Action","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 13,"goalNames": "Climate Action","totals": 3,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 13,"goalNames": "Climate Action","totals": 4,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 13,"goalNames": "Climate Action","totals": 1,"t_shirt": 1},
	{"industry": "Packaging","goal": 13,"goalNames": "Climate Action","totals": 3,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 13,"goalNames": "Climate Action","totals": 5,"t_shirt": 1},
	{"industry": "Stakeholder Well-Being","goal": 13,"goalNames": "Climate Action","totals": 2,"t_shirt": null},
	{"industry": "Finance","goal": 13,"goalNames": "Climate Action","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 13,"goalNames": "Climate Action","totals": 2,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 14,"goalNames": "Life Below Water","totals": 3,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 14,"goalNames": "Life Below Water","totals": 4,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 14,"goalNames": "Life Below Water","totals": 2,"t_shirt": 1},
	{"industry": "Manufacturing","goal": 14,"goalNames": "Life Below Water","totals": 1,"t_shirt": null},
	{"industry": "Packaging","goal": 14,"goalNames": "Life Below Water","totals": 1,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 14,"goalNames": "Life Below Water","totals": 1,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 14,"goalNames": "Life Below Water","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 14,"goalNames": "Life Below Water","totals": 2,"t_shirt": null},
	{"industry": "Chemical & Treatment","goal": 15,"goalNames": "Life On Land","totals": 2,"t_shirt": 1},
	{"industry": "Agriculture & Raw Materials","goal": 15,"goalNames": "Life On Land","totals": 1,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 15,"goalNames": "Life On Land","totals": 1,"t_shirt": null},
	{"industry": "Manufacturing","goal": 15,"goalNames": "Life On Land","totals": 3,"t_shirt": 1},
	{"industry": "Packaging","goal": 15,"goalNames": "Life On Land","totals": 3,"t_shirt": 1},
	{"industry": "Waste & Circular Living","goal": 15,"goalNames": "Life On Land","totals": 4,"t_shirt": 1},
	{"industry": "Consumer Engagement","goal": 15,"goalNames": "Life On Land","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 15,"goalNames": "Life On Land","totals": 1,"t_shirt": null},
	{"industry": "Technology","goal": 15,"goalNames": "Life On Land","totals": 2,"t_shirt": null},
	{"industry": "Social & Labor","goal": 16,"goalNames": "Peace, Justice & Strong Institutions","totals": 3,"t_shirt": 1},
	{"industry": "Transportation & Logistics","goal": 16,"goalNames": "Peace, Justice & Strong Institutions","totals": 1,"t_shirt": 1},
	{"industry": "Stakeholder Well-Being","goal": 16,"goalNames": "Peace, Justice & Strong Institutions","totals": 1,"t_shirt": null},
	{"industry": "Transparency & Governance","goal": 16,"goalNames": "Peace, Justice & Strong Institutions","totals": 2,"t_shirt": 1},
	{"industry": "Design & Innovation","goal": 17,"goalNames": "Partnerships For The Goals","totals": 1,"t_shirt": 1},
	{"industry": "Social & Labor","goal": 17,"goalNames": "Partnerships For The Goals","totals": 1,"t_shirt": null},
	{"industry": "Stakeholder Well-Being","goal": 17,"goalNames": "Partnerships For The Goals","totals": 1,"t_shirt": null},
	{"industry": "Transparency & Governance","goal": 17,"goalNames": "Partnerships For The Goals","totals": 1,"t_shirt": 1},
	{"industry": "Marketing","goal": null,"goalNames": "","totals": null,"t_shirt": null}
	   ]
	   
	var tshirt_data = sdgTotals.filter(function(d) {
		return d.t_shirt == 1;
	  });
	  console.log(tshirt_data);

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

	var sdg = {
		min: d3.min(sdgTotals, function(d) { return +d.goal; }),
		max: d3.max(sdgTotals, function(d) { return +d.goal; })
	  };
	
	  var totals = {
		minAll: d3.min(sdgTotals, function(d) { return +d.totals; }),
		maxAll: d3.max(sdgTotals, function(d) { return +d.totals; }),
		minT: 1,
		maxT: 1
	  };

   // actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
			// circles are centered and small
			var t = d3.transition()
				.duration(500)
				.ease(d3.easeQuadInOut)
			    

			var item = graphicVisEl.selectAll('.item')
			
			item.transition(t)
				.attr('transform', translate(chartWidth / 2, chartHeight / 2))

            var c = item.selectAll("circle")
                .data(tshirt_data, function(d) { return d.value; });
            
            c.enter().append("circle")
			.attr("cx", function(d) { return scaleX(d.industry); })
				.attr("cy", function(d) { return scaleY(d.goal); })
				.attr("r", 8)
				.attr("class", "point")
				.attr("fill", function(d) {
					if(d.industry === "Marketing") {
						return "#ffffff";
					} else  {
						return "#1F1F89";   
					}
				})
			.merge(c)
				.attr("cx", function(d) { return scaleX(d.industry); })
				.attr("cy", function(d) { return scaleY(d.goal); })
				.attr("r", 8)
				.attr("class", "point")
				.attr("fill", function(d) {
					if(d.industry === "Marketing") {
						return "#ffffff";
					} else  {
						return "#1F1F89";   
					}
				})
              
				c.exit()
					.transition(t)
					//.duration(500)
					//.delay(500)
					.attr("r", 0)
					.remove(); 

			// item.select('text')
			// 	.transition(t)
			// 	.style('opacity', 0)
		},

		function step1() {
			var t = d3.transition()
				.duration(500)
				.ease(d3.easeQuadInOut)

			 
			
			// circles are positioned
			var item = graphicVisEl.selectAll('.item')
			var scaleR = d3.scaleLinear()
				.domain([totals.minAll, totals.maxAll])
				.range([3,30]);
			
			item.transition(t)
			// 	.attr('transform', function(d, i) {
			// 		return translate(scaleX(i), chartSize / 2)
            //     })
            
            var c = item.selectAll("circle")
				.data(sdgTotals);
				
			scaleX.domain(sdgTotals.map(function(d) { return d.industry}));

            c.enter().append("circle")
			.attr("cx", function(d) { return scaleX(d.industry); })
				.attr("cy", function(d) { return scaleY(d.goal); })
				.attr("r", 0)
				.attr("class", "point")
				.attr("fill", function(d) { 
					if(d.industry === "Marketing") {
						return "#ffffff";
					} else  {
						return "rgb(31,31,137,80)";   
					}
				}).style("opacity", 0.3)
            .merge(c)
				.attr("cx", function(d) { return scaleX(d.industry); })
				.attr("cy", function(d) { return scaleY(d.goal); })
				.attr("r", function(d) { return scaleR(d.totals); })
				.attr("fill", function(d) { 
					if(d.industry === "Marketing") {
						return "#ffffff";
					} else  {
						return "rgb(31,31,137,80)";   
					}
				}).style("opacity", 0.3);
          
				c.exit(t)
					.transition()
					//.duration(500)
					//.delay(500)
					.attr("r", 0)
					.remove(); 
				  
				xAxis.transition(t)
					// .duration(1000)
					// .delay(250)
					.call(xAxisGenerator);
				xAxis.selectAll(".tick text")
					.attr("class", "topLabels")
					.attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
					.style("text-anchor", "start");

		},

		function step2() {

		},
	]

	// update our chart
	function update(step) {
        steps[step].call()
        console.log("chart is updating");
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}

	function setupCharts() {
		var svg = graphicVisEl.append('svg')
			.attr('width', size.w + 'px')
			.attr('height', size.h + 'px')
		
		var chart = svg.append('g')
			.classed('chart', true)
            //.attr('transform', translate(chartSize / 2, chartSize / 2))
            .attr('transform', 'translate(' + -chartWidth / 2 + ',' + -chartHeight/ 2 + ')')

		//scaleR = d3.scaleLinear()
		// scaleX = d3.scaleBand()

		// var domainX = d3.range(data.length)

		scaleX = d3.scaleBand()
			.domain(tshirt_data.map(function(d) { return d.industry}))
			.range([margin.left, size.w-margin.right])
			.padding(1);
            
        scaleY = d3.scaleLinear()
			.domain([17, 1])
			.range([size.h-margin.bottom, margin.top])

		// scaleR
		// 	.domain(extent)
		// 	.range([minR, maxR])

		xAxisGenerator = d3.axisTop(scaleX)
			.tickSize(-size.h+margin.bottom+margin.top - 30);
		
		var yAxisGenerator = d3.axisRight(scaleY)
			.tickSize(-size.w+margin.left+margin.right + 100)
			.ticks(17);

		var item = chart.selectAll('.item')
			.data(tshirt_data)
			.enter().append('g')
				.classed('item', true)
                .attr('transform', translate(chartWidth / 2, chartHeight / 2))
                
        xAxis = item.append("g")
            .attr("class","axis")
            .attr("transform",`translate(0, ${margin.top})`)
			.call(xAxisGenerator);
			
		xAxis.selectAll(".tick text")
			.attr("class", "topLabels")
			.attr("transform", function(d){ return( "translate(0,-20)rotate(-45)")})
			.style("text-anchor", "start");

        var yAxis = item.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${size.w-margin.right-40},0)`)
            .call(yAxisGenerator);

		yAxis.selectAll(".tick text")
			.attr("class", "sideLabels")
			.attr("transform", function(d){ return( "translate(30,0)")})
			.style("text-anchor", "middle");

		let sdgLabels = item.selectAll("mylabels")
			.data(uniqueArray)
			.enter()
			.append("text")
			.attr("x", size.w-margin.right + 20)
			.attr("y", function(d){return yScale(d.goal) + 5})    
			.text(function(d){ return(d.goalNames)})
			.attr("fill","#1F1F89")
			.style("font-family", "Nunito");
		console.log("drawing labels");
		
		// item.enter().append('circle')
		// 	.attr('cx', 0)
        //     .attr('cy', 0)
		// 	.attr("r", 0)
		// 	.style("opacity", 0)

	}

	function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
	}

	function init() {
		setupCharts()
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}


