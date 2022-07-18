var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 10, left: 10, right: 10, bottom: 10};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width-margin.left - margin.right)
    .attr("height", height-margin.top-margin.bottom);

d3.json("./data/text_all.json").then(function(data) {
    let initialData = data.product[0].sub_products;
    let array = [];
    for(i = 0; i < initialData.length; i++) {
        for(j = 0; j < initialData[i].market_share; j++) {
            array.push({category: initialData[i].name, color: initialData[i].color, radius: initialData[i].innovation * 15, innovation: initialData[i].innovation})
        }
    }
    console.log(array)

const nodeGroup = svg.append("g")
        .attr("class", "nodeGroup")
        .attr("transform", `translate(200,300)`)

let xScale = d3.scaleLinear()
    .domain([d3.min(array, d=> d.innovation), d3.max(array, d=> d.innovation)])
    .range([100,300])

var numNodes = 100;
var nodes = d3.range(numNodes).map(function(d, i) {
	return {
		radius: 10,
		category: i % 3
	}
});
// console.log(nodes);


var simulation = d3.forceSimulation(array)
	.force('charge', d3.forceManyBody().strength(20))
	.force('x', d3.forceX().x(function(d) {
		return xScale(d.innovation);
    }))
    // .force('y', d3.forceY().y(function(d) {
	// 	return yCenter[d.category];
    // }))
	.force('collision', d3.forceCollide().radius(d=>d.radius))
	.on('tick', ticked);

function ticked() {
    var u = nodeGroup
    // d3.select('svg g')
		.selectAll('circle')
		.data(array)
		.join('circle')
		.attr('r', function(d) {
			return d.radius;
		})
		.style('fill', function(d) {
			return d.color;
        })
        .style('stroke', "#ffffff")
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('cy', function(d) {
			return d.y;
		});
}



    // let node = svg.append("g")
    //     .selectAll("circle")
    //     .data(array)
    //     .enter()
    //     .append("circle")
    //         .attr("r", 10)
    //         .attr("cx", width / 2)
    //         .attr("cy", height / 2)
    //         .style("fill", d=>d.color)
    //         .attr("stroke", "#ffffff")
    //         .style("stroke-width", 1)

    // let simulation = d3.forceSimulation()
    //     .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    //     .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    //     .force("collide", d3.forceCollide().strength(1).radius(20).iterations(1)) // Force that avoids circle overlapping

    // simulation
    //     .nodes(array)
    //     .on("tick", function(d){
    //       node
    //           .attr("cx", function(d){ return d.x; })
    //           .attr("cy", function(d){ return d.y; })
    //     });
        

});