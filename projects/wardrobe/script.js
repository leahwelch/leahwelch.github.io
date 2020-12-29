
var promises = [
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

    var wardrobe = wardrobedata[0];
    var wearlog = wardrobedata[1]; 

    for(i = 0; i < wardrobe.length; i++) {
        wardrobe[i].Year_Entered = +wardrobe[i].Year_Entered;
    }

    var itemsWorn = [];
    for(var i = 0; i < wearlog.length; i++) {
        itemsWorn.push({item: wearlog[i].Description, group: wearlog[i].group})
    }

    var uniqueArray = removeDuplicates(itemsWorn, "item"); 

    var capsule = [];
    for(i = 0; i < uniqueArray.length; i++) {
        capsule.push(uniqueArray[i].item);
    }

    var filtered_unworn = wardrobe.filter(function(d) {
        return d.Worn === "N";
    })

    var filtered_patterned = wardrobe.filter(function(d) {
        return d.Pattern === "Y";
    })

    console.log(filtered_patterned.length)

    var filtered_vintage = wardrobe.filter(function(d) {
        return d.Vintage === "Y";
    });

    var filtered_online = wardrobe.filter(function(d) {
        return d.Online === "Y";
    });

    var filtered_discards = wardrobe.filter(function(d) {
        return d.discard === "Y";
    })

    console.log(filtered_discards);

    var nested_vintage = d3.nest()
        .key(function(d) {return d.Year_Entered})
        .rollup(function(d) { return d.length; })
        .entries(filtered_vintage)

    var nested_online = d3.nest()
        .key(function(d) {return d.Year_Entered})
        .rollup(function(d) { return d.length; })
        .entries(filtered_online)

    nested_vintage.push({key: 2007, value: 0});
    nested_vintage.push({key: 2011, value: 0});
    nested_vintage.push({key: 2012, value: 0});
    //nested_vintage.push({key: 2021, value: 0});

    nested_online.push({key: 2008, value: 0});
    nested_online.push({key: 2009, value: 0});
    nested_online.push({key: 2010, value: 0});
    nested_online.push({key: 2011, value: 0});
    nested_online.push({key: 2012, value: 0});
    nested_online.push({key: 2014, value: 0});
    nested_online.push({key: 2015, value: 0});
    nested_online.push({key: 2018, value: 0});

    for(i = 0; i < nested_vintage.length; i++) {
        nested_vintage[i].key = +nested_vintage[i].key;
        nested_vintage[i].value = +nested_vintage[i].value;
    }

    for(i = 0; i < nested_online.length; i++) {
        nested_online[i].key = +nested_online[i].key;
        nested_online[i].value = +nested_online[i].value;
    }

    nested_vintage.sort(function(a,b) { return b.key-a.key;})
    nested_online.sort(function(a,b) { return b.key-a.key;})
    console.log(nested_online);

    var vintageItems = [];
    for(i = 0; i < wardrobe.length; i++) {
        if(wardrobe[i].Vintage === "Y") {
            vintageItems.push(wardrobe[i].Description)
        }
    }

    var onlineItems = [];
    for(i = 0; i < wardrobe.length; i++) {
        if(wardrobe[i].Online === "Y") {
            onlineItems.push(wardrobe[i].Description)
        }
    }
    var maxVintage = vintageItems.length;
    var maxOnline = onlineItems.length;


    d3.select(".totalWorn").html(capsule.length);
    d3.select(".initialDiscards").html(filtered_discards.length);
    d3.select(".totalUnworn").html(filtered_unworn.length);
    d3.select(".totalItems").html(wardrobe.length);
    // d3.select(".efficiencyP").html(((capsule.length/wardrobe.length) * 100).toFixed(0) + "%");
    d3.select(".totalVintage").html(((maxVintage/wardrobe.length)*100).toFixed(0) + "%")

    var nested = d3.nest()
        .key(function(d) { return d.group; })
        .entries(wardrobe)

    var nestedItems = d3.nest()
        .key(function(d) { return d.Description; })
        .rollup(function(v) { return v.length;})
        .entries(wearlog)

    var purchases = {
        min: d3.min(nested_vintage, function(d) { return d.value; }),
        max: d3.max(nested_vintage, function(d) { return d.value; })
    }

    var year = {
        min: d3.min(nested_vintage, function(d) { return d.key; }),
        max: d3.max(nested_vintage, function(d) { return d.key; })
    }
    
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
    var analysistooltip = d3.select("#analysis_tooltip");

    var width = document.querySelector("#graph").clientWidth;

    var tops = wardrobe.filter(function(d) {
        return d.Category === "Tops";
    });

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

    var bottomsmpics = [];
    for(i = 0; i < bottoms.length; i++) {
        bottomsmpics.push(`./assets/pics/bottoms_sm/${i + 1}.png`)
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
    
    var heatmap = d3.select("#cal").append("svg")
        .attr("width", 400)
        .attr("height", 300)

    


    //WEARLOG SMALL MULTIPLES

    

    var smallMargin = {top: 0, right: 20, bottom: 20, left: 0};
    var smallWidth = 240 - smallMargin.left - smallMargin.right;
    var smallHeight = 325 - smallMargin.top - smallMargin.bottom;

    var yScaleSmall = d3.scaleBand()
        .range([smallHeight-smallMargin.bottom-10, smallMargin.top])
        .padding(1);

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
    
    var updater = d3.select("#updater");
    var resetter = d3.select("#reset");

    function default_smalls() {
        canvas_clear();
        d3.select(".efficiencyP").html(((capsule.length/wardrobe.length) * 100).toFixed(0) + "%");

        yScaleSmall.domain(wardrobe.map(function(d) { return d.group_y; }));

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
    }
    
      
     //INITIAL VISUALIZATION 
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

        var dateValues = [];
        var allDates = [];
        var wornDate = [];
        //var formatDate = d3.timeFormat("%Y-%m-%d")
        for(i = 0; i < wearlog.length; i++) {
            var itemA = d.Description;
            allDates.push({date: wearlog[i].date});
            if(itemA === wearlog[i].Description) {
                wornDate.push(wearlog[i].date);
                dateValues.push({date: wearlog[i].date, value: 1})
            }

 //HEATMAP CALENDAR
        const years = d3.nest()
            .key(d => d.date.getUTCFullYear())
            .entries(dateValues)
            .reverse()

        const cellSize = 15
        const yearHeight = cellSize * 7 + 35
        const formatDay = d => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getUTCDay()]
        const countDay = d => d.getUTCDay()
        const timeWeek = d3.utcSunday

        const thisyear = heatmap.selectAll('g')
            .data(years)
            .join('g')
            .attr('transform', (d, i) => `translate(40, ${yearHeight * i + cellSize * 1.5 + 20} )`)
        
        

        const monthLabels = thisyear.append('g').attr("class", "monthLabels")

        monthLabels.append("text")
            .attr('x', 0)
            .attr('y', 0)
            .attr("class", "monthlabel")
            .attr("text-anchor", "start")
            .attr('font-size', 16)
            .attr('transform', 'translate(15,-5) rotate(-45)')
            .attr("fill", "#3d332a")
            .text("Oct");

        // monthLabels.append("line")
        //     .attr('x1', 10)
        //     .attr('y1', -2)
        //     .attr('x2', 220)
        //     .attr('y2', -2)
        //     .attr("stroke-width", 1)
        //     .attr("stroke", "#3d332a");

        monthLabels.append("text")
            .attr('x', 0)
            .attr('y', 0)
            .attr("class", "monthlabel")
            .attr("text-anchor", "start")
            .attr('font-size', 16)
            .attr('transform', 'translate(75,-5) rotate(-45)')
            .attr("fill", "#3d332a")
            .text("Nov");

        monthLabels.append("text")
            .attr('x', 0)
            .attr('y', 0)
            .attr("class", "monthlabel")
            .attr("text-anchor", "start")
            .attr('font-size', 16)
            .attr('transform', 'translate(140,-5) rotate(-45)')
            .attr("fill", "#3d332a")
            .text("Dec");

        thisyear.append('g')
            .attr('text-anchor', 'end')
            .selectAll('text')
            .data(d3.range(7).map(i => new Date(1999, 0, i)))
            .join('text')
            .attr("class", "heatmapText")
            .attr('x', -5)
            .attr('y', d => (countDay(d) + 0.5) * cellSize)
            .attr('dy', '0.31em')
            .attr("fill", "#3d332a")
            .text(formatDay);


        thisyear.append('g')
            .selectAll('rect')
            .data(d => d.values)
            //.data(dateValues)
            .join('rect')
            .attr("width", cellSize - 1.5)
            .attr("height", cellSize - 1.5)
            .attr("x", (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10)
            .attr("y", d => countDay(d.date) * cellSize + 0.5)
            .attr('transform', "translate(-600, 0)")
            .attr("fill", "#a08875")


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

    //ANALYSIS INITIAL CHARTS

    function canvas_clear() {
        
        smalls
            .selectAll(".bar")
            .remove();

        smalls
            .selectAll("text")
            .remove();
    }

    


    //GLOBAL VARIABLES FOR ANALYSIS UPDATES
        
    var visW = document.querySelector("#vis").clientWidth;
    var visH = document.querySelector("#vis").clientHeight;
    var visM = {top: 30, left: 30, right: 200, bottom: 500}

    var analysisSVG = d3.select("#vis")
        .append("svg")
        .attr("class", "analysisSVG")
        .attr("width", visW)
        .attr("height", visH)

    var vintageG = analysisSVG.append("g").attr("class", "vintageG")

    var vintageX = d3.scaleLinear()
        .domain([year.min, 2021])
        .range([visM.left, visW - visM.right])

    var vintageY = d3.scaleLinear()
        .range([visH - visM.bottom, visM.top])
        .domain([0,10])

    var yScaleVintage = d3.scaleBand()
        .domain(filtered_vintage.map(function(d) { return d.vintage_ID; }))
        .range([visH - visM.bottom + 75, visH - visM.bottom + 200])
        .padding(1);

    var vintageYAxis = analysisSVG.append("g")
        .attr("class", "vintageYAxis")
        .attr("transform", `translate(${visM.left}, 0)`)

    var vintageline = d3.line()
        .x(function(d) { return vintageX(d.key)})
        .y(function(d) { return vintageY(d.value)})

    var path = analysisSVG.append("path")
            .datum(nested_vintage)
            .attr("class", "vintagepath")
            .attr("d", function(d) { return vintageline(d); })
            .attr("stroke", "#a08875")
            .attr("fill", "none")
            .attr("stroke-width", 2)

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
        d3.select("#analysis_header").html("My 'Vintage' Style")
        d3.select("#miniTitle").html("Vintage Items By Purchase Year")
        d3.select(".newvintageG").remove();

        vintageY.domain([0,10])
        vintageline.y(function(d) { return vintageY(d.value)})

        var vintageXAxis = analysisSVG.append("g")
            .attr("class", "vintageXAxis")
            .attr("transform", `translate(0,${visH-visM.bottom})`)
            .call(d3.axisBottom().scale(vintageX).tickFormat(d3.format("Y")).tickSize(0));

        vintageXAxis.selectAll(".tick text")
            .attr("class", "vintageLabels")
            .attr("transform", function(d){ return( "translate(0,10)")})
            .style("text-anchor", "start")

        vintageYAxis.call(d3.axisLeft().scale(vintageY));

        vintageYAxis.selectAll(".tick text")
            .attr("class", "vintageLabels")
            .attr("transform", function(d){ return( "translate(-10,0)")})

        analysisSVG.selectAll(".vintagepath").datum(nested_vintage)
            .enter()
            .append("path")
            .attr("class","vintagepath")
            .merge(path)
            //.transition()
            //.duration(3000)
            .attr("d", function(d) { return vintageline(d); })
            .attr("fill", "none")
            .attr("stroke", "#a08875")
            .attr("stroke-width", 2)

        vintageG.selectAll("rect").data(filtered_vintage)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return vintageX(d.Year_Entered)
            })
            .attr("y", function(d) { return yScaleVintage(d.vintage_ID); })
            .attr("width", 60)
            .attr("height", 11)
            .attr("fill", function(d) { 
                if(d.Pattern === "N") {
                    return d.Primary_Color;
                } else {
                    return patterns[d.Pattern_ID];
                } 
            })
            .attr("rx", 2)								
            .attr("ry", 2).on("mouseover", function(d) {
                analysistooltip.classed("hidden", false)
                    .style("left", (d3.mouse(this)[0]+20) + "px")		
                    .style("top", (d3.mouse(this)[1]) + "px")
                    .style("border", "2px solid")
                    .style("border-color", function() {
                        return d.Primary_Color;
                    })
                analysistooltip.select(".brand").html(function() {
                    if(d.Vintage === "N") {
                        return d.Brand;
                    } else {
                        return "Vintage ";
                    } 
                }) 
                analysistooltip.select(".item").html(function() {
                    return d.Description + " " + d.Sub_Category;
                })
                var string;

                if(d.Category === "Bottoms") {
                    string = `<img src=${bottomsmpics[d.ypos-1]} class="bottoms_sm"/>`
                } else if(d.Category === "Dresses & Jumpsuits") {
                    string = `<img src=${dresspics[d.ypos-1]} class="dresses_sm"/>`
                } else if(d.Category === "Tops") {
                    string = `<img src=${toppics[d.ypos-1]} class="tops_sm"/>`
                } else if(d.Category === "Outwear") {
                    string = `<img src=${outerpics[d.ypos-1]} class="outerwear_sm"/>`
                } else if(d.Category === "Sets") {
                    string = `<img src=${setpics[d.ypos-1]} class="sets_sm"/>`
                }
                analysistooltip.select("#tooltip_image").html(string);

              }).on("mouseout", function() {
               analysistooltip.classed("hidden", true);
            });

        vintageG.append("line")
            .attr("x1", 0)
            .attr("y1", visH - visM.bottom + 80)
            .attr("x2", function() {
                return vintageX(2021);})
            .attr("y2", visH - visM.bottom + 80)
            .attr('stroke', "#a08875")
            .attr("stroke-width", 1);

        vintageG.append("line")
            .attr("x1", function() {
                return vintageX(2016);
            })
            .attr("class", "vintageCallout")
            .attr("y1", visM.top)
            .attr("x2", function() {
                return vintageX(2016);})
            .attr("y2", visH - visM.bottom)
            .attr('stroke', "#a08875")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2016) + 5;
            })
            .attr("class", "vintageCallout")
            .attr("y", visM.top + 10)
            .attr("fill", "#3d332a")
            .style("font-size", "10pt")
            .text("Honeymoon in Japan")

        vintageG.append("line")
            .attr("x1", function() {
                return vintageX(2013);
            })
            .attr("class", "vintageCallout")
            .attr("y1", visM.top)
            .attr("x2", function() {
                return vintageX(2013);})
            .attr("y2", visH - visM.bottom)
            .attr('stroke', "#a08875")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2013) + 5;
            })
            .attr("class", "vintageCallout")
            .attr("y", visM.top + 10)
            .attr("fill", "#3d332a")
            .style("font-size", "10pt")
            .text("Met Steven")

        vintageG.append("line")
            .attr("x1", function() {
                return vintageX(2018);
            })
            .attr("class", "vintageCallout")
            .attr("y1", visM.top)
            .attr("x2", function() {
                return vintageX(2018);})
            .attr("y2", visH - visM.bottom)
            .attr('stroke', "#a08875")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2018) + 5;
            })
            .attr("class", "vintageCallout")
            .attr("y", visM.top + 10)
            .attr("fill", "#3d332a")
            .style("font-size", "10pt")
            .text("Start of Pregnancy")

        analysisSVG.append("text")
            .attr("x", 0)
            .attr("y", visH - visM.bottom + 70)
            .attr("class", "miniTitle")
            .attr("fill", "#3d332a")
            .text("Every Vintage Item I Own")

        analysisSVG.selectAll(".onlinePath").remove();  
        analysisSVG.selectAll(".onlineCallout").remove(); 
        analysisSVG.selectAll(".onlineG").remove();
    }
    
    function update_2() {
        d3.select("#analysis_header").html("My <span id='notVintage'>'Vintage'</span> Shopping Blog Style")
        d3.select("#miniTitle").html("Vintage & Online Items By Purchase Year")
        vintageG.selectAll("rect").remove();
        analysisSVG.selectAll(".vintageCallout").remove();
        // d3.selectAll(".uniqueChart").remove();

        vintageY.domain([0,18])

        var newline = d3.line()
            .x(function(d) { return vintageX(d.key); })
            .y(function(d) { return vintageY(d.value); })

        vintageYAxis
            .call(d3.axisLeft().scale(vintageY));

        vintageYAxis.selectAll(".tick text")
            .attr("class", "vintageLabels")
            .attr("transform", function(d){ return( "translate(-10,0)")})

        var newVintageLine = analysisSVG.selectAll(".vintagepath").datum(nested_vintage)
        newVintageLine
            .enter()
            .append("path")
            .attr("class","vintagepath")
            .merge(newVintageLine)
            //.transition()
            //.duration(3000)
            .attr("d", function(d) { return newline(d); })
            .attr("fill", "none")
            .attr("stroke", "#a08875")
            .attr("stroke-width", 2)
        
        analysisSVG.append("path")
            .datum(nested_online)
            .attr("class", "onlinePath")
            .attr("d", function(d) { return newline(d); })
            .attr("stroke", "#0b7c85")
            .attr("fill", "none")
            .attr("stroke-width", 2)

        analysisSVG.append("line")
            .attr("x1", function() {
                return vintageX(2020) + 5;
            })
            .attr("class", "onlineCallout")
            .attr("y1", function() {
                return vintageY(17);
            })
            .attr("x2", function() {
                return vintageX(2021);})
            .attr("y2", function() {
                return vintageY(17);
            })
            .attr('stroke', "#0b7c85")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2021) + 5;
            })
            .attr("class", "onlineCallout")
            .attr("y", function() {
                return vintageY(17) + 5;
            })
            .attr("fill", "#0b7c85")
            .style("font-size", "10pt")
            .text("Online Purchases")

        analysisSVG.append("line")
            .attr("x1", function() {
                return vintageX(2020) + 5;
            })
            .attr("class", "onlineCallout")
            .attr("y1", function() {
                return vintageY(1);
            })
            .attr("x2", function() {
                return vintageX(2021);})
            .attr("y2", function() {
                return vintageY(1);
            })
            .attr('stroke', "#a08875")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2021) + 5;
            })
            .attr("class", "onlineCallout")
            .attr("y", function() {
                return vintageY(1) + 5;
            })
            .attr("fill", "#a08875")
            .style("font-size", "10pt")
            .text("Vintage Purchases")

        analysisSVG.append("line")
            .attr("x1", function() {
                return vintageX(2018.5);
            })
            .attr("class", "onlineCallout")
            .attr("y1", visM.top)
            .attr("x2", function() {
                return vintageX(2018.5);})
            .attr("y2", visH - visM.bottom)
            .attr('stroke', "#0b7c85")
            .attr("stroke-dasharray", 4)
            .attr("stroke-width", 1);

        analysisSVG.append("text")
            .attr("x", function() {
                return vintageX(2018.5) - 5;
            })
            .attr("class", "onlineCallout")
            .attr("y", visM.top + 10)
            .attr("fill", "#0b7c85")
            .style("font-size", "10pt")
            .text("Discovered Shopping Blogs")
            .style("text-anchor", "end")

        var yScaleOnline = d3.scaleBand()
            .domain(filtered_online.map(function(d) { return d.online_ID; }))
            .range([visH - visM.bottom + 250,visH - visM.bottom + 500])
            .padding(1);

        var onlineG = analysisSVG.append("g").attr("class", "onlineG")
        var newvintageG = analysisSVG.append("g").attr("class", "newvintageG")

        newvintageG.selectAll("rect").data(filtered_vintage)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return vintageX(d.Year_Entered)
            })
            .attr("y", function(d) { return yScaleVintage(d.vintage_ID); })
            .attr("width", 60)
            .attr("height", 11)
            .attr("fill", function(d) { 
                if(d.Pattern === "N") {
                    return d.Primary_Color;
                } else {
                    return patterns[d.Pattern_ID];
                } 
            })
            .attr("rx", 2)								
            .attr("ry", 2).on("mouseover", function(d) {
                analysistooltip.classed("hidden", false)
                    .style("left", (d3.mouse(this)[0]+20) + "px")		
                    .style("top", (d3.mouse(this)[1] - 1500) + "px");
                analysistooltip.select(".brand").html(function() {
                    if(d.Vintage === "N") {
                        return d.Brand;
                    } else {
                        return "Vintage ";
                    } 
                }) 
                analysistooltip.select(".item").html(function() {
                    return d.Description + " " + d.Sub_Category;
                })
                var string;

                if(d.Category === "Bottoms") {
                    string = `<img src=${bottompics[d.ypos-1]} class="bottoms_sm"/>`
                } else if(d.Category === "Dresses & Jumpsuits") {
                    string = `<img src=${dresspics[d.ypos-1]} class="dresses_sm"/>`
                } else if(d.Category === "Tops") {
                    string = `<img src=${toppics[d.ypos-1]} class="tops_sm"/>`
                } else if(d.Category === "Outwear") {
                    string = `<img src=${outerpics[d.ypos-1]} class="outerwear_sm"/>`
                } else if(d.Category === "Sets") {
                    string = `<img src=${setpics[d.ypos-1]} class="sets_sm"/>`
                }
                analysistooltip.select("#tooltip_image").html(string);

              }).on("mouseout", function() {
               analysistooltip.classed("hidden", true);
            });

        onlineG.selectAll("rect").data(filtered_online)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return vintageX(d.Year_Entered)
            })
            .attr("y", function(d) { return yScaleOnline(d.online_ID); })
            .attr("width", 60)
            .attr("height", 11)
            .attr("fill", function(d) { 
                if(d.Pattern === "N") {
                    return d.Primary_Color;
                } else {
                    return patterns[d.Pattern_ID];
                } 
            })
            .attr("rx", 2)								
            .attr("ry", 2).on("mouseover", function(d) {
                analysistooltip.classed("hidden", false)
                    .style("left", (d3.mouse(this)[0]+20) + "px")		
                    .style("top", (d3.mouse(this)[1] - 1500) + "px");
                analysistooltip.select(".brand").html(function() {
                    if(d.Vintage === "N") {
                        return d.Brand;
                    } else {
                        return "Vintage ";
                    } 
                }) 
                analysistooltip.select(".item").html(function() {
                    return d.Description + " " + d.Sub_Category;
                })
                var string;

                if(d.Category === "Bottoms") {
                    string = `<img src=${bottompics[d.ypos-1]} class="bottoms_sm"/>`
                } else if(d.Category === "Dresses & Jumpsuits") {
                    string = `<img src=${dresspics[d.ypos-1]} class="dresses_sm"/>`
                } else if(d.Category === "Tops") {
                    string = `<img src=${toppics[d.ypos-1]} class="tops_sm"/>`
                } else if(d.Category === "Outwear") {
                    string = `<img src=${outerpics[d.ypos-1]} class="outerwear_sm"/>`
                } else if(d.Category === "Sets") {
                    string = `<img src=${setpics[d.ypos-1]} class="sets_sm"/>`
                }
                analysistooltip.select("#tooltip_image").html(string);

              }).on("mouseout", function() {
               analysistooltip.classed("hidden", true);
            });

        onlineG.append("line")
            .attr("x1", 0)
            .attr("y1", visH - visM.bottom + 255)
            .attr("x2", function() {
                return vintageX(2021);})
            .attr("y2", visH - visM.bottom + 255)
            .attr('stroke', "#0b7c85")
            .attr("stroke-width", 1);

        onlineG.append("text")
            .attr("x", 0)
            .attr("y", visH - visM.bottom + 245)
            .attr("class", "miniTitle")
            .attr("fill", "#0b7c85")
            .text("Every Online Purchase I (Still) Own")

        
    }
    
    function update_sm() {
        //yScaleSmall.domain(wardrobe.map(function(d) { return d.new_group_y; }));

        var newbars = smalls.selectAll(".bar").data(function(d) {return d.values;})

        newbars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .merge(newbars)
            .attr("x", function(d) {
                if(capsule.indexOf(d.Description)>=0) {
                    return smallMargin.left;
                } else {
                    return 80;
                }
            })
            .attr("width", 70)
            .attr("y", function(d) { return yScaleSmall(d.new_group_y); })
            .attr("height", 12)
            .attr("opacity", function(d) {
                if(d.discard === "Y") {
                    return 0;
                } else {
                    return 1;
                }
            })
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

        // smalls.selectAll(".bar")
        //     .attr("fill", function(d) {
        //         if(d.discard === "N") {
        //             if(d.Pattern === "N") {
        //                 return d.Primary_Color;
        //             } else {
        //                 return patterns[d.Pattern_ID];
        //             } 
        //         } else {
        //             return "#f9ede1";
        //         }
        //     })
        //     .attr("stroke", function(d) {
        //         if(d.discard === "N") {
        //             return "none"
        //         } else {
        //             return "#ddd3ca";
        //         }
        //     })

        d3.select(".efficiencyP").html(((capsule.length/(wardrobe.length - filtered_discards.length)) * 100).toFixed(0) + "%");

        
           
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
            update_2
        ][i]();

        });

    default_smalls();
    updater.on("click", update_sm);
    resetter.on("click", default_smalls);
    
});