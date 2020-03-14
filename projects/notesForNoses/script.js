var promises = [
    d3.csv("./data/byredo.csv", parseCSV), 
    d3.csv("./data/notelibrary.csv", parseAgain)
];
Promise.all(promises).then(function(data) {

    var byredo = data[0];
    var notelibrary = data[1];
   
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 100, left: 40, right: 40, bottom: 150};
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var allFamilies = [];
        for(var i = 0; i < notelibrary.length; i++) {
            var families = [notelibrary[i].family];
            console.log(families);
            families.forEach(function(val) {
                if(allFamilies.indexOf(val) < 0) {
                    allFamilies.push(val);
                }
            }
            )
    }
    console.log(allFamilies);
    var allNotes = [];
        for(var i = 0; i < byredo.length; i++) {
            var notes = byredo[i].notes;
            notes.forEach(function(val) {
                if(allNotes.indexOf(val) < 0) {
                    allNotes.push(val);
                }
            }
            )
        }
        
    
    var filteredLib = [];
        for(var i = 0; i < allNotes.length; i++) {
            for(var j=0; j < notelibrary.length; j++) {
                var noteA = notelibrary[j].note;
                if(noteA === allNotes[i]){
                    filteredLib.push({name: noteA, family: notelibrary[j].family})
                }
            }
        }
   
    var allProducts = [];
        for(var i = 0; i < byredo.length; i++) {
            var productA = byredo[i];
            allProducts.push(productA.productname);
        };     

    var nodes = [];
        for(var i = 0; i < allProducts.length; i++) {
            var productA = allProducts[i];
            nodes.push({id: i, name: productA, type: "product", family: "perfume"});
        };
        for(var i = 0; i < filteredLib.length; i++) {
            var noteA = filteredLib[i].name;
            var familyA = filteredLib[i].family;
            nodes.push({id: allProducts.length + i, name: noteA, type: "note", family: familyA});
        };
    
    var grasses = nodes.filter(function(d){
        return d.family === "GREENS, HERBS AND FOUGERES";
    });

    var citrus = nodes.filter(function(d){
        return d.family === "CITRUS SMELLS";
    });

    var woods = nodes.filter(function(d){
        return d.family === "WOODS AND MOSSES";
    });

    var whites = nodes.filter(function(d){
        return d.family === "WHITE FLOWERS";
    });

    var flowers = nodes.filter(function(d){
        return d.family === "FLOWERS";
    });

    var synthetic = nodes.filter(function(d){
        return d.family === "SYNTHETIC";
    });

    var sweets = nodes.filter(function(d){
        return d.family === "SWEETS AND GOURMAND SMELLS";
    });

    var fruits = nodes.filter(function(d){
        return d.family === "FRUITS, VEGETABLES AND NUTS";
    });

    var animalic = nodes.filter(function(d){
        return d.family === "MUSK, AMBER, ANIMALIC SMELLS";
    });

    var resins = nodes.filter(function(d){
        return d.family === "RESINS AND BALSAMS";
    });

    var spices = nodes.filter(function(d){
        return d.family === "SPICES";
    });

    var beverages = nodes.filter(function(d){
        return d.family === "BEVERAGES";
    });
    
    var links = [];
        for(var i = 0; i < byredo.length; i++) {
            var datum = byredo[i];
            var product = datum.productname;
            var notes = datum.notes;
            notes.forEach(function(note){
                links.push({ source: product, target: note });
                }) 
        }; 

    var allNodes = nodes.map(function(d){return d.name})

    var xScale = d3.scalePoint()
        .domain(allNodes)
        .range([margin.left, width-margin.right]);

    var colorScale = d3.scaleOrdinal()
        .domain(allFamilies)
        .range(["#72A741", "#FCC730", "#006031", "#CCD6A1", "#EFA5B2", "#67A3B5", "#CF873A", "#CE2348", "#875F50", "#4D3368", "#9A3520", "#A5ADBD"]);

    var nameToNode = {};
        nodes.forEach(function (n) {
            nameToNode[n.name] = n;
        });
    
    var arcs = svg.selectAll('mylinks')
        .data(links)
        .enter()
        .append("path")
        .attr("d", function(d) {
          start = xScale(nameToNode[d.source].name)   
          end = xScale(nameToNode[d.target].name)   
          return ["M", start, height-margin.bottom-30,    
            "A",                           
            (start - end)/2, ",",    
            (start - end)/3, 0, 0, ",",
            start < end ? 1 : 0, end, ",", height-margin.bottom-30] 
            .join(" ");
        })
        .style("fill", "none")
        .attr("stroke", "#BBBDC0")
        .attr("stroke-width", 1);
    
    var points = svg.selectAll("mynodes")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 4)
            .attr("stroke", "#FFFFFF")
            .style("fill", function(nodes) {
                if(nodes.type === "product") {
                    return "black";
                }else{
                    return colorScale(nodes.family);
                }
            })
            .attr("pointer-events", function(nodes) {
                if(nodes.type === "product") {
                    return "all";
                }else{
                    return "none";
                }
            });
    
    var grassPoints = svg.selectAll("mynodes")
        .data(grasses)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#72A741")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var grassLabels = svg.selectAll("mylabels")
        .data(grasses)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#72A741")
            .style("text-anchor", "end")
            .style("visibility", "hidden");
    
    var citrusPoints = svg.selectAll("mynodes")
        .data(citrus)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#FCC730")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var citrusLabels = svg.selectAll("mylabels")
        .data(citrus)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#FCC730")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var woodPoints = svg.selectAll("mynodes")
        .data(woods)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#006031")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var woodLabels = svg.selectAll("mylabels")
        .data(woods)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#006031")
            .style("text-anchor", "end")
            .style("visibility", "hidden");
    
    var whitePoints = svg.selectAll("mynodes")
        .data(whites)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#CCD6A1")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var whiteLabels = svg.selectAll("mylabels")
        .data(whites)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#CCD6A1")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var flowerPoints = svg.selectAll("mynodes")
        .data(flowers)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#EFA5B2")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var flowerLabels = svg.selectAll("mylabels")
        .data(flowers)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#EFA5B2")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var syntheticPoints = svg.selectAll("mynodes")
        .data(synthetic)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#67A3B5")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var syntheticLabels = svg.selectAll("mylabels")
        .data(synthetic)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#67A3B5")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var sweetPoints = svg.selectAll("mynodes")
        .data(sweets)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#CF873A")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var sweetLabels = svg.selectAll("mylabels")
        .data(sweets)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#CF873A")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var fruitPoints = svg.selectAll("mynodes")
        .data(fruits)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#CE2348")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var fruitLabels = svg.selectAll("mylabels")
        .data(fruits)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#CE2348")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var animalicPoints = svg.selectAll("mynodes")
        .data(animalic)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#875F50")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var animalicLabels = svg.selectAll("mylabels")
        .data(animalic)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#875F50")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var resinPoints = svg.selectAll("mynodes")
        .data(resins)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#4D3368")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var resinLabels = svg.selectAll("mylabels")
        .data(resins)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#4D3368")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var spicePoints = svg.selectAll("mynodes")
        .data(spices)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#9A3520")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var spiceLabels = svg.selectAll("mylabels")
        .data(spices)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#9A3520")
            .style("text-anchor", "end")
            .style("visibility", "hidden");

    var beveragePoints = svg.selectAll("mynodes")
        .data(beverages)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return(xScale(d.name))})
            .attr("cy", height-margin.bottom-30)
            .attr("r", 6)
            .style("fill", "#A5ADBD")
            .style("stroke", "#FFFFFF")
            .style("visibility", "hidden")
            .attr("pointer-events","none");
    var beverageLabels = svg.selectAll("mylabels")
        .data(beverages)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 10)
            .attr("fill","#A5ADBD")
            .style("text-anchor", "end")
            .style("visibility", "hidden");
    
    var nodeLabels = svg.selectAll("mylabels")
        .data(nodes)
        .enter()
        .append("text")
            .attr("x", 0)
            .attr("y", 0)    
            .text(function(d){ return(d.name)})
            .attr("transform", function(d){ return( "translate(" + (xScale(d.name)) + "," + (height-margin.bottom-20) + ")rotate(-80)")})
            .style("font-size", 6)
            .attr("fill", function(nodes) {
                if(nodes.type === "product") {
                    return "black";
                }else{
                    return colorScale(nodes.family);
                }
            }) 
            .style("text-anchor", "end");     
    
    points.on("mouseover", function(d) {
        grassPoints.style("visibility", "hidden")
        grassLabels.style("visibility", "hidden")
        citrusPoints.style("visibility", "hidden")
        citrusLabels.style("visibility", "hidden")
        woodPoints.style("visibility", "hidden")
        woodLabels.style("visibility", "hidden")
        whitePoints.style("visibility", "hidden")
        whiteLabels.style("visibility", "hidden")
        flowerPoints.style("visibility", "hidden")
        flowerLabels.style("visibility", "hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("opacity", 1)
        points.attr("opacity", .2)
        arcs.attr("opacity", .2)
        d3.select(this).attr("opacity", 1)
            .attr("r", 6)
        nodeLabels.style("font-size", function(label){ 
            if(label.name === d.name){
                return 18;
            }else{
                return 2;
            }
        });
        var connected = arcs.filter(function (e) { return e.source === d.name || e.target === d.name; });
            connected.attr("opacity", "1")
                .attr("stroke", "#404041")
                .attr("stroke-width", 2);
            connected.each(function(e) {
                points.filter(function(f) {return f.name === e.source || f.name === e.target;})
                .attr("opacity",1)
                .attr("r",6);
                nodeLabels.filter(function (f) {return f.name === e.source || f.name === e.target;})
                .style("font-size", 10)  
            });   
    }).on("mouseout", function() {
        points.attr("opacity",1)
            .attr("r", 4);
        arcs.attr("opacity",1)
            .attr("stroke", "#BBBDC0")
            .attr("stroke-width", 1);
        nodeLabels.style("font-size", 6)
    });

    var margin2 = {top: 100, left: 75, right: 25, bottom: 150};
    var width2 = document.querySelector("#filters").clientWidth;
    var height2 = document.querySelector("#filters").clientHeight;
    
    var svg2 = d3.select("#filters")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2);

    
    var filterExplanation1 = svg2.append("text")
        .attr("x", margin.left)
        .attr("y", height2/3-10)
        .attr("text-anchor", "start")
        .attr("fill", "#3D3C34")
        .attr("class", "instructions")
        .text("Byredo perfumers use notes from many fragrance families.");
    var filterExplanation2 = svg2.append("text")
        .attr("x", margin.left)
        .attr("y", 2*height2/3-25)
        .attr("text-anchor", "start")
        .attr("fill", "#3D3C34")
        .attr("class", "instructions")
        .text("Select a family name to view its notes:");
    var filterExplanation3 = svg2.append("text")
        .attr("x", margin.left)
        .attr("y", height2-10)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("class", "filter")
        .text("Or click here to reset.");
    filterExplanation3.on("click", function(d){
        grassPoints.style("visibility", "hidden")
        grassLabels.style("visibility", "hidden")
        citrusPoints.style("visibility", "hidden")
        citrusLabels.style("visibility", "hidden")
        woodPoints.style("visibility", "hidden")
        woodLabels.style("visibility", "hidden")
        whitePoints.style("visibility", "hidden")
        whiteLabels.style("visibility", "hidden")
        flowerPoints.style("visibility", "hidden")
        flowerLabels.style("visibility", "hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("opacity", 1)
        points.attr("opacity", 1)
        arcs.attr("opacity", 1)
    });

    var filterGrass = svg2.append("text")
        .attr("x", width2/3)
        .attr("y", height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#72A741")
        .attr("class", "filter")
        .text("Grasses");
    filterGrass.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","visible")
        grassLabels.style("visibility","visible")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        points.attr("opacity", .2)
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterCitrus = svg2.append("text")
        .attr("x", width2/2)
        .attr("y", height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#FCC730")
        .attr("class", "filter")
        .text("Citrus");
    filterCitrus.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","visible")
        citrusLabels.style("visibility","visible")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        points.attr("opacity", .2)
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterWoods = svg2.append("text")
        .attr("x", 2*width2/3)
        .attr("y", height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#006031")
        .attr("class", "filter")
        .text("Woods");
    filterWoods.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","visible")
        woodLabels.style("visibility","visible")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        points.attr("opacity", .2)
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterWhites = svg2.append("text")
        .attr("x", 5*width2/6)
        .attr("y", height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#CCD6A1")
        .attr("class", "filter")
        .text("White Florals");
    filterWhites.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","visible")
        whiteLabels.style("visibility","visible")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        points.attr("opacity", .2)
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });
    
    var filterFlowers = svg2.append("text")
        .attr("x", width2/3)
        .attr("y", 2*height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "left")
        .attr("fill", "#EFA5B2")
        .attr("class", "filter")
        .text("Flowers");
    filterFlowers.on("click", function(d){
        flowerPoints.style("visibility","visible")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","visible")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterSynthetic = svg2.append("text")
        .attr("x", width2/2)
        .attr("y", 2*height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#67A3B5")
        .attr("class", "filter")
        .text("Synthetics");
    filterSynthetic.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","visible")
        syntheticLabels.style("visibility","visible")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterSweet = svg2.append("text")
        .attr("x", 2*width2/3)
        .attr("y", 2*height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#CF873A")
        .attr("class", "filter")
        .text("Sweets");
    filterSweet.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","visible")
        sweetLabels.style("visibility","visible")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterFruit = svg2.append("text")
        .attr("x", 5*width2/6)
        .attr("y", 2*height2/3-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#CE2348")
        .attr("class", "filter")
        .text("Fruits");
    filterFruit.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","visible")
        fruitLabels.style("visibility","visible")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterAnimalic = svg2.append("text")
        .attr("x", width2/3)
        .attr("y", height2-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#875F50")
        .attr("class", "filter")
        .text("Animalic");
    filterAnimalic.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","visible")
        animalicLabels.style("visibility","visible")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterResin = svg2.append("text")
        .attr("x", width2/2)
        .attr("y", height2-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#4D3368")
        .attr("class", "filter")
        .text("Resins & Balsams");
    filterResin.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","visible")
        resinLabels.style("visibility","visible")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
    });

    var filterSpice = svg2.append("text")
        .attr("x", 2*width2/3)
        .attr("y", height2-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#9A3520")
        .attr("class", "filter")
        .text("Spices");
    filterSpice.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","visible")
        spiceLabels.style("visibility","visible")
        beveragePoints.style("visibility","hidden")
        beverageLabels.style("visibility","hidden")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
        });

    var filterBeverage = svg2.append("text")
        .attr("x", 5*width2/6)
        .attr("y", height2-10)
        .attr("class", "familyFilter")
        .attr("text-anchor", "start")
        .attr("fill", "#A5ADBD")
        .attr("class", "filter")
        .text("Beverages");
    filterBeverage.on("click", function(d){
        flowerPoints.style("visibility","hidden")
        points.attr("opacity", .2)
        flowerLabels.style("visibility","hidden")
        citrusPoints.style("visibility","hidden")
        citrusLabels.style("visibility","hidden")
        grassPoints.style("visibility","hidden")
        grassLabels.style("visibility","hidden")
        woodPoints.style("visibility","hidden")
        woodLabels.style("visibility","hidden")
        whitePoints.style("visibility","hidden")
        whiteLabels.style("visibility","hidden")
        syntheticPoints.style("visibility","hidden")
        syntheticLabels.style("visibility","hidden")
        sweetPoints.style("visibility","hidden")
        sweetLabels.style("visibility","hidden")
        fruitPoints.style("visibility","hidden")
        fruitLabels.style("visibility","hidden")
        animalicPoints.style("visibility","hidden")
        animalicLabels.style("visibility","hidden")
        resinPoints.style("visibility","hidden")
        resinLabels.style("visibility","hidden")
        spicePoints.style("visibility","hidden")
        spiceLabels.style("visibility","hidden")
        beveragePoints.style("visibility","visible")
        beverageLabels.style("visibility","visible")
        nodeLabels.attr("font-size",2)
        nodeLabels.attr("opacity", .2);  
        });
    
    var typePerfume = svg.append("text")
        .attr("x", margin.left)
        .attr("y", height-80)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("class", "label")
        .text("The Perfumes");

    var typeNote = svg.append("text")
        .attr("x", width/4+10)
        .attr("y", height-80)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("class", "label")
        .text("The Notes");

    var instructions = svg.append("text")
        .attr("x", margin.left)
        .attr("y", height-60)
        .attr("text-anchor", "start")
        .attr("fill", "#3D3C34")
        .attr("class", "instructions")
        .text("Hover over a perfume to view its notes.");
});
    

function parseCSV(byredo) {
    var d = {};
    d.productname = byredo.productname;
    d.top = byredo.top.split(",");
    d.heart = byredo.heart.split(",");
    d.base = byredo.base.split(",");
    d.notes = d.top.concat(d.heart, d.base);

    return d;

}

function parseAgain(notelibrary) {
    var lib = {};
    lib.note = notelibrary.notename;
    lib.family = notelibrary.familyname;

    return lib;

}

