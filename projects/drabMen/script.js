var promises = [
    d3.csv("./data/zaramenscoats.csv"), 
    d3.csv("./data/zaramensjackets.csv"),
    d3.csv("./data/zaramenspants.csv"), 
    d3.csv("./data/zaramenshirts.csv"),
    d3.csv("./data/zaramensknits.csv"),
    d3.csv("./data/zarawomenscoats.csv"), 
    d3.csv("./data/zarawomensjackets.csv"),
    d3.csv("./data/zarawomenspants.csv"), 
    d3.csv("./data/zarawomenshirts.csv"),
    d3.csv("./data/zarawomensknits.csv")
];
Promise.all(promises).then(function(data) {

    var coats = data[0];
    var jackets = data[1];
    var pants = data[2];
    var shirts = data[3];
    var knits = data[4];
    var coatsW = data[5];
    var jacketsW = data[6];
    var pantsW = data[7];
    var shirtsW = data[8];
    var knitsW = data[9];
    
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 0, left: 150, right: 150, bottom: 75};
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    nestedCoats = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(coats)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredCoats = nestedCoats.slice(0,5); 
    console.log(filteredCoats);

    var nestedJackets = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(jackets)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredJackets = nestedJackets.slice(0,5); 

    var nestedPants = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(pants)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredPants = nestedPants.slice(0,5); 

    var nestedShirts = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(shirts)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredShirts = nestedShirts.slice(0,5); 

    var nestedKnits = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(knits)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredKnits = nestedKnits.slice(0,5); 
    
    var mens = [];
        for(var i = 0; i < filteredCoats.length; i++) {
            var coatA = filteredCoats[i];
            mens.push({type: "Coats", color: coatA.key, value: coatA.value});
        };
        for(var j = 0; j < filteredJackets.length; j++) {
            var jacketA = filteredJackets[j];
            mens.push({type: "Jackets", color: jacketA.key, value: jacketA.value});
        };
        for(var k = 0; k < filteredPants.length; k++) {
            var pantA = filteredPants[k];
            mens.push({type: "Pants", color: pantA.key, value: pantA.value});
        };
        for(var l = 0; l < filteredShirts.length; l++) {
            var shirtA = filteredShirts[l];
            mens.push({type: "Shirts", color: shirtA.key, value: shirtA.value});
        };
        for(var m = 0; m < filteredKnits.length; m++) {
            var knitA = filteredKnits[m];
            mens.push({type: "Knits", color: knitA.key, value: knitA.value});
        };
        console.log(mens);
    
    var allColors = [];
        for(var i=0; i < mens.length; i++) {
            var colors = [mens[i].color];
            colors.forEach(function(val) {
                if(allColors.indexOf(val) < 0) {
                    allColors.push(val);
                }
        }
        )
    };
    console.log(allColors);
    
    var mensValues = [];
            mensValues.push({
                type: "Coats", 
                min: d3.min(filteredCoats, function(d) { return +d.value; }), 
                max: d3.max(filteredCoats, function(d) { return +d.value; })});
            mensValues.push({
                type: "Jackets", 
                min: d3.min(filteredJackets, function(d) { return +d.value; }), 
                max: d3.max(filteredJackets, function(d) { return +d.value; })});
            mensValues.push({
                type: "Pants", 
                min: d3.min(filteredPants, function(d) { return +d.value; }), 
                max: d3.max(filteredPants, function(d) { return +d.value; })});
            mensValues.push({
                type: "Shirts", 
                min: d3.min(filteredShirts, function(d) { return +d.value; }), 
                max: d3.max(filteredShirts, function(d) { return +d.value; })});
            mensValues.push({
                type: "Knits", 
                min: d3.min(filteredKnits, function(d) { return +d.value; }), 
                max: d3.max(filteredKnits, function(d) { return +d.value; })});
        console.log(mensValues);

    nestedCoatsW = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(coatsW)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredCoatsW = nestedCoatsW.slice(0,5); 
    console.log(filteredCoatsW);

    var nestedJacketsW = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(jacketsW)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredJacketsW = nestedJacketsW.slice(0,5); 

    var nestedPantsW = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(pantsW)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredPantsW = nestedPantsW.slice(0,5); 

    var nestedShirtsW = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(shirtsW)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredShirtsW = nestedShirtsW.slice(0,5); 

    var nestedKnitsW = d3.nest()
        .key(function(d){ return d.color; })
        .rollup(function(d){ return d.length; })
        .entries(knitsW)
        .sort(function(a, b) { return b.value - a.value; });

    var filteredKnitsW = nestedKnitsW.slice(0,5); 
    
    var womens = [];
        for(var i = 0; i < filteredCoatsW.length; i++) {
            var coatA = filteredCoatsW[i];
            womens.push({type: "Coats", color: coatA.key, value: coatA.value});
        };
        for(var j = 0; j < filteredJacketsW.length; j++) {
            var jacketA = filteredJacketsW[j];
            womens.push({type: "Jackets", color: jacketA.key, value: jacketA.value});
        };
        for(var k = 0; k < filteredPantsW.length; k++) {
            var pantA = filteredPantsW[k];
            womens.push({type: "Pants", color: pantA.key, value: pantA.value});
        };
        for(var l = 0; l < filteredShirtsW.length; l++) {
            var shirtA = filteredShirtsW[l];
            womens.push({type: "Shirts", color: shirtA.key, value: shirtA.value});
        };
        for(var m = 0; m < filteredKnitsW.length; m++) {
            var knitA = filteredKnitsW[m];
            womens.push({type: "Knits", color: knitA.key, value: knitA.value});
        };
        console.log(womens);
    
    var allColorsW = [];
        for(var i=0; i < womens.length; i++) {
            var colors = [womens[i].color];
            colors.forEach(function(val) {
                if(allColorsW.indexOf(val) < 0) {
                    allColorsW.push(val);
                }
        }
        )
    };
    console.log(allColorsW);
    
    var womensValues = [];
        womensValues.push({
            type: "Coats", 
            min: d3.min(filteredCoatsW, function(d) { return +d.value; }), 
            max: d3.max(filteredCoatsW, function(d) { return +d.value; })});
        womensValues.push({
            type: "Jackets", 
            min: d3.min(filteredJacketsW, function(d) { return +d.value; }), 
            max: d3.max(filteredJacketsW, function(d) { return +d.value; })});
        womensValues.push({
            type: "Pants", 
            min: d3.min(filteredPantsW, function(d) { return +d.value; }), 
            max: d3.max(filteredPantsW, function(d) { return +d.value; })});
        womensValues.push({
            type: "Shirts", 
            min: d3.min(filteredShirtsW, function(d) { return +d.value; }), 
            max: d3.max(filteredShirtsW, function(d) { return +d.value; })});
        womensValues.push({
            type: "Knits", 
            min: d3.min(filteredKnitsW, function(d) { return +d.value; }), 
            max: d3.max(filteredKnitsW, function(d) { return +d.value; })});
        console.log(womensValues);

    var pattern = svg.append("defs")
        .append("pattern")
            .attr("id", "rainbow")
            .attr("x", 10)
            .attr("y", 10)
            .attr("width", 30)
            .attr("height", 30)
            .attr("patternUnits", "userSpaceOnUse")
        .append("svg:image")
            .attr("xlink:href", "./pattern/rainbow.svg")
            .attr("width", 30)
            .attr("height", 30);
    
    var xScale = d3.scaleLinear()
        .domain([0, 110])
        .range([margin.left, width-margin.right]);
    
    var yScale = d3.scaleBand()
        .domain(mensValues.map(function(d) { return d.type; }))
        .range([height-margin.bottom, margin.top])
        .padding(1);
    
    var colorScale = d3.scaleOrdinal()
        .domain(allColors)
        .range(["#231F20", "#082E4B", "#939597", "#4D4A39", "#725D4E", "#FFFFFF", "#BABFD2", "#DCDED8", "#BF916D"]);
    
    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale))

    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2+20)
        .text("# Of Items");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Garment Type");
    
    var colorLabels = svg.selectAll("mylabels")
        .data(mens)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.color)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-38) + ")")})
            .style("font-size", 10)
            .style("text-anchor", "middle")
            .style("visibility", "hidden");

    var quants = svg.selectAll("mylabels")
        .data(mens)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.value)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-25) + ")")})
            .style("font-size", 10)
            .style("text-anchor", "middle")
            .style("visibility", "hidden");

    var lines = svg.selectAll(".myline")
        .data(mensValues)
        .enter()
        .append("line")
          .attr("x1", function(d) { return xScale(d.min); })
          .attr("x2", function(d) { return xScale(d.max); })
          .attr("y1", function(d) { return yScale(d.type); })
          .attr("y2", function(d) { return yScale(d.type); })
          .attr("class", "myline")
          .attr("stroke", "#F1F1F2")
          .attr("stroke-width", 5);

    var points = svg.selectAll("circle")
        .data(mens)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.value); }) 
            .attr("cy", function(d) { return yScale(d.type); })
            .attr("r", 15)
            .attr("fill", function(d) { return colorScale(d.color); })
            .attr("stroke", function(d){
                if(d.color === "White") {
                    return "#D1D2D4";
                } else if(d.color === "Oyster White") {
                    return "#D1D2D4";
                } else {
                    return "white";
                }
            }).on("mouseover", function(d){
                var myQuant = quants.filter(function(e){
                    if(e.type === d.type){
                    return e.value === d.value;
                    }
                }).style("visibility", "visible");
                var myLabel = colorLabels.filter(function(e){
                    if(e.type === d.type){
                    return e.color === d.color;
                    }
                }).style("visibility", "visible");
                d3.select(this)
                    .attr("r", 20)
                    .raise();
                }).on("mouseout", function(d){
                    quants.style("visibility", "hidden");
                    colorLabels.style("visibility", "hidden");
                    d3.select(this)
                        .attr("r", 15);  
                });
        
    d3.select("#womens").on("click", function() {
        xScale.domain([0, 240]);
        colorScale.domain(allColorsW);
        colorScale.range(["#231f20", "#939597", "#4d4a39", "#bf916d", "#e1cc9b", "#1b75bb", "#FFFFFF", "url(#rainbow)", "#dcded8", "#7f0647", "#68b3e3"]);

        var colorLabels = svg.selectAll("mylabels")
            .data(womens)
            .enter()
            .append("text")
                .attr("x", 0)
                .attr("y", 0)    
                .text(function(d){ return(d.color)})
                .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-38) + ")")})
                .style("font-size", 10)
                .style("text-anchor", "middle")
                .style("visibility", "hidden");
        
        var quants = svg.selectAll("mylabels")
            .data(womens)
            .enter()
            .append("text")
                .attr("x", 0)
                .attr("y", 0)    
                .text(function(d){ return(d.value)})
                .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-25) + ")")})
                .style("font-size", 10)
                .style("text-anchor", "middle")
                .style("visibility", "hidden");
        
        var newLines = svg.selectAll(".myline").data(womensValues);

        newLines.enter().append("line")
            .attr("x1", function(d) { return xScale(d.min); })
            .attr("x2", function(d) { return xScale(d.max); })
            .attr("y1", function(d) { return yScale(d.type); })
            .attr("y2", function(d) { return yScale(d.type); })
        .merge(newLines)
            .transition()
            .attr("x1", function(d) { return xScale(d.min); })
            .attr("x2", function(d) { return xScale(d.max); })
            .attr("y1", function(d) { return yScale(d.type); })
            .attr("y2", function(d) { return yScale(d.type); })
            .attr("stroke", "#F1F1F2")
            .attr("stroke-width", 5);
        
        newLines.exit()
            .transition()
            .remove();
    
        xAxis.transition()
            .call(d3.axisBottom().scale(xScale));
        
        var newPoints = svg.selectAll("circle").data(womens);

            newPoints.enter().append("circle")
                .attr("cx", function(d) { return xScale(d.value); }) 
                .attr("cy", function(d) { return yScale(d.type); })
                .attr("r", 0)
                .attr("fill", function(d) { return colorScale(d.color); })
                .attr("stroke", function(d){
                    if(d.color === "White") {
                        return "#D1D2D4";
                    } else if(d.color === "Oyster White") {
                        return "#D1D2D4";
                    } else {
                        return "white";
                    }
                })
                .merge(newPoints)
                    .transition()
                    .attr("cx", function(d) { return xScale(d.value); }) 
                    .attr("cy", function(d) { return yScale(d.type); })
                    .attr("r", 15)
                    .attr("fill", function(d) { return colorScale(d.color); })
                    .attr("stroke", function(d){
                        if(d.color === "White") {
                            return "#D1D2D4";
                        } else if(d.color === "Oyster White") {
                            return "#D1D2D4";
                        } else {
                            return "white";
                        }
                    });
                newPoints.exit()
                    .transition()
                    .attr("r",0)
                    .remove();
                newPoints.on("mouseover", function(d){
                    var myQuant = quants.filter(function(e){
                        if(e.type === d.type){
                        return e.value === d.value;
                        }
                    }).style("visibility", "visible");
                    var myLabel = colorLabels.filter(function(e){
                        if(e.type === d.type){
                        return e.color === d.color;
                        }
                    }).style("visibility", "visible");
                d3.select(this)
                    .attr("r", 20)
                    .raise();
                }).on("mouseout", function(d){
                    quants.style("visibility", "hidden");
                    colorLabels.style("visibility", "hidden");
                    d3.select(this)
                        .attr("r", 15);  
                });
    });
    
    d3.select("#mens").on("click", function() {
        d3.select(this)
            .style("background-color", "black")
            .style("color", "white")
            .style("border", "2px solid black");
            
        var xScale = d3.scaleLinear()
            .domain([0, 110])
            .range([margin.left, width-margin.right]);
    
        var yScale = d3.scaleBand()
            .domain(mensValues.map(function(d) { return d.type; }))
            .range([height-margin.bottom, margin.top])
            .padding(1);
        
        var colorScale = d3.scaleOrdinal()
            .domain(allColors)
            .range(["#231F20", "#082E4B", "#939597", "#4D4A39", "#725D4E", "#FFFFFF", "#BABFD2", "#DCDED8", "#BF916D"]);
        
        xAxis.transition()
            .call(d3.axisBottom().scale(xScale));

        var colorLabels = svg.selectAll("mylabels")
            .data(mens)
            .enter()
            .append("text")
                .attr("x", 0)
                .attr("y", 0)    
                .text(function(d){ return(d.color)})
                .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-38) + ")")})
                .style("font-size", 10)
                .style("text-anchor", "middle")
                .style("visibility", "hidden");
        
        var quants = svg.selectAll("mylabels")
            .data(mens)
            .enter()
            .append("text")
                .attr("x", 0)
                .attr("y", 0)    
                .text(function(d){ return(d.value)})
                .attr("transform", function(d){ return( "translate(" + (xScale(d.value)) + "," + (yScale(d.type)-25) + ")")})
                .style("font-size", 10)
                .style("text-anchor", "middle")
                .style("visibility", "hidden");
        
        var lines = svg.selectAll(".myline").data(mensValues)
        
        lines.enter().append("line")
            .attr("x1", function(d) { return xScale(d.min); })
            .attr("x2", function(d) { return xScale(d.max); })
            .attr("y1", function(d) { return yScale(d.type); })
            .attr("y2", function(d) { return yScale(d.type); })
        .merge(lines)
            .transition()
            .attr("x1", function(d) { return xScale(d.min); })
            .attr("x2", function(d) { return xScale(d.max); })
            .attr("y1", function(d) { return yScale(d.type); })
            .attr("y2", function(d) { return yScale(d.type); })
            .attr("stroke", "#F1F1F2")
            .attr("stroke-width", 5);    

        var points = svg.selectAll("circle").data(mens)
            
        points.enter().append("circle")
            .attr("cx", function(d) { return xScale(d.value); }) 
            .attr("cy", function(d) { return yScale(d.type); })
            .attr("r", 0)
            .attr("fill", function(d) { return colorScale(d.color); })
            .attr("stroke", function(d){
                if(d.color === "White") {
                    return "#D1D2D4";
                } else if(d.color === "Oyster White") {
                    return "#D1D2D4";
                } else {
                    return "white";
                }
        })
        .merge(points)
            .transition()
            .attr("cx", function(d) { return xScale(d.value); }) 
            .attr("cy", function(d) { return yScale(d.type); })
            .attr("r", 15)
            .attr("fill", function(d) { return colorScale(d.color); })
            .attr("stroke", function(d){
                if(d.color === "White") {
                    return "#D1D2D4";
                } else if(d.color === "Oyster White") {
                    return "#D1D2D4";
                } else {
                    return "white";
                }
            });
        points.exit()
            .transition()
            .attr("r",0)
            .remove();
        
        points.on("mouseover", function(d){
            var myQuant = quants.filter(function(e){
                if(e.type === d.type){
                return e.value === d.value;
                }
            }).style("visibility", "visible");
            var myLabel = colorLabels.filter(function(e){
                if(e.type === d.type){
                return e.color === d.color;
                }
            }).style("visibility", "visible");
        d3.select(this)
            .attr("r", 20)
            .raise();
        }).on("mouseout", function(d){
            quants.style("visibility", "hidden");
            colorLabels.style("visibility", "hidden");
            d3.select(this)
                .attr("r", 15);  
        });
    }).on("blur", function(d){
        d3.select(this)
            .style("background-color", "white")
            .style("color", "black")
            .style("border", "2px solid black");
    })
    .on("mouseover", function(d){
        d3.select(this)
            .style("background-color", "black")
            .style("color", "white")
            .style("border", "2px solid black");
    });

});
