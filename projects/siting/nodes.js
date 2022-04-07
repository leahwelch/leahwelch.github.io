var promises = [
    d3.csv("./data/nodeData.csv", parseNodes)
];

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 100, left: 50, right: 50, bottom: 100};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

Promise.all(promises).then(function(data) {
    const nodeData = data[0];

    const sliderA = document.getElementById("indexA");
    const sliderB = document.getElementById("indexB");

    let filtered;


    // Update the current slider value (each time you drag the slider handle)
    sliderA.oninput = function() {
      updateFilters()
    } 

    sliderB.oninput = function() {
      updateFilters()
    }

    function updateFilters() {
      let inputA = sliderA.value/100;
      let inputB = sliderB.value/100;
      nodeData.forEach((d) => {
        d.dist = math.distance([inputA, inputB],[d.indexA, d.indexB]);
      })
      let newDataset = nodeData.filter((d) => {
        // console.log(math.distance([inputA, inputB],[d.indexA, d.indexB]));
        return d.indexA > inputA && d.indexB > inputB;
      });
      console.log(newDataset)
      draw(newDataset);
    }

    const xScale = d3.scaleLinear()
      .domain([0,10])
      .range([margin.left, width-margin.right])

    const yScale = d3.scaleLinear()
      .domain([0,10])
      .range([margin.top, height-margin.bottom])

    const colorScale = d3.scaleSequential(d3.interpolatePuOr)
      .domain([1.3,0])

    const opacityScale = d3.scaleLinear()
      .domain([1.3,.3])
      .range([0.1,1])


    function draw(dataset) {
      let circles = svg.selectAll("circle")
        .data(dataset)

      let enter = circles
        .enter()
        .append("circle")
          .attr("cx", d=>xScale(d.xpos))
          .attr("cy", d=>yScale(d.ypos))
          .attr("r", 0)
          // .attr("opacity", 0)
          // .attr("fill", d=>colorScale(d.dist))

      circles.merge(enter)
        .attr("cx", d=>xScale(d.xpos))
        .attr("cy", d=>yScale(d.ypos))
        .transition()
        .duration(500)
        .attr("r", 7)
        // .attr("opacity", d=>opacityScale(d.dist))
        // .attr("fill", d=>colorScale(d.dist))

      circles.exit()
        .transition()
        .duration(500)
        .remove();
    }

    draw(nodeData);

    
});

function parseNodes(d) {
  return {
      id: +d.id,
      xpos: +d.xpos,
      ypos: +d.ypos,
      indexA: +d.indexA,
      indexB: +d.indexB,
      indexC: +d.indexC,
      indexD: +d.indexD,
      indexE: +d.indexE
  }

}