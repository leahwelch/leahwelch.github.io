
var promises = [
    d3.csv("./data/eras.csv"), 
    d3.csv("./data/smalls.csv"), 
    d3.csv("./data/Wardrobe.csv")
];
    
    var graphicEl = d3.select('#container')
    var graphicVisEl = graphicEl.select('#graph')
    var graphicProseEl = graphicEl.select('.graphic__prose')

Promise.all(promises).then(function(wardrobedata) {

    var eras = wardrobedata[0];
    var smallData = wardrobedata[1];
    var wardrobe = wardrobedata[2];

        var era_start = [];
    for(i = 0; i < eras.length; i++) {
        era_start.push(eras[i].start);
    }

    var nested = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.group;})
        .entries(wardrobe);

    console.log(nested);
    // console.log([nested[0].values]);

    var width = document.querySelector("#graph").clientWidth;

    var tops = wardrobe.filter(function(d) {
        return d.Category === "Tops";
    });

    console.log(tops);

    var maxItems = tops.length;
    console.log(maxItems);

    var bottoms = wardrobe.filter(function(d) {
        return d.Category === "Bottoms";
    });

    console.log(bottoms);

    var dresses = wardrobe.filter(function(d) {
        return d.Category === "Dresses & Jumpsuits";
    });

    console.log(dresses);

    var outerwear = wardrobe.filter(function(d) {
        return d.Category === "Outwear";
    });

    console.log(outerwear);

    var sets = wardrobe.filter(function(d) {
        return d.Category === "Sets";
    });

    console.log(sets);

    

    var width = document.querySelector("#graph").clientWidth;
    var height = document.querySelector("#graph").clientHeight;
    var margin = {top: 0, left: 0, right: 0, bottom: 100};
    
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var smallMargin = {top: 20, right: 20, bottom: 20, left: 20};
    var smallWidth = 300 - smallMargin.left - smallMargin.right;
    var smallHeight = 450 - smallMargin.top - smallMargin.bottom;

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
    console.log(patterns);

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
      .attr("x", (smallWidth-smallMargin.left)/2)
      .attr("width", 70)
      .attr("y", function(d) { return yScaleSmall(d.group_y); })
      .attr("height", 10)
      .attr("fill", function(d) {
        if(d.Pattern === "N") {
            return d.Primary_Color;
        } else {
            return patterns[d.Pattern_ID];
        } 
       })
      .attr("rx", 2)								
	  .attr("ry", 2);

    smalls.append("text")
      .attr('class','smalllabel')
      .attr('x',(smallWidth-smallMargin.left)/2)
      .attr('y', smallHeight)
      .text( function(d) { return d.key; })
      //.attr('text-anchor', 'middle')
          
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
        //.style("opacity", 0.2);

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
        //.style("opacity", 0.2);

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
        //.style("opacity", 0.2);

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
        //.style("opacity", 0.2);

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
        //.style("opacity", 0.2);

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
        annotation.select(".item").html(d.Description + " " + d.Sub_Category);
        annotation.select(".notes").html(d.Notes);
        annotation.select(".swatch")
            .style("background-color", d.Primary_Color)
            .html(d.Primary_Color)

        });

    function sec_1() {
        //annotation.select(".instructions").style("opacity", 1).html("Want to see the story of an item? Hover over it!");
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
                


    
});