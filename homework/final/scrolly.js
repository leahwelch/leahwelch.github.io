var miniNodes = [
  {id: 0, actor: "Aaron Paul", show: "The Path", value: 36},
  {id: 1, actor: "Aaron Paul", show: "Big Love", value: 11},
  {id: 2, actor: "Aaron Paul", show: "Truth Be Told", value: 8},
  {id: 3, actor: "Aaron Paul", show: "Beverly Hills, 90210", value: 1},
  {id: 4, actor: "Aaron Paul", show: "Bones", value: 1},
  {id: 5, actor: "Elle Fanning", show: "Criminal Minds", value: 2}
];

var miniShows = [
  "The Path",
  "Big Love",
  "Truth Be Told",
  "Beverly Hills, 90210",
  "Bones",
  "Criminal Minds"
]

var miniStars = [
  "Aaron Paul",
  "Elle Fanning"
]

var names = [];
  for(var i = 0; i < miniShows.length; i++) {
      var showA = miniShows[i];
      names.push(showA);
  };
  for(var i = 0; i < miniStars.length; i++) {
      var starA = miniStars[i];
      names.push(starA);
  };
console.log(names);


console.log(miniNodes);
console.log(miniShows);
console.log(miniStars);

//////////////////////////////////
//Creating star/show relationships for top half of matrix
//////////////////////////////////

var links = [];

for(var i = 0; i < miniNodes.length; i++) {
  for(var j = 0; j < miniStars.length; j++) {
      var starA = miniStars[j];
      if(starA === miniNodes[i].actor){
          links.push({source: starA, target: miniNodes[i].show, value: miniNodes[i].value})
      } else {
          links.push({source: starA, target: miniNodes[i].show, value: 0})
      }
  }
}
console.log(links);

//////////////////////////////////
//Creating star/show relationships for bottom half of matrix
//////////////////////////////////

var otherLinks = [];
  for(var i = 0; i < miniStars.length; i++) {
      for(var j = 0; j < miniNodes.length; j++) {
          var starA = miniStars[i];
          if(starA === miniNodes[j].actor){
              otherLinks.push({source: starA, target: miniNodes[j].show, value: miniNodes[j].value})
          } else {
              otherLinks.push({source: starA, target: miniNodes[j].show, value: 0})
          }
      }
  }
console.log(otherLinks);

//////////////////////////////////
//Awesome chunking function from https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
//////////////////////////////////
function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      tempArray.push(myChunk);
  }

  return tempArray;
}
// Split links for top half in groups, each with the length of the miniStars list
var colChunks = chunkArray(links, miniStars.length);
// Split links for bottom half in groups, each with the length of the miniShows list
var rowChunks = chunkArray(otherLinks, miniShows.length);
console.log(colChunks);
console.log(rowChunks);

var matrix = [];

// Top half of matrix, each row is the zero's following by the source-target values
  for(var i = 0; i < miniShows.length; i++) {
      var row = [];
          for(var j = 0; j < miniShows.length; j++) {
              row.push(0);
          }

          var rowLinks = colChunks[i];
          
          for(var j = 0; j < rowLinks.length; j++) {
              valA = rowLinks[j].value;
              row.push(valA);
          }
      matrix.push(row);
  }
  console.log(matrix);

// Bottom half of matrix, each row is the source-target values followed by the zero's
  for(var i = 0; i < miniStars.length; i++) {
      var row = [];

          var rowLinks = rowChunks[i];
          
          for(var j = 0; j < rowLinks.length; j++) {
              valA = rowLinks[j].value;
              row.push(valA);
          }

          for(var j = 0; j < miniStars.length; j++) {
              row.push(0);
          }
      matrix.push(row);
  }
  console.log(matrix);

  var colors = [ "#ed1c24", "#fff100", "#00a550", "#ec008b", "#27a9e1", "#a1d7cb", "#ffffff", "#ffffff"]

  var activateFunctions = [];

  var margin = {left: 50, top: 10, right: 50, bottom: 10};
      var width = document.querySelector("#chart").clientWidth;
      var height = document.querySelector("#chart").clientHeight;

  var svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  svg.append("image")
      .attr("xlink:href", "./images/adam_driver.jpg")    
      .attr('class', 'adamPic')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr("opacity", 1);

  var wrapper = svg.append("g")
      .attr("class", "chordWrapper")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
      .attr("opacity", 0);
      
  var outerRadius = Math.min(width, height) / 2,
      innerRadius = outerRadius * 0.95,
      opacityDefault = 0.7; //default opacity of chords

  //Chord setup
  var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
      .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
      (matrix);

  var arc = wrapper.datum(chord)
      .append("g")
      .selectAll("g")
      .data(function(d) { return d.groups; })
      .enter()
      .append("g")
      .append("path")
          .style("fill", function(d,i){ return colors[i] })
          .attr("d", d3.arc()
          .innerRadius(270)
          .outerRadius(280)
          )
      .attr("class", "circle");
  
  var ribbons = wrapper.datum(chord)
      .append("g")
      .selectAll("path")
      .data(function(d) { return d; })
      .enter()
      .append("path")
          .attr("d", d3.ribbon().radius(270))
          .style("fill", function(d){ return(colors[d.source.index]) })
          .style("opacity", .6)
      .attr("class", "ribbons");
        
var setupSections = function () {
  activateFunctions[0] = showChord;
}

setupSections();

function showChord() {
  svg.selectAll('.adamPic')
      .transition()
      .duration(0)
      .attr('opacity', 0);

  svg.selectAll('.chordWrapper')
      .transition()
      .duration(600)
      .attr('opacity', 1);

    console.log("Show Chord Diagram!");

}


// using d3 for convenience
var scrolly = d3.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  console.log(response);
  // response = { element, direction, index }

  // add color to current step only
  step.classed("is-active", function(d, i) {
    return i === response.index;
  });

  // update graphic based on step
    activateFunctions[response.index]();
}

function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.33,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();