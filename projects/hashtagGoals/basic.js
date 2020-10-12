window.createGraphic = function(graphicSelector) {
    var dataLoc = "data/sdgs_totals.csv";
    var data = [8]

    var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

    var width = document.querySelector('.graphic__vis').clientWidth;
    var height = document.querySelector('.graphic__vis').clientHeight;
    var margin = {top: 300, left: 20, right: 400, bottom: 100};

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

    // var c = svg.enter().append("circle")
    // 	.attr('cx', 0)
    //     .attr('cy', 0)
    //     .attr("r", 0)
    //     .style("opacity", 0)

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

    var steps = [
        function showTshirt(settings) {
            var bars = svg.selectAll(".bar")
                .data(data);

            var enter = bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", width/2)
                .attr("y",height/2)
                .attr("width", 100)
                .attr("height", 50)

            bars.merge(enter)
            bars.exit()
        },
        function showAll(settings) {
            var bars = svg.selectAll(".bar")
                .data(data);

            var enter = bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", width/2)
                .attr("y",height/2)
                .attr("width", 100)
                .attr("height", 50)
                .attr("fill", "red")

            bars.merge(enter)
            bars.exit()
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