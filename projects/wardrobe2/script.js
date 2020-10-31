
var promises = [
    d3.csv("./data/eras.csv"), 
    d3.csv("./data/Wardrobe.csv")
];
    
    var graphicEl = d3.select('#container')
    var graphicVisEl = graphicEl.select('#graph')
    var graphicProseEl = graphicEl.select('.graphic__prose')

Promise.all(promises).then(function(wardrobedata) {

    var eras = wardrobedata[0];
    var wardrobe = wardrobedata[1];

        var era_start = [];
    for(i = 0; i < eras.length; i++) {
        era_start.push(eras[i].start);
    }
    console.log(era_start);
    var width = document.querySelector("#graph").clientWidth;
    var widthT = document.querySelector(".graphic__prose").clientWidth;
    var heightT = document.querySelector(".graphic__prose").clientHeight;
    var marginT = {top: 0, left: 10, right: 0, bottom: 0};
    
    var svgT = d3.select(".graphic__prose")
        .append("svg")
        .attr("width", widthT)
        .attr("height", heightT);
    var yScaleT = d3.scaleLinear()
        .domain([1, 60])
        .range([0, heightT]);
    
    // var yAxisGenerator = d3.axisRight(yScaleT)
    //     .tickSize(-14)
    //     .ticks(60);
    
    // var yAxis = svgT.append("g")
    //     .attr("class","axis")
    //     .attr("transform", `translate(${marginT.left + 7},0)`)
    //     .call(yAxisGenerator);
    
    // yAxis.selectAll(".tick text")
    //     .attr("class", "sideLabels")
    //     .style("visibility", "hidden");
    
    // var lineT = svgT.append("line")
    //     .attr("x1", marginT.left)
    //     .attr("x2", marginT.left)
    //     .attr("y1", function() {
    //         return yScaleT(1);
    //     })
    //     .attr("y2", function() {
    //         return yScaleT(60);
    //     })
    //     .attr("stroke", "#a08875");
    

    console.log(wardrobe);

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

    var patterns = [];
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
                //.attr("xlink:href", "./pattern/rainbow.png")
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
        .attr("transform", `translate(20,${height-margin.bottom + 15})`)
        .call(xAxisGenerator);
    
    xAxis.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(45)")})
        .style("text-anchor", "start");

    var annotation = d3.select(".annotation")
    var date_labels = d3.select(".date_labels")
          
    var topsG = svg.append("g").attr("class", "topsG")

    topsG.selectAll("rect").data(tops)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Tops")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
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
        //.style("opacity", 0.2);

    var bottomsG = svg.append("g").attr("class", "bottomsG")

    bottomsG.selectAll("rect").data(bottoms)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Bottoms")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
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
        .attr("width", 40)
        .attr("height", 10)
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
        .attr("width", 40)
        .attr("height", 10)
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
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

        svg.selectAll("rect").on("mouseover, mousemove", function(d) {
            if(d.Vintage === "N"){
                annotation.select(".brand").html(d.Brand);
            } else {
                annotation.select(".brand").html("Vintage");
            }
            if(d.Primary_Color === "#FFFFFF" || d.Primary_Color === "#f9f3ed"){
                annotation.select(".swatch").style("color", "#3d332a");
            } else {
                annotation.select(".swatch").style("color", "#FFFFFF");
            }
            annotation.select(".item").html(d.Description + " " + d.Sub_Category);
            annotation.select(".notes").html(d.Notes);
            annotation.select(".swatch")
                .style("background-color", d.Primary_Color)
                .html(d.Primary_Color)
            });

    function sec_1() {
        svg.selectAll("rect")
            .attr("fill", function(d) {
                if(d.Era === "Winnetka, IL") {
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Winnetka, IL") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Freshman Year, Middlebury College" || d.Era == "Sophomore Year, Middlebury College") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Study Abroad, London") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Senior Year, Middlebury College") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Los Angeles") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Moved in with Steven, Nottingham") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Hangzhou, China") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "The Orme School, Mayer, AZ") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Roslindale, MA") {
                    return 1;
                } else {
                    return 0.3;
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
                    return d.Primary_Color
                } else {
                    return "#ddd3ca";
                }
            })
            .attr("opacity", function(d) {
                if(d.Era === "Lawrence, MA") {
                    return 1;
                } else {
                    return 0.3;
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
        // .offset(height)
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