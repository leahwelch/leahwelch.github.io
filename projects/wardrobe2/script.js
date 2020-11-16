
var promises = [
    d3.csv("./data/eras.csv"), 
    d3.csv("./data/Wardrobe.csv"),
    d3.csv("./data/wearlog.csv")
];
    
var graphicEl = d3.select('#container')
var graphicVisEl = graphicEl.select('#graph')
var graphicProseEl = graphicEl.select('.graphic__prose')

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

Promise.all(promises).then(function(wardrobedata) {

    var eras = wardrobedata[0];
    var wardrobe = wardrobedata[1];
    var wearlog = wardrobedata[2]; 

    console.log(wearlog);

    var itemsWorn = [];
    for(var i = 0; i < wearlog.length; i++) {
        itemsWorn.push({item: wearlog[i].Description, group: wearlog[i].group})
    }

    var uniqueArray = removeDuplicates(itemsWorn, "item"); 

    var capsule = [];
    for(i = 0; i < uniqueArray.length; i++) {
        capsule.push(uniqueArray[i].item);
    }

    d3.select(".totalWorn").html(capsule.length);
    d3.select(".totalItems").html(wardrobe.length);
    d3.select(".efficiencyP").html(((capsule.length/wardrobe.length) * 100).toFixed(0) + "%");

    var era_start = [];
    for(i = 0; i < eras.length; i++) {
        era_start.push(eras[i].start);
    }

    var nested = d3.nest()
        .key(function(d) { return d.group; })
        .entries(wardrobe)

    console.log(nested);

    var nestedItems = d3.nest()
        .key(function(d) { return d.Description; })
        .rollup(function(v) { return v.length;})
        .entries(wearlog)

    console.log(nestedItems);
    
    var groupVals = d3.nest()
        .key(function(d) { return d.group; })
        .rollup(function(v) { return v.length;})
        .entries(wardrobe)

    var wornVals = d3.nest()
        .key(function(d) { return d.group; })
        .rollup(function(v) { return v.length;})
        .entries(uniqueArray)

    var efficiencies = [];
    var percentages = [];
    for(i = 0; i < groupVals.length; i++) {
        for(j = 0; j < wornVals.length; j++) {
            var groupA = groupVals[i].key;
            if(groupA === wornVals[j].key) {
                efficiencies.push({group: groupA, efficiency: wornVals[j].value/groupVals[i].value})
                percentages.push(wornVals[j].value/groupVals[i].value)
            } 
        }
    }

    for(i = 0; i < percentages.length; i++) {
        percentages[i] = (percentages[i] * 100).toFixed(0);
    }

    var tooltip = d3.select("#tooltip");

    var width = document.querySelector("#graph").clientWidth;

    var tops = wardrobe.filter(function(d) {
        return d.Category === "Tops";
    });

    var nonVintage = wardrobe.filter(function(d) {
        return d.Vintage === "N";
    });
    var maxVintage = nonVintage.length;

    var toppics = [];
    for(i = 0; i < tops.length; i++) {
        toppics.push(`./assets/pics/tops/${i + 1}.png`)
    }

    var maxItems = tops.length;

    var bottoms = wardrobe.filter(function(d) {
        return d.Category === "Bottoms";
    });

    var bottompics = [];
    for(i = 0; i < bottoms.length; i++) {
        bottompics.push(`./assets/pics/bottoms/${i + 1}.png`)
    }

    var dresses = wardrobe.filter(function(d) {
        return d.Category === "Dresses & Jumpsuits";
    });

    var dresspics = [];
    for(i = 0; i < dresses.length; i++) {
        dresspics.push(`./assets/pics/dresses/${i + 1}.png`)
    }


    var outerwear = wardrobe.filter(function(d) {
        return d.Category === "Outwear";
    });

    var outerpics = [];
    for(i = 0; i < outerwear.length; i++) {
        outerpics.push(`./assets/pics/outwear/${i + 1}.png`)
    }

    var sets = wardrobe.filter(function(d) {
        return d.Category === "Sets";
    });

    var setpics = [];
    for(i = 0; i < sets.length; i++) {
        setpics.push(`./assets/pics/sets/${i + 1}.png`)
    }

    for(i = 0; i < wearlog.length; i++) {
        wearlog[i].date = new Date(wearlog[i].date);
    }

    var width = document.querySelector("#graph").clientWidth;
    var height = document.querySelector("#graph").clientHeight;
    var margin = {top: 0, left: 0, right: 0, bottom: 100};
    
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var smallMargin = {top: 0, right: 20, bottom: 20, left: 0};
    var smallWidth = 225 - smallMargin.left - smallMargin.right;
    var smallHeight = 325 - smallMargin.top - smallMargin.bottom;

    var yScaleSmall = d3.scaleBand()
        .domain(wardrobe.map(function(d) { return d.group_y; }))
        .range([smallHeight-smallMargin.bottom-10, smallMargin.top])
        .padding(1);
    

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available

    var patterns = [];
    patterns[0] = "no value";
    for(i = 0; i < 57; i++) {
        svg.append("defs")
            .append("pattern")
                .attr("id", i+1)
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", 30)
                .attr("height", 30)
                .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
                .attr("xlink:href", `./pattern/${i + 1}.svg`)
                .attr("width", 30)
                .attr("height", 30);

        patterns.push(`url(#${i+1})`)
        }

    var xScale = d3.scaleBand()
        .domain(wardrobe.map(function(d) { return d.Category; }))
        .range([width-margin.right, margin.left])
        .padding(1);
    
    var yScale = d3.scaleLinear()
        .domain([0, maxItems])
        .range([height-margin.bottom-10, margin.top]);

    var xAxisGenerator = d3.axisBottom(xScale)
        .tickSize(-14)
        .ticks(60);
    
    var xAxis = svg.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(5,${height-margin.bottom + 15})`)
        .call(xAxisGenerator);
    
    xAxis.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(30)")})
        .style("text-anchor", "start");

    var annotation = d3.select(".annotation")
    var date_labels = d3.select(".date_labels")

    var smalls = d3.select("#smalls")
        .selectAll(".uniqueChart")
        .data(nested)
        .enter()
        .append("svg")
            .attr("width", smallWidth + smallMargin.left + smallMargin.right)
            .attr("height", smallHeight +smallMargin.top + smallMargin.bottom)
            .attr("class", "uniqueChart")
        .append("g")
            .attr("transform",
                "translate(" + smallMargin.left + "," + smallMargin.top + ")");

    smalls.selectAll(".bar")
      .data(function(d) {return d.values;})
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
          if(capsule.indexOf(d.Description)>=0) {
              return smallMargin.left;
          } else {
              return 80;
          }
      })
      .attr("width", 70)
      .attr("y", function(d) { return yScaleSmall(d.group_y); })
      .attr("height", 12)
      .attr("fill", function(d) {
        if(d.Pattern === "N") {
            return d.Primary_Color;
        } else {
            return patterns[d.Pattern_ID];
        } 
       })
      .attr("rx", 2)								
	  .attr("ry", 2).on("mouseover, mousemove", function(d) {
        var timesWorn;
        for(i = 0; i < nestedItems.length; i++) {
            var itemA = d.Description;
            if(itemA === nestedItems[i].key) {
                timesWorn = nestedItems[i].value;
            } 
        }
        tooltip.classed("hidden", false)
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
        tooltip.select(".mainInfo")
            .html(function() {
                if(d.Vintage === "N") {
                    return d.Brand + " " + d.Description + " " + d.Sub_Category;
                } else {
                    return "Vintage " + d.Description + " " + d.Sub_Category;
                } 
            }) 
        if(capsule.indexOf(d.Description)>= 0) {
            tooltip.select(".wornInfo").html("Times Worn: " + timesWorn)
        } else {
            tooltip.select(".wornInfo").html("Times Worn: 0")
        }
      }).on("mouseout", function() {
        tooltip.classed("hidden", true);
    });

    smalls.append("text")
      .attr('class','smalllabel')
      .attr('x', smallMargin.left)
      .attr('y', smallHeight + 10)
      .style("font-size", "12pt")
      .style("font-weight", "bold")
      .text( function(d) { return d.key; })

    smalls.append("text")
      .attr('class','smalllabel')
      .attr('x', smallMargin.left)
      .attr('y', smallHeight - 15)
      .style("font-size", "10pt")
      .text("Worn")

    smalls.append("text")
      .attr('class','smalllabel')
      .attr('x', 80)
      .attr('y', smallHeight - 15)
      .style("font-size", "10pt")
      .text("Unworn")
          
    var topsG = svg.append("g").attr("class", "topsG")

    topsG.selectAll("rect").data(tops)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Tops")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("stroke", "none")
        .attr("rx", 2)								
		.attr("ry", 2);

    var bottomsG = svg.append("g").attr("class", "bottomsG")

    bottomsG.selectAll("rect").data(bottoms)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Bottoms")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);

    var dressesG = svg.append("g").attr("class", "dressesG")

    dressesG.selectAll("rect").data(dresses)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Dresses & Jumpsuits")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);

    var setsG = svg.append("g").attr("class", "setsG")

    setsG.selectAll("rect").data(sets)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Sets")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);

    var outerwearG = svg.append("g").attr("class", "outerwearG")

    outerwearG.selectAll("rect").data(outerwear)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Outwear")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);

    var legend = d3.select(".sketch").append("svg")
        .attr("width", 250)
        .attr("height", 100)

    legend.append("rect")
        .attr("x", 2)
        .attr("y", 20)
        .attr("width", 90)
        .attr("height", 18)
        .attr("stroke", "#ddd3ca")
        .attr("fill", "none")
        .attr("rx", 2)								
        .attr("ry", 2)
        
    legend.append("rect")
        .attr("x", 2)
        .attr("y", 46)
        .attr("width", 90)
        .attr("height", 18)
        .attr("fill", "#000000")
        .attr("rx", 2)								
        .attr("ry", 2)
        
    legend.append("rect")
        .attr("x", 2)
        .attr("y", 72)
        .attr("width", 90)
        .attr("height", 18)
        .attr("fill", "url(#1)")
        .attr("rx", 2)								
        .attr("ry", 2)
        
    legend.append("text")
        .attr("x", 110)
        .attr("y", 34)
        .text("Off")

    legend.append("text")
        .attr("x", 110)
        .attr("y", 60)
        .text("On (solid color)")

    legend.append("text")
        .attr("x", 110)
        .attr("y", 86)
        .text("On (multi-color)")

    svg.selectAll("rect").on("mouseover, mousemove", function(d) {
        if(d.Vintage === "N"){
            annotation.select(".brand").html(d.Brand);
        } else {
            annotation.select(".brand").html("Vintage");
        }
        if(d.Primary_Color === "#FFFFFF" || d.Primary_Color === "#f9f3ed" || d.Primary_Color === "#e5dfd6"){
            annotation.select(".swatch").style("color", "#3d332a");
        } else {
            annotation.select(".swatch").style("color", "#FFFFFF");
        }
        if(d.Pattern === "N") {
            annotation.select(".swatch2").style("visibility", "hidden");
        } else {
            annotation.select(".swatch2").style("visibility", "visible")
                .style("background-color", d.Secondary_Color)
                .html(d.Secondary_Color);
        }
        if(d.Secondary_Color === "#FFFFFF" || d.Secondary_Color === "#f3f4d0"){
            annotation.select(".swatch2").style("color", "#3d332a");
        } else {
            annotation.select(".swatch2").style("color", "#FFFFFF");
        }
        var string;

        if(d.Category === "Bottoms") {
            string = `<img src=${bottompics[d.ypos-1]} class="bottoms"/>`
        } else if(d.Category === "Dresses & Jumpsuits") {
            string = `<img src=${dresspics[d.ypos-1]} class="dresses"/>`
        } else if(d.Category === "Tops") {
            string = `<img src=${toppics[d.ypos-1]} class="tops"/>`
        } else if(d.Category === "Outwear") {
            string = `<img src=${outerpics[d.ypos-1]} class="outerwear"/>`
        } else if(d.Category === "Sets") {
            string = `<img src=${setpics[d.ypos-1]} class="sets"/>`
        }
        annotation.select(".item").html(d.Description + " " + d.Sub_Category);
        annotation.select(".notes").html(d.Notes);
        annotation.select(".swatch")
            .style("background-color", d.Primary_Color)
            .html(d.Primary_Color)
        annotation.select(".annotation_image").html(string);
        
        var wornDate = [];
        for(i = 0; i < wearlog.length; i++) {
            var itemA = d.Description;
            if(itemA === wearlog[i].Description) {
                wornDate.push(wearlog[i].date);
            }
        var latest = new Date(Math.max.apply(null,wornDate));
        var formatTime = d3.timeFormat("%B %e, %Y")
        latest = formatTime(latest);
        if(capsule.indexOf(d.Description) >= 0) {
            annotation.select(".date_worn").html("Last Worn: " + latest);
        } else {
            annotation.select(".date_worn").html("Not recently worn");
        }

        }

        });

    var widthA = document.querySelector("#vis").clientWidth;
    var heightA = document.querySelector("#vis").clientHeight;
    var marginA = {top: 50, left: 40, right: 40, bottom: 60};
    
    var svgA = d3.select("#vis")
        .append("svg")
        .attr("width", widthA)
        .attr("height", heightA);

    var xScaleA = d3.scaleBand()
        .domain(wardrobe.map(function(d) { return d.Category; }))
        .range([widthA-marginA.right-300, 200])
        .padding(1);
    
    var yScaleA = d3.scaleLinear()
        .domain([0, maxItems])
        .range([heightA-marginA.bottom-10, marginA.top]);

    var xAxisGeneratorA = d3.axisBottom(xScaleA)
        .tickSize(-14)
        .ticks(60);
    
    var xAxisA = svgA.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(5,${heightA-marginA.bottom + 15})`)
        .call(xAxisGeneratorA);
    
    xAxisA.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(30)")})
        .style("text-anchor", "start");

    var topsA = svgA.append("g").attr("class", "topsA")

    topsA.selectAll("rect").data(tops)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Tops")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("stroke", "none")
        .attr("rx", 2)								
        .attr("ry", 2);

    var bottomsA = svgA.append("g").attr("class", "bottomsA")

    bottomsA.selectAll("rect").data(bottoms)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Bottoms")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var dressesA = svgA.append("g").attr("class", "dressesA")

    dressesA.selectAll("rect").data(dresses)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Dresses & Jumpsuits")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var setsA = svgA.append("g").attr("class", "setsA")

    setsA.selectAll("rect").data(sets)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Sets")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var outerwearA = svgA.append("g").attr("class", "outerwearA")

    outerwearA.selectAll("rect").data(outerwear)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Outwear")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    

    // var xScaleVintage = d3.scaleLinear()
    //     .domain([0, maxVintage])
    //     .range([marginA.left, widthA-marginA.right]);

    // svgA.selectAll("rect").data(wardrobe)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function(d) { return xScaleVintage(d.vintage_ID); })
    //     .attr("y", function(d) { 
    //         if(d.Vintage === "N") {
    //             return heightA/3;
    //         } else {
    //             return heightA/3 + 100;
    //         }
    //     })
    //     .attr("height", 70)
    //     .attr("width", 18)
    //     .attr("fill", function(d) {
    //         if(d.Pattern === "N") {
    //             return d.Primary_Color;
    //         } else {
    //             return patterns[d.Pattern_ID];
    //         } 
    //        })
    //     .attr("stroke", "none")
    //     .attr("rx", 2)								
	// 	.attr("ry", 2);

    function sec_1() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Winnetka, IL") {
                    return d.Primary_Color
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Winnetka, IL") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Winnetka, IL") {
                    return "all";
                }else{
                    return "none";
                }
            });
        date_labels.select(".start_date").html("before")
        date_labels.select(".end_date").html("September, 2006")
        date_labels.select(".era_name").html("Winnetka, IL")
    }
    function sec_2() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Freshman Year, Middlebury College" || d.Era == "Sophomore Year, Middlebury College") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Freshman Year, Middlebury College" || d.Era == "Sophomore Year, Middlebury College") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Freshman Year, Middlebury College" || d.Era == "Sophomore Year, Middlebury College") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("September, 2007-")
            date_labels.select(".end_date").html("September, 2009")
            date_labels.select(".era_name").html("Middlebury College")
    }
    function sec_3() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Study Abroad, London") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Study Abroad, London") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Study Abroad, London") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("September, 2009-")
            date_labels.select(".end_date").html("September, 2010")
            date_labels.select(".era_name").html("Year Abroad, London")
    }
    function sec_4() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Senior Year, Middlebury College") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Senior Year, Middlebury College") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Senior Year, Middlebury College") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("September, 2010-")
            date_labels.select(".end_date").html("September, 2011")
            date_labels.select(".era_name").html("Middlebury College")
    }
    function sec_5() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Los Angeles") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Los Angeles") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Los Angeles") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("June, 2011-")
            date_labels.select(".end_date").html("June, 2014")
            date_labels.select(".era_name").html("Los Angeles")
    }
    function sec_6() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Moved in with Steven, Nottingham") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Moved in with Steven, Nottingham") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Moved in with Steven, Nottingham") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("June, 2014-")
            date_labels.select(".end_date").html("August, 2014")
            date_labels.select(".era_name").html("Nottingham, England")
    }
    function sec_7() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Hangzhou, China") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Hangzhou, China") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Hangzhou, China") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("September, 2014-")
            date_labels.select(".end_date").html("August, 2016")
            date_labels.select(".era_name").html("Hangzhou, China")
    }
    function sec_8() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "The Orme School, Mayer, AZ") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "The Orme School, Mayer, AZ") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "The Orme School, Mayer, AZ") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("September, 2016-")
            date_labels.select(".end_date").html("June, 2019")
            date_labels.select(".era_name").html("The Orme School")
    }
    function sec_9() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Roslindale, MA") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Roslindale, MA") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Roslindale, MA") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("June, 2019-")
            date_labels.select(".end_date").html("June, 2020")
            date_labels.select(".era_name").html("Roslindale, MA")
    }
    function sec_10() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Lawrence, MA") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
            })
            .attr("stroke", function(d) {
                if(d.Era === "Lawrence, MA") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("pointer-events", function(d) {
                if(d.Era === "Lawrence, MA") {
                    return "all";
                }else{
                    return "none";
                }
            });
            date_labels.select(".start_date").html("June, 2020-")
            date_labels.select(".end_date").html("present")
            date_labels.select(".era_name").html("Lawrence, MA")
    }

    function update_1() {
        svgA.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Vintage === "Y") {
                    if(d.Pattern === "N") {
                        return d.Primary_Color;
                    } else {
                        return patterns[d.Pattern_ID];
                    } 
                } else {
                    return "#f9ede1";
                }
                
            })
            .attr("stroke", function(d) {
                if(d.Vintage === "Y") {
                    return "none"
                } else {
                    return "#ddd3ca";
                }
            })
    }
    function update_2() {
        console.log("second update");
    }
    function update_3() {
        console.log("third update");
    }
    function update_4() {
        console.log("fourth update");
    }
    function update_5() {
        console.log("fifth update");
    }
    
    var gs = d3.graphScroll()
        .container(d3.select('#container'))
        .graph(d3.selectAll('#graph'))
        .sections(d3.selectAll('.flags > div'))
        //.offset(200)
        .eventId('uniqueId1')
        .on('active', function(i) {

        [
            sec_1,
            sec_2, 
            sec_3,
            sec_4,
            sec_5,
            sec_6, 
            sec_7,
            sec_8,
            sec_9,
            sec_10
        ][i]();

        });

    var second_scroller = d3.graphScroll()
        .container(d3.select('#analysis'))
        .graph(d3.selectAll('#vis'))
        .sections(d3.selectAll('#sections > div'))
        //.offset(200)
        .eventId('uniqueId1')
        .on('active', function(i) {

        [
            update_1,
            update_2, 
            update_3,
            update_4,
            update_5
        ][i]();

        });
                


    
});