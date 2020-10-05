/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
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
    var data = [8, 6, 7, 5, 3, 0, 9]
    var fall2018 = [
        {area: "Back Bay", rent: 2800, income: 97.8, population: 21.88, charles: true},
        {area: "Charlestown", rent: 2500, income: 94.6, population: 16.44, charles: false},
        {area: "Chinatown", rent: 2910, income: 121.0, population: 6.87, charles: false},
        {area: "Downtown", rent: 3070, income: 168.6, population: 1.98, charles: true},
        {area: "Fenway", rent: 2350, income: 37.9, population: 21.77, charles: true},
        {area: "Mission Hill", rent: 1900, income: 37.3, population: 13.93, charles: false},
        {area: "North End", rent: 2300, income: 98.5, population: 10.61, charles: false},
        {area: "Allston", rent: 2150, income: 52.1, population: 28.82, charles: true},
        {area: "Brighton", rent: 1800, income: 65.7, population: 45.98, charles: true},
        {area: "Dorchester", rent: 1800, income: 62.2, population: 60.79, charles: false},
        {area: "Jamaica Plain", rent: 1900, income: 84.0, population: 41.26, charles: false},
        {area: "Roxbury", rent: 1610, income: 32.3, population: 52.53, charles: false},
        {area: "South Boston", rent: 2900, income: 89.1, population: 33.69, charles: false},
        {area: "West Roxbury", rent: 1810, income: 90.5, population: 30.44, charles: true}
    ];
    var spring2019 = [
        {area: "Back Bay", rent: 2920, income: 97.8, population: 21.88, charles: true},
        {area: "Charlestown", rent: 2585, income: 94.6, population: 16.44, charles: false},
        {area: "Chinatown", rent: 3210, income: 121.0, population: 6.87, charles: false},
        {area: "Downtown", rent: 3325, income: 168.6, population: 1.98, charles: true},
        {area: "Fenway", rent: 2400, income: 37.9, population: 21.77, charles: true},
        {area: "North End", rent: 2350, income: 98.5, population: 10.61, charles: false},
        {area: "Allston", rent: 1900, income: 52.1, population: 28.82, charles: true},
        {area: "Brighton", rent: 1950, income: 65.7, population: 45.98, charles: true},
        {area: "Dorchester", rent: 1700, income: 62.2, population: 60.79, charles: false},
        {area: "Jamaica Plain", rent: 1950, income: 84.0, population: 41.26, charles: false},
        {area: "South Boston", rent: 2840, income: 89.1, population: 33.69, charles: false},
        {area: "West Roxbury", rent: 1810, income: 90.5, population: 30.44, charles: true},
        {area: "South End", rent: 2700, income: 69.9, charles: false},
        {area: "Roslindale", rent: 1600, income: 77.9, charles: false},
        {area: "East Boston", rent: 1900, income: 54.9, charles: false}
    ];
	// var extent = d3.extent(data)
	// var minR = 10
	// var maxR = 24
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
			// circles are centered and small
			var t = d3.transition()
				.duration(500)
				.ease(d3.easeQuadInOut)
			    

			var chart = graphicVisEl.selectAll('.chart')
			
			chart.transition(t)
				.attr('transform', translate(chartWidth / 2, chartHeight / 2))

            var c = chart.selectAll("circle")
                .data(fall2018, function(d) { return d.area; });
            
                // c.enter().append("circle")
                c.attr("cx", function(d) { return scaleX(d.income); })
                    .attr("cy", function(d) { return scaleY(d.rent); })
                    .attr("r", 10)
                    .attr("fill","teal")
                    .style("opacity", 0.3)
                .merge(c)
                    .transition(t)
                    .attr("cx", function(d) { return scaleX(d.income); })
                    .attr("cy", function(d) { return scaleY(d.rent); })
                    .attr("fill", "teal")
                    .style("opacity", 0.3)
                    .attr("r", 10); 
              
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
			// var t = d3.transition()
			// 	.duration(500)
			// 	.ease(d3.easeQuadInOut)
			
			// // circles are positioned
			// var item = graphicVisEl.selectAll('.item')
			
			// item.transition(t)
			// // 	.attr('transform', function(d, i) {
			// // 		return translate(scaleX(i), chartSize / 2)
            // //     })
            
            // var c = item.selectAll("circle")
            //     .data(spring2019, function(d) { return d.area; });
            //     console.log(spring2019);

            // // c.enter().append("circle")
            // c.attr("cx", function(d) { return scaleX(d.income); })
            //     .attr("cy", function(d) { return scaleY(d.rent); })
            //     .style("opacity", 0.3)
            //     .attr("fill", "rgb(31,31,137")
            //     .attr("r", 0)
                
            // .merge(c)
            //     .transition(t)
            //     //.duration(500)
            //     //.delay(500)
            //     .attr("cx", function(d) { return scaleX(d.income); })
            //     .attr("cy", function(d) { return scaleY(d.rent); })
            //     .style("opacity", 0.3)
            //     .attr("fill", "rgb(31,31,137")
                
            //     .attr("r", 10); 
          
            //   c.exit(t)
            //     .transition()
            //     //.duration(500)
            //     //.delay(500)
            //       .attr("r", 0)
            //       .remove(); 

			// item.select('circle')
			// 	.transition(t)
			// 	.attr('r', minR)

			// item.select('text')
			// 	.transition(t)
			// 	.style('opacity', 0)
		},

		function step2() {
			// var t = d3.transition()
			// 	.duration(800)
			// 	.ease(d3.easeQuadInOut)

			// // circles are sized
			// var item = graphicVisEl.selectAll('.item')
			
			// item.select('circle')
			// 	.transition(t)
			// 	.delay(function(d, i) { return i * 200 })
			// 	.attr('r', function(d, i) {
			// 		return scaleR(d)
			// 	})

			// item.select('text')
			// 	.transition(t)
			// 	.delay(function(d, i) { return i * 200 })
			// 	.style('opacity', 1)
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
		
        var chart = svg.select("chart")
            .data(fall2018)
            .enter().append('g')
			.classed('chart', true)
            //.attr('transform', translate(chartSize / 2, chartSize / 2))
            .attr('transform', 'translate(' + -chartWidth / 2 + ',' + -chartHeight/ 2 + ')')

		scaleR = d3.scaleLinear()
		// scaleX = d3.scaleBand()

		// var domainX = d3.range(data.length)

		scaleX = d3.scaleLinear()
			.domain([0, 180])
            .range([margin.left, size.w-margin.right])
            
        scaleY = d3.scaleLinear()
			.domain([0, 3500])
			.range([size.h-margin.bottom, margin.top])

		// scaleR
		// 	.domain(extent)
		// 	.range([minR, maxR])

		// var item = chart.selectAll('.item')
		// 	.data(fall2018)
		// 	.enter().append('g')
		// 		.classed('item', true)
        //         .attr('transform', translate(chartWidth / 2, chartHeight / 2))
                
        var xAxis = chart.append("g")
            .attr("class","axis")
            .attr("transform",`translate(0, ${size.h-margin.bottom})`)
            .call(d3.axisBottom().scale(scaleX).tickFormat(d3.format("$")));

        var yAxis = chart.append("g")
            .attr("class","axis")
            .attr("transform",`translate(${margin.left},0)`)
            .call(d3.axisLeft().scale(scaleY).tickFormat(d3.format("$")));

        var xAxisLabel = chart.append("text")
            .attr("class","axisLabel")
            .attr("x", size.w/2)
            .attr("y", size.h-margin.bottom/2)
            .attr("text-anchor","middle")
            .text("Median Income (Thousands)");
      
        var yAxisLabel = chart.append("text")
            .attr("class","axisLabel")
            .attr("transform","rotate(-90)")
            .attr("x",-size.h/2)
            .attr("y",margin.left/2)
            .attr("text-anchor","middle")
            .text("Median Rent");
		
		chart.append('circle')
			.attr('cx', 0)
            .attr('cy', 0)
            .attr("r", 0)
            .style("opacity", 0)

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