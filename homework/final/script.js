
d3.csv("./data/oscars_shows_small.csv", function(data) {
d3.csv("./data/oscars_movies.csv", function(movieData) {

//////////////////////////////////
//Converting date and quantity of episodes variables into numbers 
//////////////////////////////////
    
    data.forEach(function(d){
        d.year = +d.year; 
    });

    data.forEach(function(d){
        d.episodes = +d.episodes; 
    });

//////////////////////////////////
//List of stars
//////////////////////////////////
    
    var stars = [];
        for(var i = 0; i < data.length; i++) {
            var actors = [data[i].actor];
            actors.forEach(function(val) {
                if(stars.indexOf(val) < 0) {
                    stars.push(val);
                }
            }
            )
        }
    console.log(stars);

//////////////////////////////////
    //List of shows
//////////////////////////////////
    
    var shows = [];
        for(var i = 0; i < data.length; i++) {
            var show = [data[i].show];
            show.forEach(function(val) {
                if(shows.indexOf(val) < 0) {
                    shows.push(val);
                }
            }
            )
        }
    //console.log(shows);

//////////////////////////////////
    //Removing duplicate values
//////////////////////////////////
    
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

    var uniqueArray = removeDuplicates(data, "show");  
    uniqueArray.pop();
    console.log(uniqueArray);

//////////////////////////////////
//Setting up actor/show relationships with quantity of episodes
//////////////////////////////////
 
    var nodes = [];
        for(var i = 0; i < uniqueArray.length; i++) {
            nodes.push({id: i, actor: uniqueArray[i].actor, show: uniqueArray[i].show, value: uniqueArray[i].episodes});
        };
    console.log(nodes);
    
//////////////////////////////////
//MATRIX TIME, TAKING THE RED PILL
//////////////////////////////////

//////////////////////////////////
//Creating star/show relationships for top half of matrix
//////////////////////////////////

    var links = [];

    for(var i = 0; i < nodes.length; i++) {
        for(var j = 0; j < stars.length; j++) {
            var starA = stars[j];
            if(starA === nodes[i].actor){
                links.push({source: starA, target: nodes[i].show, value: nodes[i].value})
            } else {
                links.push({source: starA, target: nodes[i].show, value: 0})
            }
        }
    }
    //console.log(links);

    //////////////////////////////////
    //Creating star/show relationships for bottom half of matrix
    //////////////////////////////////

    var bottomLinks = [];
    for(var i = 0; i < stars.length; i++) {
        for(var j = 0; j < nodes.length; j++) {
            var starA = stars[i];
            if(starA === nodes[j].actor){
                bottomLinks.push({source: starA, target: nodes[j].show, value: nodes[j].value})
            } else {
                bottomLinks.push({source: starA, target: nodes[j].show, value: 0})
            }
        }
    }
    //console.log(bottomLinks);

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
    // Split links for top half in groups, each with the length of the stars list
    var colChunks = chunkArray(links, stars.length);
    // Split links for bottom half in groups, each with the length of the shows list
    var rowChunks = chunkArray(bottomLinks, shows.length);
    //console.log(colChunks);
    //console.log(rowChunks);

    var matrix = [];

// Top half of matrix, each row is the zero's following by the source-target values
    for(var i = 0; i < shows.length; i++) {
        var row = [];
            for(var j = 0; j < shows.length; j++) {
                row.push(0);
            }

            var rowLinks = colChunks[i];
            
            for(var j = 0; j < rowLinks.length; j++) {
                valA = rowLinks[j].value;
                row.push(valA);
            }
        matrix.push(row);
    }
    //console.log(matrix);

    // Bottom half of matrix, each row is the source-target values followed by the zero's
    for(var i = 0; i < stars.length; i++) {
        var row = [];

            var rowLinks = rowChunks[i];
            
            for(var j = 0; j < rowLinks.length; j++) {
                valA = rowLinks[j].value;
                row.push(valA);
            }

            for(var j = 0; j < stars.length; j++) {
                row.push(0);
            }
        matrix.push(row);
    }
    //console.log(matrix);

    var names = [];
    for(var i = 0; i < shows.length; i++) {
        var showA = shows[i];
        names.push(showA);
    };
    for(var i = 0; i < stars.length; i++) {
        var starA = stars[i];
        names.push(starA);
    };
    console.log(names);

    //////////////////////////////////
    //Other Data - Just for Adam Driver
    //////////////////////////////////

    var adamAll = movieData.filter(function(d){
        return d.actor === "Adam Driver";
    });
    console.log(adamAll);

    var adamTop = [];
        for(var i = 0; i < adamAll.length; i++) {
            var starA = adamAll[i].top_cast;
            if(starA === "Adam Driver") {
                adamTop.push({movie: adamAll[i].show, year: +adamAll[i].year});
            }
        }
        console.log(adamTop);
    
    adamTop.sort(function(a, b) { return b.year - a.year; });
    console.log(adamTop);

    var adamMovieNum = document.getElementById("adamMovieNum");
    adamMovieNum.innerHTML = adamTop.length;
    

    //////////////////////////////////
    //Let's draw this thing
    //////////////////////////////////

    //////////////////////////////////
    //Other Scales
    //////////////////////////////////
    
    var colors = [];
        for(var i = 0; i < nodes.length; i++) {
            var val = nodes[i].value;
            if(val >= 10 && val <= 19) {
                colors.push("#88b9e2")
            }else if(val >= 20 && val <= 29) {
                colors.push("#1f78b4")
            }else if(val >= 30 && val <= 39) {
                colors.push("#00b02c")
            }else if(val >= 40 && val <= 49) {
                colors.push("#6a3d9a")
            }else if(val >= 50 && val <= 79) {
                colors.push("#e31a1c")
            }else if(val >= 80 && val <= 99) {
                colors.push("#ff7f00")
            }else if(val >= 100 && val <= 199) {
                colors.push("#fb9a99")
            }else{
                colors.push("#fcf7b9")
            }
        }
        console.log(colors);

        stars.forEach(function() {
            colors.push("#FFFFFF");
        })
        console.log(colors);

    var activateFunctions = [];

    var margin = {left: 50, top: 10, right: 50, bottom: 10};
        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;

    var yScale = d3.scaleLinear()
      .range([margin.top, height-margin.bottom]);
    
    //Set up SVG

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    //Set up other visual elements

    svg.append("image")
      .attr("xlink:href", "./images/adam_driver.jpg")    
      .attr('class', 'adamPic')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr("opacity", 1);
  
  svg.append("image")
      .attr("xlink:href", "./images/action_figure.png")    
      .attr('class', 'actionFig')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr("opacity", 0);
  
  svg.selectAll("myMovieLabels")
      .append("text")
      .data(nodes)
      .enter()
      .append("text")
          .attr("x", width/2)
          .attr("y", height/2)    
          .text(function(d){ return(d.show)})
          .style("fill", "#FFFFFF")
          .style("text-anchor", "middle")
      .attr("class", "movieList")
      .attr("opacity", 0);

    //Create Chord Diagram
    
    var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("opacity", 0);
        
    var outerRadius = Math.min(width, height) / 2,
        innerRadius = outerRadius * 0.95,
        opacityDefault = 0.7; //default opacity of chords

    //Chord setup
    var chord = d3.chord()
        .padAngle(0.02)
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

    //The Activate Functions List
    var setupSections = function () {
        activateFunctions[0] = showMovieList;
        activateFunctions[1] = showActionFig;
        activateFunctions[2] = showChord;
      }
      
      setupSections();
      
      function showAdamPic() {
      
        svg.selectAll('.movieList')
            .transition()
            .duration(600)
            .attr('opacity', 0);
        
        svg.selectAll('.adamPic')
            .transition()
            .duration(600)
            .attr('opacity', 1);
      
          console.log("Show Adam Pic!");
      
      }
      
      function showActionFig() {
      
        svg.selectAll('.movieList')
            .transition()
            .duration(600)
            .attr('opacity', 0);
      
        svg.selectAll('.chordWrapper')
            .transition()
            .duration(600)
            .attr('opacity', 0);
        
        svg.selectAll('.actionFig')
            .transition()
            .duration(600)
            .attr('opacity', 1);
      
          console.log("Show Action Figure!");
      
      }
      
      function showMovieList() {
        svg.selectAll('.adamPic')
            .transition()
            .duration(0)
            .attr('opacity', 0);
        
        svg.selectAll('.chordWrapper')
            .transition()
            .duration(600)
            .attr('opacity', 0);
      
        svg.selectAll('.movieList')
            .transition()
            .duration(600)
            .attr('opacity', 1);
      
        console.log("Show Movie List!");
      
      }
      
      function showChord() {
        svg.selectAll('.movieList')
            .transition()
            .duration(0)
            .attr('opacity', 0);
      
        svg.selectAll('.chordWrapper')
            .transition()
            .duration(600)
            .attr('opacity', 1);
      
        svg.selectAll('.actionFig')
            .transition()
            .duration(600)
            .attr('opacity', 0);
      
          console.log("Show Chord Diagram!");
      
      }

    //Scrolling stuff
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
    
    
})
});
