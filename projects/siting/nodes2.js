const promises = [
    d3.csv("./data/nodeDataUpdated.csv", parseNodes)
];

const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = {top: 100, left: 50, right: 50, bottom: 100};

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0,10])

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

    let inputAverage;

    function updateFilters() {
      let inputA = sliderA.value/10;
      let inputB = sliderB.value/10;
      inputAverage = (inputA + inputB)/2;
      console.log(inputAverage)
      nodeData.forEach((d) => {
        // d.dist = math.distance([inputA, inputB],[d.indexA, d.indexB]);
        d.difference = inputAverage - d.indexA
      })
      let newDataset = nodeData.filter((d) => {
        // console.log(math.distance([inputA, inputB],[d.indexA, d.indexB]));
        return d.indexA > inputAverage;
      });
      console.log(newDataset)
      colorScale.domain([0,inputAverage])
      draw(nodeData);
    }

    const xScale = d3.scaleLinear()
      .domain([0,10])
      .range([margin.left, width-margin.right])

    const yScale = d3.scaleLinear()
      .domain([0,10])
      .range([margin.top, height-margin.bottom])

    

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
          .attr("fill", (d)=> {
            if(d.indexA >= inputAverage) {
              return "red";
            } else {
              return colorScale(d.indexA);
            }
            
          })

      circles.merge(enter)
        .attr("cx", d=>xScale(d.xpos))
        .attr("cy", d=>yScale(d.ypos))
        .transition()
        .duration(500)
        .attr("r", 7)
        // .attr("opacity", d=>opacityScale(d.dist))
        .attr("fill", (d)=> {
          if(d.indexA >= inputAverage) {
            return "red";
          } else {
            return colorScale(d.indexA);
          }
          
        })

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
      indexA: +d.indexA

  }

}