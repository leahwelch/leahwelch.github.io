
d3.csv("./data/themoviedb_2019_small.csv", function(data) {

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
    //console.log(uniqueArray);

//////////////////////////////////
//Setting up actor/show relationships with quantity of episodes
//////////////////////////////////
 
    var nodes = [];
        for(var i = 0; i < uniqueArray.length; i++) {
            nodes.push({id: i, actor: uniqueArray[i].actor, show: uniqueArray[i].show, value: uniqueArray[i].episodes});
        };
    //console.log(nodes);
    
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
    //Let's draw this thing
    //////////////////////////////////

    //Set up SVG, Radii

    var margin = {left: 50, top: 10, right: 50, bottom: 10};
        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
        
    
    var outerRadius = Math.min(width, height) / 2,
        innerRadius = outerRadius * 0.95,
        opacityDefault = 0.7; //default opacity of chords

    //Chord setup
    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
        .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
        (matrix);

    wrapper.datum(chord)
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
            .style("fill", "white")
            .style("stroke", "red")
            .attr("d", d3.arc()
            .innerRadius(270)
            .outerRadius(280)
            );
    
    wrapper.datum(chord)
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
            .attr("d", d3.ribbon().radius(270))
            .style("fill", "pink")
            .style("stroke", "white");

});
