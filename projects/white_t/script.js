d3.csv("./data/t_shirt.csv", function(data) {
    
    data.forEach(function(d){
        d.value = +d.value; 
    });

    //////////////////////////////////
    //List of goals
    //////////////////////////////////
        
    var goals = [];
    for(var i = 0; i < data.length; i++) {
        var goalList = [data[i].goal];
        goalList.forEach(function(val) {
            if(goals.indexOf(val) < 0) {
             goals.push(val);
            }
        }
        )
    }
    console.log(goals);

    //////////////////////////////////
    //List of industries
    //////////////////////////////////
        
    var industries = [];
    for(var i = 0; i < data.length; i++) {
        var areas = [data[i].industry];
        areas.forEach(function(val) {
            if(industries.indexOf(val) < 0) {
             industries.push(val);
            }
        }
        )
    }
    console.log(industries);

    //////////////////////////////////
    //Setting up goal/industry relationships
    //////////////////////////////////
    
    var nodes = [];
    for(var i = 0; i < data.length; i++) {
        nodes.push({id: i, goal: data[i].goal,industry: data[i].industry, value: data[i].value});
    };
    console.log(nodes);

    //////////////////////////////////
    //MATRIX TIME, TAKING THE RED PILL
    //////////////////////////////////

    //////////////////////////////////
    //Creating goal/industry relationships for top half of matrix
    //////////////////////////////////

    var links = [];

    for(var i = 0; i < nodes.length; i++) {
        for(var j = 0; j < goals.length; j++) {
            var goalA = goals[j];
            if(goalA === nodes[i].goal){
                links.push({source: goalA, target: nodes[i].industry, value: nodes[i].value})
            } else {
                links.push({source: goalA, target: nodes[i].industry, value: 0})
            }
        }
    }
    // console.log(links);

    //////////////////////////////////
    //Creating star/show relationships for bottom half of matrix
    //////////////////////////////////

    var bottomLinks = [];
    for(var i = 0; i < goals.length; i++) {
        for(var j = 0; j < nodes.length; j++) {
            var goalA = goals[i];
            if(goalA === nodes[j].goal){
                bottomLinks.push({source: goalA, target: nodes[j].industry, value: nodes[j].value})
            } else {
                bottomLinks.push({source: goalA, target: nodes[j].industry, value: 0})
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
    var colChunks = chunkArray(links, goals.length);
    // Split links for bottom half in groups, each with the length of the shows list
    var rowChunks = chunkArray(bottomLinks, industries.length);
    // console.log(colChunks);
    // console.log(rowChunks);

    var matrix = [];

    // Top half of matrix, each row is the zero's following by the source-target values
    for(var i = 0; i < industries.length; i++) {
        var row = [];
            for(var j = 0; j < industries.length; j++) {
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
    for(var i = 0; i < goals.length; i++) {
        var row = [];

            var rowLinks = rowChunks[i];
            
            for(var j = 0; j < rowLinks.length; j++) {
                valA = rowLinks[j].value;
                row.push(valA);
            }

            for(var j = 0; j < goals.length; j++) {
                row.push(0);
            }
        matrix.push(row);
    }
    //console.log(matrix);

    var names = [];
    for(var i = 0; i < industries.length; i++) {
        var industryA = industries[i];
        names.push(industryA);
    };
    for(var i = 0; i < goals.length; i++) {
        var goalA = goals[i];
        names.push(goalA);
    };
    console.log(names);

    //////////////////////////////////
    //Let's draw this thing
    //////////////////////////////////

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

    var arc = wrapper.datum(chord)
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
            .style("fill", "#AAAAAA")
            .attr("d", d3.arc()
            .innerRadius(270)
            .outerRadius(280)
            );

    var tooltip = d3.select("#chordContainer")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip");

    var showTooltip = function(d) {
        tooltip
            .style("opacity", 1)
            .html("Industry: " + names[d.target.index] + "<br>Goal: " + names[d.source.index])
            .style("left", (d3.mouse(this)[0]+20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
        }

    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(1000)
            .style("opacity", 0)
        }

    var ribbons = wrapper.datum(chord)
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
            .attr("d", d3.ribbon().radius(270))
            .style("fill", "##69b3a2")
            .style("opacity", .6)
        .attr("class", "ribbons")
        .on("mousemove", showTooltip);

    ribbons.on("mouseover", function(d) {
            d3.select(this)
            .transition()
            .duration(300)
            .style("opacity", 1)
            .raise()
        }).on("mouseout", function() {
            ribbons
            .transition()
            .duration(300)
            .style("opacity", .6)
        });
});