
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

    var allStars = [];
        for(var i = 0; i < movieData.length; i++) {
            var actors = [movieData[i].actor];
            actors.forEach(function(val) {
                if(allStars.indexOf(val) < 0) {
                    allStars.push(val);
                }
            }
            )
        }
    console.log(allStars);

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
    console.log(colChunks);
    console.log(rowChunks);

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
    console.log(matrix);

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
    console.log(matrix);

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


    //Dynamically filling in text spans with data!

    var adamMovieNum = document.getElementById("adamMovieNum");
    adamMovieNum.innerHTML = adamTop.length;

    var oscarActorNum = document.getElementById("oscarActorNum");
    oscarActorNum.innerHTML = allStars.length;

    var showActorNum = document.getElementById("showActorNum");
    showActorNum.innerHTML = stars.length;
    

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
            }else if(val >= 50 && val <= 69) {
                colors.push("#e31a1c")
            }else if(val >= 70 && val <= 99) {
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

    var margin = {left: 50, top: 10, right: 50, bottom: 10};
        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;

        var widthChord = document.querySelector("#chord").clientWidth;
        var heightChord = document.querySelector("#chord").clientHeight;

    var yScale = d3.scaleLinear()
      .range([margin.top, height-margin.bottom]);
    
    //Set up SVG for Chord Diagram

    var svgChord = d3.select("#chord").append("svg")
        .attr("width", widthChord)
        .attr("height", heightChord);

    //Create Chord Diagram
    
    var wrapper = svgChord.append("g").attr("class", "chordWrapper")
        .attr("width", widthChord/2)
        .attr("height", heightChord/2)
        .attr("transform", "translate(" + ((widthChord / 2) - 50) + "," + ((heightChord / 2) + 30) + ")");
        //.attr("opacity", 0);
        
    var outerRadius = Math.min(widthChord, heightChord) / 2,
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
            .innerRadius(250)
            .outerRadius(260)
            )
        .attr("class", "circle");

    //Tooltip

    var tooltip = d3.select("#chordContainer")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#023");

    var showTooltip = function(d) {
        tooltip
            .style("opacity", 1)
            .html("Actor: " + names[d.target.index] + "<br>Show: " + names[d.source.index] + "<br>Episodes: " + d.source.value)
            .style("left", (d3.mouse(this)[0]+20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
        }

    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(1000)
            .style("opacity", 0)
        }

    //Links
    
    var ribbons = wrapper.datum(chord)
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
            .attr("d", d3.ribbon().radius(251))
            .style("fill", function(d){ return(colors[d.source.index]) })
            .style("opacity", .6)
        .attr("class", "ribbons")
        .on("mousemove", showTooltip);
        //.on("mouseout", hideTooltip);

    ribbons.on("mouseover", function(d) {
        d3.select(this).style("opacity", 1)
        .raise()
    }).on("mouseout", function() {
        ribbons.style("opacity", .6)
    });

    var arc = wrapper.datum(chord)
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
            .style("fill", function(d,i){ return colors[i] })
            .attr("d", d3.arc()
            .innerRadius(250)
            .outerRadius(260)
            )
        .attr("class", "circle");


    svgChord.append("text").attr("class", "chordTitle")
        .attr("x", (widthChord-margin.left-margin.right)/2)
        .attr("y", margin.top + 30)
        .attr("text-anchor", "middle")
        .text("Oscar-Nominated Actors & Their TV Credits")

    svgChord.append('line')
        .attr('x1', 50)
        .attr('y1', margin.top + 10)
        .attr('x2', 50)
        .attr('y2', heightChord - 10)
        .attr('stroke', 'white')
        .attr("opacity", .5);

    //Legend
    svgChord.append("g").attr("id", "legend");
    var chartWidth = widthChord - margin.left - margin.right;
    var chartHeight = heightChord - margin.top - margin.bottom;

    var legendX = margin.left + chartWidth - 40;
    var legendY = chartHeight/4;

    var legend = svgChord.select("#legend")
        .attr("transform", "translate(" + legendX + ", " + legendY + ")");

    var legendSize = 20;

    var legendData = [
        {value: "10-19", color: "#88b9e2"}, 
        {value: "20-29", color: "#1f78b4"},
        {value:"30-39", color: "#00b02c"},
        {value: "40-49", color: "#6a3d9a"},
        {value: "50-69", color: "#e31a1c"},
        {value: "70-99", color: "#ff7f00"},
        {value: "100-199", color: "#fb9a99"},
        {value: "200+", color: "#fcf7b9"}
             ];

    var legendRects = legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 0)
            .attr("y", function(d, i) {
                return i * legendSize + i * 10;
            })
            .attr("fill", function(d) {return d.color})
            .attr("width", legendSize)
            .attr("height", legendSize);

    var legendTexts = legend.selectAll(".legendTexts")
        .data(legendData)
        .enter()
        .append("text")
        .attr("baseline-shift", "-100%")
        .attr("class", "legendTexts")
        .attr("x", legendSize + 5)
        .attr("y", function(d, i) {
            return i * legendSize + i * 10;
        })
        .text(function(d) {
            return d.value;
        });

    var legendTitle = legend.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", legendY - 175)
        .text("Episodes");

    //secondary Vis just for Adam Driver!
    d3.csv("./data/adam_movie_details.csv", function(data) {

        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;
        var margin = {left: 100, top: 100, right: 100, bottom: 100};
        
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        /*svg.append("g").attr("id", "legend");
            var chartWidth = width - margin.left - margin.right;
            var chartHeight = height - margin.top - margin.bottom;
        
            var legendX = margin.left + chartWidth - 40;
            var legendY = chartHeight/4;
        
            var legend = svg.select("#legend")
                .attr("transform", "translate(" + legendX + ", " + legendY + ")");
        
            var legendSize = 20;
        
            var legendData = [
                {value: "< $7,000 (or unknown)", color: "#264351"}, 
                {value: "$7,000-$7.9 million", color: "#4c6470"},
                {value:"$8 million - $49.9 million", color: "#809199"},
                {value: "$50 million - $1.9 billion", color: "#b3bdc2"},
                {value: "> $2 billion", color: "#FFFFFF"}
                     ];
        
            var legendRects = legend.selectAll("rect")
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", 0)
                    .attr("y", function(d, i) {
                        return i * legendSize + i * 10;
                    })
                    .attr("fill", function(d) {return d.color})
                    .attr("width", legendSize)
                    .attr("height", legendSize);
        
            var legendTexts = legend.selectAll(".legendTexts")
                .data(legendData)
                .enter()
                .append("text")
                .attr("baseline-shift", "-100%")
                .attr("class", "legendTexts")
                .attr("x", legendSize + 5)
                .attr("y", function(d, i) {
                    return i * legendSize + i * 10;
                })
                .text(function(d) {
                    return d.value;
                });
        
            var legendTitle = legend.append("text")
                .attr("class", "legendTitle")
                .attr("x", 0)
                .attr("y", legendY - 175)
                .text("Episodes");*/
    
        var runTime = {
            min: d3.min(data, function(d){ return +d.runTime; }),
            max: d3.max(data, function(d){ return +d.runTime; })       
        };
        console.log(runTime);
    
        var budget = {
            min: d3.min(data, function(d){ return +d.budget; }),
            max: d3.max(data, function(d){ return +d.budget; })       
        };
    
        var revenue = {
            min: d3.min(data, function(d){ return +d.revenue; }),
            max: d3.max(data, function(d){ return +d.revenue; })       
        };
        console.log(revenue);
        console.log(data);
    
        var xScale = d3.scaleBand()
            .domain(["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"])
            .range([margin.left, width-margin.right])  
            .padding(1); 
    
        var yScale = d3.scaleLinear()
            .domain([8, 180])
            .range([height-margin.bottom, margin.top]);
        
        var rScale = d3.scaleSqrt()
            .domain([1000, 250000000])
            .range([5, 25]);
    
        var colors = ["#264351", "#4c6470", "#809199", "#b3bdc2", "#ffffff"];

        var tooltip2 = d3.select("#secondaryContainer")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip2")
            .style("background-color", "#023");

        var showTooltip2 = function(d) {
            if(d.budget>0 && d.revenue>0) {
            tooltip2
                .style("opacity", 1)
                .html("Film: " + d.title + "<br>Run Time: " + d.runTime + " minutes<br>Budget: $" + d.budget + "<br>Revenue: $" + d.revenue)
                .style("left", (d3.mouse(this)[0]+20) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            } else if (d.budget == 0 && d.revenue > 0) {
                tooltip2
                .style("opacity", 1)
                .html("Film: " + d.title + "<br>Run Time: " + d.runTime + " minutes<br>Budget: Unknown<br>Revenue: $" + d.revenue)
                .style("left", (d3.mouse(this)[0]+20) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            } else if (d.budget>0 && d.revenue == 0) {
                tooltip2
                .style("opacity", 1)
                .html("Film: " + d.title + "<br>Run Time: " + d.runTime + " minutes<br>Budget: $" + d.budget + "<br>Revenue: Unknown")
                .style("left", (d3.mouse(this)[0]+20) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            } else {
                tooltip2
                .style("opacity", 1)
                .html("Film: " + d.title + "<br>Run Time: " + d.runTime + " minutes<br>Budget: Unknown<br>Revenue: Unknown ")
                .style("left", (d3.mouse(this)[0]+20) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            }
    }

        var hideTooltip2 = function(d) {
            tooltip2
                .style("opacity", 0)
            }
    
        var xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height-margin.bottom})`)
            .attr("class", "axis")
            .call(d3.axisBottom().scale(xScale));
    
        var yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .attr("class", "axis")
            .call(d3.axisLeft().scale(yScale));
    
        var xAxisLabel = svg.append("text")
            .attr("class","axisLabel")
            .attr("x", width/2)
            .attr("y", height-margin.bottom/2)
            .style("text-anchor", "middle")
            .text("Year");
    
        var yAxisLabel = svg.append("text")
            .attr("class","axisLabel")
            .attr("transform","rotate(-90)")
            .attr("x",-height/2)
            .style("text-anchor", "middle")
            .attr("y",margin.left/2 -20)
            .text("Run Time (minutes)");
    
        var points = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.year); }) 
                .attr("cy", function(d) { return yScale(d.runTime); })
                .attr("r", function(d) { return rScale(d.budget); })
                .attr("fill", function(d) { 
                    if(d.revenue < 7000) {
                        return colors[0];
                    } else if(d.revenue >=7000 && d.revenue < 8000000 ) {
                        return colors[1];
                    } else if(d.revenue >= 8000000 && d.revenue < 50000000) {
                        return colors[2];
                    } else if(d.revenue >=50000000 && d.revenue < 2000000000) {
                        return colors[3];
                    } else {
                        return colors[4];
                    }
                    })
                .attr("stroke", "#023")
            .on("mouseover", function(d) {
                d3.select(this)
                    .raise();
            });
        
        points.on("mousemove", showTooltip2)
            .on("mouseout", hideTooltip2);
    
        
    
    });



    
    
})
});
